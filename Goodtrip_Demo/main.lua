local mod = RegisterMod("MyGoodTrip", 1)
Isaac.DebugString("[MyGoodTrip] main.lua loaded")

local ROOM_GRID_WIDTH = 13
local MAP_ORIGIN_X = 20
local MAP_ORIGIN_Y = 40
local MAP_CELL_SIZE = 10

local leftWasDown = false

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

local function handleMapClick()
    local game = Game()
    local level = game:GetLevel()
    if not isOnMainMap(level) then
        return
    end

    local rooms = readFloorRooms(level)
    local cells = buildMapCells(rooms, MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_CELL_SIZE)

    local mouse = Isaac.WorldToScreen(Input.GetMousePosition(true))
    local selectedRoomIndex = getClickedRoomIndex(cells, mouse.X, mouse.Y)
    if selectedRoomIndex == nil then
        return
    end

    local roomCleared = game:GetRoom():IsClear()
    local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex
    local targets = getTeleportTargets(roomCleared, currentGridIndex, rooms)
    local target = findTeleportTarget(targets, selectedRoomIndex)
    if target == nil then
        return
    end

    level.LeaveDoor = -1
    game:ChangeRoom(target.index)
end

local function onUpdate()
    local leftDown = Input.IsMouseBtnPressed(Mouse.MOUSE_BUTTON_LEFT)
    local justClicked = leftDown and not leftWasDown
    leftWasDown = leftDown

    if justClicked and Input.IsButtonPressed(Keyboard.KEY_TAB, 0) then
        handleMapClick()
        return
    end

    if not Input.IsButtonTriggered(Keyboard.KEY_F6, 0) then
        return
    end

    local game = Game()
    local level = game:GetLevel()
    local roomCleared = game:GetRoom():IsClear()
    local currentRoomIndex = level:GetCurrentRoomIndex()
    local targetRoomIndex = level:GetStartingRoomIndex()

    if not isOnMainMap(level) then
        return
    end

    local rooms = readFloorRooms(level)
    local cells = buildMapCells(rooms, MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_CELL_SIZE)

    for _, cell in ipairs(cells) do
        Isaac.DebugString(string.format(
            "[MyGoodTrip] room %d at (%d, %d)", cell.index, cell.x, cell.y
        ))
    end

    local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex
    local targets = getTeleportTargets(roomCleared, currentGridIndex, rooms)

    Isaac.DebugString("[MyGoodTrip] targets = " .. #targets)
    for _, room in ipairs(targets) do
        Isaac.DebugString("[MyGoodTrip] target room = " .. room.index)
    end

    if not canTeleport(roomCleared, currentRoomIndex, targetRoomIndex) then
        return
    end

    local targetRoom = level:GetRoomByIdx(targetRoomIndex)
    if targetRoom.Data == nil then
        return
    end

    level.LeaveDoor = -1
    game:ChangeRoom(targetRoomIndex)
end

local function onRender()
    if not Input.IsButtonPressed(Keyboard.KEY_TAB, 0) then
        return
    end

    local level = Game():GetLevel()
    if not isOnMainMap(level) then
        return
    end

    local rooms = readFloorRooms(level)
    local cells = buildMapCells(rooms, MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_CELL_SIZE)
    local currentGridIndex = level:GetCurrentRoomDesc().SafeGridIndex

    for _, cell in ipairs(cells) do
        local marker = "+"
        if cell.index == currentGridIndex then
            marker = "@"
        end

        Isaac.RenderText(marker, cell.x + 2, cell.y, 1, 1, 1, 1)
    end
end

mod:AddCallback(ModCallbacks.MC_POST_UPDATE, onUpdate)
mod:AddCallback(ModCallbacks.MC_POST_RENDER, onRender)