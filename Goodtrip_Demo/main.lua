local mod = RegisterMod("MyGoodTrip", 1)
Isaac.DebugString("[MyGoodTrip] main.lua loaded")

local ROOM_GRID_WIDTH = 13
local MAP_ORIGIN_X = 20
local MAP_ORIGIN_Y = 40
local MAP_CELL_SIZE = 10
local DIRECTION_REPEAT_DELAY = 300
local DIRECTION_REPEAT_INTERVAL = 120

local leftWasDown = false
local selectedRoomIndex = nil
local mapControllerIndex = nil
local heldDirectionX = 0
local heldDirectionY = 0
local nextDirectionTime = 0
local pendingRoomIndex = nil

local blockedMapActions = {
    [ButtonAction.ACTION_LEFT] = true,
    [ButtonAction.ACTION_RIGHT] = true,
    [ButtonAction.ACTION_UP] = true,
    [ButtonAction.ACTION_DOWN] = true,
    [ButtonAction.ACTION_SHOOTLEFT] = true,
    [ButtonAction.ACTION_SHOOTRIGHT] = true,
    [ButtonAction.ACTION_SHOOTUP] = true,
    [ButtonAction.ACTION_SHOOTDOWN] = true,
    [ButtonAction.ACTION_BOMB] = true,
    [ButtonAction.ACTION_ITEM] = true,
    [ButtonAction.ACTION_PILLCARD] = true,
    [ButtonAction.ACTION_DROP] = true,
}

local function canTeleport(roomCleared, currentRoomIndex, targetRoomIndex)
    if roomCleared and currentRoomIndex ~= targetRoomIndex then
        return true
    end

    return false
end

local function isEligibleTarget(room)
    return room.visitedCount >= 1 and room.clear == true
end

local function canTeleportToRoom(roomCleared, currentRoomIndex, room)
    return isEligibleTarget(room)
        and canTeleport(roomCleared, currentRoomIndex, room.index)
end

local function getTeleportTargets(roomCleared, currentRoomIndex, rooms)
    local targets = {}

    for _, room in ipairs(rooms) do
        if canTeleportToRoom(roomCleared, currentRoomIndex, room) then
            table.insert(targets, room)
        end
    end

    return targets
end

local function readFloorRooms(level)
    local descriptors = level:GetRooms()
    local rooms = {}

    for i = 0, descriptors.Size - 1 do
        local desc = descriptors:Get(i)

        if desc.Data ~= nil and desc.SafeGridIndex >= 0 then
            local roomAtIndex = level:GetRoomByIdx(desc.SafeGridIndex)

            if roomAtIndex.Data ~= nil and roomAtIndex.ListIndex == desc.ListIndex then
                table.insert(rooms, {
                    index = desc.SafeGridIndex,
                    visitedCount = desc.VisitedCount,
                    clear = desc.Clear,
                    isOneByOne = desc.Data.Shape == RoomShape.ROOMSHAPE_1x1,
                })
            end
        end
    end

    return rooms
end

local function buildMapCells(rooms, originX, originY, cellSize)
    local cells = {}

    for _, room in ipairs(rooms) do
        if room.visitedCount > 0 and room.isOneByOne then
            local column = room.index % ROOM_GRID_WIDTH
            local row = room.index // ROOM_GRID_WIDTH

            table.insert(cells, {
                index = room.index,
                x = originX + column * cellSize,
                y = originY + row * cellSize,
                size = cellSize,
                clear = room.clear,
            })
        end
    end

    return cells
end

local function getClickedRoomIndex(cells, mouseX, mouseY)
    for _, cell in ipairs(cells) do
        local insideX = mouseX >= cell.x and mouseX < cell.x + cell.size
        local insideY = mouseY >= cell.y and mouseY < cell.y + cell.size

        if insideX and insideY then
            return cell.index
        end
    end

    return nil
end

local function findTeleportTarget(targets, selectedRoomIndex)
    for _, room in ipairs(targets) do
        if room.index == selectedRoomIndex then
            return room
        end
    end

    return nil
end

local function isOnMainMap(level)
    local index = level:GetCurrentRoomIndex()
    if index < 0 or index >= ROOM_GRID_WIDTH * ROOM_GRID_WIDTH then
        return false
    end

    local current = level:GetCurrentRoomDesc()
    local mainRoom = level:GetRoomByIdx(current.SafeGridIndex, 0)
    return mainRoom.Data ~= nil and mainRoom.ListIndex == current.ListIndex
end

local function handleMapClick(cells, targets)
    local mouse = Isaac.WorldToScreen(Input.GetMousePosition(true))
    local clickedRoomIndex = getClickedRoomIndex(cells, mouse.X, mouse.Y)
    if clickedRoomIndex == nil then
        return
    end

    selectedRoomIndex = clickedRoomIndex
    local target = findTeleportTarget(targets, selectedRoomIndex)
    if target ~= nil then
        pendingRoomIndex = target.index
    end
end

local function getMapControllerIndex()
    local controllerIndex = Isaac.GetPlayer(0).ControllerIndex
    if Input.IsActionPressed(ButtonAction.ACTION_MAP, controllerIndex) then
        return controllerIndex
    end

    if Input.IsActionPressed(ButtonAction.ACTION_MAP, 0)
        or Input.IsButtonPressed(Keyboard.KEY_TAB, 0) then
        return 0
    end
end

local function resetMapSelection()
    selectedRoomIndex = nil
    mapControllerIndex = nil
    heldDirectionX = 0
    heldDirectionY = 0
    nextDirectionTime = 0
end

local function getNavigationDirection(controllerIndex)
    local horizontal = Input.GetActionValue(ButtonAction.ACTION_RIGHT, controllerIndex)
        - Input.GetActionValue(ButtonAction.ACTION_LEFT, controllerIndex)
    local vertical = Input.GetActionValue(ButtonAction.ACTION_DOWN, controllerIndex)
        - Input.GetActionValue(ButtonAction.ACTION_UP, controllerIndex)

    if controllerIndex == 0 then
        if Input.IsButtonPressed(Keyboard.KEY_RIGHT, 0) then
            horizontal = horizontal + 1
        end
        if Input.IsButtonPressed(Keyboard.KEY_LEFT, 0) then
            horizontal = horizontal - 1
        end
        if Input.IsButtonPressed(Keyboard.KEY_DOWN, 0) then
            vertical = vertical + 1
        end
        if Input.IsButtonPressed(Keyboard.KEY_UP, 0) then
            vertical = vertical - 1
        end
    end

    if math.abs(horizontal) < 0.5 and math.abs(vertical) < 0.5 then
        return 0, 0
    end

    if math.abs(horizontal) >= math.abs(vertical) then
        return horizontal > 0 and 1 or -1, 0
    end

    return 0, vertical > 0 and 1 or -1
end

local function moveMapSelection(cells, directionX, directionY)
    local column = selectedRoomIndex % ROOM_GRID_WIDTH
    local row = selectedRoomIndex // ROOM_GRID_WIDTH
    local bestIndex = selectedRoomIndex
    local bestScore = math.huge

    for _, cell in ipairs(cells) do
        local offsetX = cell.index % ROOM_GRID_WIDTH - column
        local offsetY = cell.index // ROOM_GRID_WIDTH - row
        local forward = offsetX * directionX + offsetY * directionY
        local sideways = math.abs(offsetX * directionY - offsetY * directionX)
        local score = forward + sideways * ROOM_GRID_WIDTH

        if forward > 0 and score < bestScore then
            bestIndex = cell.index
            bestScore = score
        end
    end

    selectedRoomIndex = bestIndex
end

local function handleMapInput(controllerIndex, cells, targets)
    local directionX, directionY = getNavigationDirection(controllerIndex)
    local now = Isaac.GetTime()

    if directionX == 0 and directionY == 0 then
        heldDirectionX = 0
        heldDirectionY = 0
        nextDirectionTime = 0
    elseif directionX ~= heldDirectionX or directionY ~= heldDirectionY then
        moveMapSelection(cells, directionX, directionY)
        heldDirectionX = directionX
        heldDirectionY = directionY
        nextDirectionTime = now + DIRECTION_REPEAT_DELAY
    elseif now >= nextDirectionTime then
        moveMapSelection(cells, directionX, directionY)
        nextDirectionTime = now + DIRECTION_REPEAT_INTERVAL
    end

    if Input.IsActionTriggered(ButtonAction.ACTION_MENUCONFIRM, controllerIndex) then
        local target = findTeleportTarget(targets, selectedRoomIndex)
        if target ~= nil then
            pendingRoomIndex = target.index
        end
    end
end

local function onUpdate()
    local targetRoomIndex = pendingRoomIndex
    pendingRoomIndex = nil
    if targetRoomIndex == nil then
        return
    end

    local game = Game()
    local level = game:GetLevel()
    if game:GetNumPlayers() == 0 or game:IsPaused() or not isOnMainMap(level) then
        return
    end

    local targetRoom = level:GetRoomByIdx(targetRoomIndex)
    if targetRoom.Data == nil then
        return
    end

    local target = {
        index = targetRoomIndex,
        visitedCount = targetRoom.VisitedCount,
        clear = targetRoom.Clear,
    }
    local roomCleared = game:GetRoom():IsClear()
    local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex
    if not canTeleportToRoom(roomCleared, currentGridIndex, target) then
        return
    end

    level.LeaveDoor = -1
    game:ChangeRoom(targetRoomIndex)
end

local function onRender()
    local leftDown = Input.IsMouseBtnPressed(Mouse.MOUSE_BUTTON_LEFT)
    local justClicked = leftDown and not leftWasDown
    leftWasDown = leftDown

    local game = Game()
    if game:GetNumPlayers() == 0 or game:IsPaused() then
        resetMapSelection()
        pendingRoomIndex = nil
        return
    end

    local level = game:GetLevel()
    if not isOnMainMap(level) then
        resetMapSelection()
        pendingRoomIndex = nil
        return
    end

    if Input.IsButtonTriggered(Keyboard.KEY_F6, 0) then
        local rooms = readFloorRooms(level)
        local cells = buildMapCells(rooms, MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_CELL_SIZE)
        local roomCleared = game:GetRoom():IsClear()
        local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex
        local targets = getTeleportTargets(roomCleared, currentGridIndex, rooms)

        for _, cell in ipairs(cells) do
            Isaac.DebugString(string.format(
                "[MyGoodTrip] room %d at (%d, %d)", cell.index, cell.x, cell.y
            ))
        end

        Isaac.DebugString("[MyGoodTrip] targets = " .. #targets)
        for _, room in ipairs(targets) do
            Isaac.DebugString("[MyGoodTrip] target room = " .. room.index)
        end

        pendingRoomIndex = level:GetStartingRoomIndex()
    end

    local controllerIndex = getMapControllerIndex()
    if controllerIndex == nil then
        resetMapSelection()
        return
    end

    local rooms = readFloorRooms(level)
    local cells = buildMapCells(rooms, MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_CELL_SIZE)
    local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex
    local roomCleared = game:GetRoom():IsClear()
    local targets = getTeleportTargets(roomCleared, currentGridIndex, rooms)

    if mapControllerIndex ~= controllerIndex then
        resetMapSelection()
        mapControllerIndex = controllerIndex
        selectedRoomIndex = currentGridIndex
    end

    if roomCleared then
        handleMapInput(controllerIndex, cells, targets)
        if justClicked then
            handleMapClick(cells, targets)
        end
    else
        selectedRoomIndex = currentGridIndex
        heldDirectionX = 0
        heldDirectionY = 0
        nextDirectionTime = 0
    end

    for _, cell in ipairs(cells) do
        local marker = "+"
        local red, green, blue = 0.5, 0.5, 0.5
        if cell.clear then
            red, green, blue = 0.4, 1, 0.4
        end
        if cell.index == currentGridIndex then
            marker = "@"
            red, green, blue = 1, 1, 1
        end
        if cell.index == selectedRoomIndex then
            marker = ">"
            red, green, blue = 1, 0.8, 0.2
        end

        Isaac.RenderText(marker, cell.x + 2, cell.y, red, green, blue, 1)
    end

    local hintY = MAP_ORIGIN_Y + ROOM_GRID_WIDTH * MAP_CELL_SIZE + 6
    if roomCleared then
        Isaac.RenderText("Move: select | Enter/A: teleport", MAP_ORIGIN_X, hintY, 1, 1, 1, 1)
        Isaac.RenderText("Click: teleport | Release map: close", MAP_ORIGIN_X, hintY + 12, 1, 1, 1, 1)
    else
        Isaac.RenderText("Clear this room before teleporting.", MAP_ORIGIN_X, hintY, 1, 0.5, 0.5, 1)
    end
end

local function onInputAction(_, entity, inputHook, buttonAction)
    if entity == nil or not blockedMapActions[buttonAction] then
        return
    end

    local player = entity:ToPlayer()
    local game = Game()
    if player == nil or game:GetNumPlayers() == 0 or game:IsPaused() then
        return
    end

    if player.ControllerIndex ~= Isaac.GetPlayer(0).ControllerIndex then
        return
    end

    if getMapControllerIndex() == nil or not game:GetRoom():IsClear()
        or not isOnMainMap(game:GetLevel()) then
        return
    end

    if inputHook == InputHook.GET_ACTION_VALUE then
        return 0
    end

    return false
end

local function resetInputState()
    resetMapSelection()
    pendingRoomIndex = nil
    leftWasDown = Input.IsMouseBtnPressed(Mouse.MOUSE_BUTTON_LEFT)
end

mod:AddCallback(ModCallbacks.MC_POST_UPDATE, onUpdate)
mod:AddCallback(ModCallbacks.MC_POST_RENDER, onRender)
mod:AddCallback(ModCallbacks.MC_INPUT_ACTION, onInputAction)
mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, resetInputState)
mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, resetInputState)
mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, resetInputState)
