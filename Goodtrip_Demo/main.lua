local mod = RegisterMod("GoodTrip Plus", 1)

local MAIN_DIMENSION = 0
local FLOOR_GRID_SIZE = 13 * 13
local MENU_X, MENU_Y = 18, 45
local MENU_ROWS = 8
local GRID_TILE_SIZE = 40
local REPEAT_DELAY, REPEAT_INTERVAL = 300, 120

local text = {
    title = {"GoodTrip Plus", "GoodTrip Plus"},
    help = {"上下选房，确认传送，松开地图键关闭", "Up/Down: select | Confirm | Release map: close"},
    start = {"初始房", "Starting Room"},
    treasure = {"宝箱房", "Treasure Room"},
    shop = {"商店", "Shop"},
    boss = {"首领房", "Boss Room"},
    anchor = {"返回锚点", "Anchor"},
    mark = {"把当前房设为锚点", "Mark this room"},
    anchorSet = {"锚点已设置在当前房", "Anchor set in this room"},
    combat = {"清理当前房间后才能传送", "Clear this room before teleporting"},
    controls = {"恢复角色控制后才能传送", "Wait until player controls are available"},
    dimension = {"仅主世界的普通楼层房间可用", "Main dimension floor rooms only"},
    ascent = {"回家流程中暂停传送", "Teleportation unavailable during Ascent or Home"},
    greed = {"贪婪模式中暂停传送", "Teleportation unavailable in Greed mode"},
    lost = {"迷失诅咒期间暂停传送", "Teleportation blocked by Curse of the Lost"},
    curseRoom = {"请从刺房的门离开", "Leave the Curse Room through its door"},
    specialRoom = {"当前房间有特殊流程，请从门离开", "Leave this special room normally"},
    specialDoor = {"恶魔房或天使房的门已开，请先走门", "Use the open Devil or Angel door first"},
    invalidTarget = {"目标房间暂时无法传送", "Destination is no longer available"},
    unsafeOrigin = {"当前房间找不到可用于返回的落点", "No clear landing tile in this room"},
    returned = {"目标房找不到合适落点，已返回原房", "No clear landing tile; returned to origin"},
    failed = {"传送中止，请使用房间的门", "Teleport stopped; use the room doors"},
}

local quickRooms = {
    [RoomType.ROOM_TREASURE] = {order = 2, name = text.treasure},
    [RoomType.ROOM_SHOP] = {order = 3, name = text.shop},
    [RoomType.ROOM_BOSS] = {order = 4, name = text.boss},
}
local startingRoom = {order = 1, name = text.start}

local allowedRooms = {
    [RoomType.ROOM_DEFAULT] = true,
    [RoomType.ROOM_TREASURE] = true,
    [RoomType.ROOM_SHOP] = true,
    [RoomType.ROOM_BOSS] = true,
    [RoomType.ROOM_MINIBOSS] = true,
    [RoomType.ROOM_SECRET] = true,
    [RoomType.ROOM_SUPERSECRET] = true,
    [RoomType.ROOM_ULTRASECRET] = true,
    [RoomType.ROOM_ARCADE] = true,
    [RoomType.ROOM_LIBRARY] = true,
    [RoomType.ROOM_SACRIFICE] = true,
    [RoomType.ROOM_ISAACS] = true,
    [RoomType.ROOM_BARREN] = true,
    [RoomType.ROOM_CHEST] = true,
    [RoomType.ROOM_DICE] = true,
    [RoomType.ROOM_PLANETARIUM] = true,
}

local blockedActions = {
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

local landingObstacles = {
    [EntityType.ENTITY_BOMB] = true,
    [EntityType.ENTITY_EFFECT] = true,
    [EntityType.ENTITY_FIREPLACE] = true,
    [EntityType.ENTITY_PICKUP] = true,
    [EntityType.ENTITY_PROJECTILE] = true,
    [EntityType.ENTITY_SLOT] = true,
}

local gridSteps = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}}

local menuFont = Font()
local fontLoaded = pcall(function()
    menuFont:Load("font/cjk/lanapixel.fnt")
end) and menuFont:IsLoaded()
local rowHeight = fontLoaded and math.max(12, menuFont:GetLineHeight() + 1) or 12

local anchor
local pendingChoice
local menuController
local highlightedEntry
local selection = 1
local heldDirection = 0
local nextRepeatTime = 0
local waitForRelease = false
local notice, noticeUntil

local function getMainRoom(level, index, listIndex)
    if index < 0 or index >= FLOOR_GRID_SIZE then
        return nil
    end
    local desc = level:GetRoomByIdx(index, MAIN_DIMENSION)
    if desc and desc.Data and desc.SafeGridIndex == index and desc.ListIndex == listIndex then
        return desc
    end
end

local function getCurrentMainRoom(level)
    local index = level:GetCurrentRoomIndex()
    if index < 0 or index >= FLOOR_GRID_SIZE then
        return nil
    end
    local current = level:GetCurrentRoomDesc()
    return getMainRoom(level, current.SafeGridIndex, current.ListIndex)
end

local function getEligibleTarget(level, index, listIndex)
    local desc = getMainRoom(level, index, listIndex)
    if desc and desc.VisitedCount > 0 and desc.Clear and allowedRooms[desc.Data.Type] then
        return desc
    end
end

local function hasOpenSpecialDoor(room)
    for slot = 0, DoorSlot.NUM_DOOR_SLOTS - 1 do
        local door = room:GetDoor(slot)
        if door and door:IsOpen() and (door.TargetRoomType == RoomType.ROOM_DEVIL
            or door.TargetRoomType == RoomType.ROOM_ANGEL or door.TargetRoomIndex == GridRooms.ROOM_DEVIL_IDX) then
            return true
        end
    end
    return false
end

local function getBlockReason(game, level, current)
    if level:IsAscent() or level:GetStage() == LevelStage.STAGE8
        or game:GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH_INIT) then
        return text.ascent
    end
    if game:IsGreedMode() then
        return text.greed
    end
    if not current then
        return text.dimension
    end
    if current.Data.Type == RoomType.ROOM_CURSE then
        return text.curseRoom
    end
    if not allowedRooms[current.Data.Type] then
        return text.specialRoom
    end
    if (level:GetCurses() & LevelCurse.CURSE_OF_THE_LOST) ~= 0 then
        return text.lost
    end
    local room = game:GetRoom()
    if not room:IsClear() or room:IsAmbushActive() then
        return text.combat
    end
    if hasOpenSpecialDoor(room) then
        return text.specialDoor
    end
    local player = Isaac.GetPlayer(0)
    if player:IsDead() or not player:AreControlsEnabled() then
        return text.controls
    end
end

local function buildEntries(level, current, floorSeed)
    local entries, counts = {}, {}
    local startingIndex = level:GetStartingRoomIndex()
    local rooms = level:GetRooms()
    for i = 0, rooms.Size - 1 do
        local desc = rooms:Get(i)
        if desc and desc.Data and desc.ListIndex ~= current.ListIndex then
            local group = desc.SafeGridIndex == startingIndex and startingRoom or quickRooms[desc.Data.Type]
            if group and getEligibleTarget(level, desc.SafeGridIndex, desc.ListIndex) then
                entries[#entries + 1] = {
                    name = group.name, order = group.order, roomIndex = desc.SafeGridIndex, listIndex = desc.ListIndex,
                }
                counts[group.order] = (counts[group.order] or 0) + 1
            end
        end
    end
    table.sort(entries, function(left, right)
        if left.order == right.order then
            return left.roomIndex < right.roomIndex
        end
        return left.order < right.order
    end)
    local seen = {}
    for _, entry in ipairs(entries) do
        if counts[entry.order] > 1 then
            seen[entry.order] = (seen[entry.order] or 0) + 1
            entry.suffix = " #" .. seen[entry.order]
        end
    end
    if anchor and anchor.floorSeed == floorSeed and anchor.listIndex ~= current.ListIndex
        and getEligibleTarget(level, anchor.roomIndex, anchor.listIndex) then
        entries[#entries + 1] = {name = text.anchor, roomIndex = anchor.roomIndex, listIndex = anchor.listIndex}
    end
    entries[#entries + 1] = {name = text.mark, markAnchor = true}
    return entries
end

local function isClearLandingTile(room, gridIndex, position, radius)
    if room:GetGridEntity(gridIndex) or room:GetGridCollision(gridIndex) ~= GridCollisionClass.COLLISION_NONE
        or not room:IsPositionInRoom(position, radius) then
        return false
    end
    local neighborRange = math.floor(radius / GRID_TILE_SIZE + 0.5)
    if neighborRange == 0 then
        return true
    end
    for x = -neighborRange, neighborRange do
        for y = -neighborRange, neighborRange do
            local nearby = Vector(position.X + x * GRID_TILE_SIZE, position.Y + y * GRID_TILE_SIZE)
            if room:GetGridEntityFromPos(nearby) or room:GetGridCollisionAtPos(nearby) ~= GridCollisionClass.COLLISION_NONE then
                return false
            end
        end
    end
    return true
end

local function getHitboxRadius(entity)
    local scale = entity.SizeMulti
    if scale then
        return entity.Size * math.max(1, math.abs(scale.X), math.abs(scale.Y))
    end
    return entity.Size
end

local function offsetTile(position, step)
    return Vector(position.X + step[1] * GRID_TILE_SIZE, position.Y + step[2] * GRID_TILE_SIZE)
end

local function checkLandingObstacles(position, safeRadius, obstacles)
    local canLand = true
    for _, obstacle in ipairs(obstacles) do
        if position:DistanceSquared(obstacle.position) <= (obstacle.radius + safeRadius + 6)^2 then
            if obstacle.blocksWalking then
                return false, false
            end
            canLand = false
        end
    end
    return true, canLand
end

local function getLandingPosition(game, room, fallbackPosition)
    local safeRadius = 16
    for i = 0, game:GetNumPlayers() - 1 do
        safeRadius = math.max(safeRadius, getHitboxRadius(Isaac.GetPlayer(i)) + 3)
    end

    local obstacles = {}
    for _, entity in ipairs(Isaac.GetRoomEntities()) do
        if landingObstacles[entity.Type] or entity:IsActiveEnemy(false) then
            obstacles[#obstacles + 1] = {
                position = entity.Position,
                radius = getHitboxRadius(entity),
                blocksWalking = entity.Type ~= EntityType.ENTITY_PICKUP,
            }
        end
    end

    local gridSize = room:GetGridSize()
    local queue, visited = {}, {}
    local function enqueue(position)
        if not room:IsPositionInRoom(position, 0) then
            return
        end
        local gridIndex = room:GetGridIndex(position)
        if gridIndex >= 0 and gridIndex < gridSize and not visited[gridIndex] then
            visited[gridIndex] = true
            queue[#queue + 1] = gridIndex
        end
    end

    for slot = 0, DoorSlot.NUM_DOOR_SLOTS - 1 do
        local door = room:GetDoor(slot)
        if door and door:IsOpen() and door.TargetRoomIndex >= 0 and door.TargetRoomIndex < FLOOR_GRID_SIZE then
            local inward = gridSteps[slot % #gridSteps + 1]
            enqueue(offsetTile(room:GetDoorSlotPosition(slot), inward))
        end
    end
    if fallbackPosition then
        enqueue(fallbackPosition)
    end

    local cursor = 1
    while cursor <= #queue do
        local gridIndex = queue[cursor]
        local position = room:GetGridPosition(gridIndex)
        if isClearLandingTile(room, gridIndex, position, safeRadius) then
            local canWalk, canLand = checkLandingObstacles(position, safeRadius, obstacles)
            if canLand then
                return position
            end
            if canWalk then
                for _, step in ipairs(gridSteps) do
                    enqueue(offsetTile(position, step))
                end
            end
        end
        cursor = cursor + 1
    end
end

local function landInCurrentRoom(game, fallbackPosition)
    local room = game:GetRoom()
    if not room:IsClear() or room:IsAmbushActive() then
        return false
    end
    local position = getLandingPosition(game, room, fallbackPosition)
    if not position then
        return false
    end
    for i = 0, game:GetNumPlayers() - 1 do
        local player = Isaac.GetPlayer(i)
        player.Position = position
        player.Velocity = Vector.Zero
    end
    return true
end

local function showNotice(message)
    notice, noticeUntil = message, Isaac.GetTime() + 2200
end

local function changeRoom(game, level, index, floorSeed)
    local previousRoom = level:GetCurrentRoomDesc().ListIndex
    local previousDoor = level.LeaveDoor
    level.LeaveDoor = -1
    game:ChangeRoom(index, MAIN_DIMENSION)

    local reachedLevel = game:GetLevel()
    local reached = getCurrentMainRoom(reachedLevel)
    if not reached or reachedLevel:GetDungeonPlacementSeed() ~= floorSeed then
        return nil
    end
    if reached.ListIndex == previousRoom then
        reachedLevel.LeaveDoor = previousDoor
    end
    return reached, reachedLevel
end

local function teleport(game, level, origin, destination, floorSeed)
    local originLanding = getLandingPosition(game, game:GetRoom(), Isaac.GetPlayer(0).Position)
    if not originLanding then
        showNotice(text.unsafeOrigin)
        return
    end
    local originIndex, originListIndex = origin.SafeGridIndex, origin.ListIndex
    local targetIndex, targetListIndex = destination.SafeGridIndex, destination.ListIndex
    local current, reachedLevel = changeRoom(game, level, targetIndex, floorSeed)
    if not current then
        showNotice(text.failed)
        return
    end
    if current.SafeGridIndex == targetIndex and current.ListIndex == targetListIndex and landInCurrentRoom(game) then
        return
    end
    if current.ListIndex ~= originListIndex and getMainRoom(reachedLevel, originIndex, originListIndex) then
        current = changeRoom(game, reachedLevel, originIndex, floorSeed)
        if current and current.SafeGridIndex == originIndex and current.ListIndex == originListIndex
            and landInCurrentRoom(game, originLanding) then
            showNotice(text.returned)
            return
        end
    end
    showNotice(text.failed)
end

local function getMenuController()
    local controller = Isaac.GetPlayer(0).ControllerIndex
    if Input.IsActionPressed(ButtonAction.ACTION_MAP, controller) then
        return controller
    end
    if Input.IsButtonPressed(Keyboard.KEY_TAB, 0) or Input.IsActionPressed(ButtonAction.ACTION_MAP, 0) then
        return 0
    end
end

local function resetMenu()
    menuController, highlightedEntry = nil, nil
    selection, heldDirection, nextRepeatTime = 1, 0, 0
end

local function findHighlightedRow(entries)
    if not highlightedEntry then
        return nil
    end
    for row, entry in ipairs(entries) do
        if entry.name == highlightedEntry.name and entry.listIndex == highlightedEntry.listIndex
            and entry.roomIndex == highlightedEntry.roomIndex then
            return row
        end
    end
end

local function getDirection(controller)
    local direction = Input.GetActionValue(ButtonAction.ACTION_DOWN, controller)
        - Input.GetActionValue(ButtonAction.ACTION_UP, controller)
    if controller == 0 then
        local up = Input.IsButtonPressed(Keyboard.KEY_UP, 0)
        local down = Input.IsButtonPressed(Keyboard.KEY_DOWN, 0)
        if up ~= down then
            return down and 1 or -1
        end
    end
    if math.abs(direction) >= 0.5 then
        return direction > 0 and 1 or -1
    end
    return 0
end

local function selectEntry(controller, count, now)
    local direction = getDirection(controller)
    local step = 0

    if direction == 0 then
        heldDirection = 0
        if controller ~= 0 then
            local up = Input.IsActionTriggered(ButtonAction.ACTION_MENUUP, controller)
            local down = Input.IsActionTriggered(ButtonAction.ACTION_MENUDOWN, controller)
            if up ~= down then
                step = down and 1 or -1
            end
        end
    elseif direction ~= heldDirection then
        step = direction
        heldDirection, nextRepeatTime = direction, now + REPEAT_DELAY
    elseif now >= nextRepeatTime then
        step = direction
        nextRepeatTime = now + REPEAT_INTERVAL
    end

    selection = (selection - 1 + step) % count + 1
end

local function drawLabel(name, y, selected, suffix)
    local label = name[fontLoaded and 1 or 2] .. (suffix or "")
    if selected then
        label = "> " .. label
    end
    local red, green, blue = 1, 1, 1
    if selected then
        red, green, blue = 1, 0.82, 0.32
    end
    if fontLoaded then
        menuFont:DrawStringUTF8(label, MENU_X, y, KColor(red, green, blue, 1), 0, false)
    else
        Isaac.RenderText(label, MENU_X, y, red, green, blue, 1)
    end
end

local function onRender()
    local game = Game()
    if game:GetNumPlayers() == 0 or game:IsPaused() then
        pendingChoice = nil
        waitForRelease = false
        resetMenu()
        return
    end
    local controller = getMenuController()
    local now = Isaac.GetTime()
    if controller == nil then
        waitForRelease = false
        resetMenu()
    end
    if controller == nil or waitForRelease then
        if notice and now < noticeUntil then
            drawLabel(notice, MENU_Y, false)
        end
        return
    end
    if menuController ~= controller then
        resetMenu()
        menuController = controller
    end

    local level = game:GetLevel()
    local current = getCurrentMainRoom(level)
    local reason = getBlockReason(game, level, current)
    drawLabel(text.title, MENU_Y, false)
    if reason then
        drawLabel(reason, MENU_Y + rowHeight, false)
        resetMenu()
        return
    end

    local floorSeed = level:GetDungeonPlacementSeed()
    local entries = buildEntries(level, current, floorSeed)
    local displayedRow = findHighlightedRow(entries)
    selection = displayedRow or math.min(selection, #entries)

    local confirmed = Input.IsActionTriggered(ButtonAction.ACTION_MENUCONFIRM, controller)
        or (controller == 0 and Input.IsButtonTriggered(Keyboard.KEY_ENTER, 0))
    if displayedRow and confirmed and not pendingChoice then
        pendingChoice = {entry = entries[displayedRow], floorSeed = floorSeed, originListIndex = current.ListIndex}
        waitForRelease = true
    else
        selectEntry(controller, #entries, now)
    end
    highlightedEntry = entries[selection]
    local firstRow = math.max(1, selection - MENU_ROWS + 1)
    local lastRow = math.min(#entries, firstRow + MENU_ROWS - 1)
    for row = firstRow, lastRow do
        local entry = entries[row]
        drawLabel(entry.name, MENU_Y + (row - firstRow + 1) * rowHeight, row == selection, entry.suffix)
    end
    drawLabel(text.help, MENU_Y + (lastRow - firstRow + 2) * rowHeight, false)
end

local function onUpdate()
    local choice = pendingChoice
    pendingChoice = nil
    if not choice then
        return
    end
    local game = Game()
    if game:GetNumPlayers() == 0 or game:IsPaused() then
        return
    end
    local level = game:GetLevel()
    local current = getCurrentMainRoom(level)
    if not current or current.ListIndex ~= choice.originListIndex or level:GetDungeonPlacementSeed() ~= choice.floorSeed then
        return
    end
    local reason = getBlockReason(game, level, current)
    if reason then
        showNotice(reason)
        return
    end

    local entry = choice.entry
    if entry.markAnchor then
        anchor = {roomIndex = current.SafeGridIndex, listIndex = current.ListIndex, floorSeed = choice.floorSeed}
        showNotice(text.anchorSet)
        return
    end
    local target = getEligibleTarget(level, entry.roomIndex, entry.listIndex)
    if not target or target.ListIndex == current.ListIndex then
        showNotice(text.invalidTarget)
        return
    end
    teleport(game, level, current, target, choice.floorSeed)
end

local function onInputAction(_, entity, inputHook, buttonAction)
    if not entity or not blockedActions[buttonAction] then
        return
    end
    local player = entity:ToPlayer()
    local game = Game()
    if not player or game:GetNumPlayers() == 0 or game:IsPaused()
        or player.ControllerIndex ~= Isaac.GetPlayer(0).ControllerIndex or getMenuController() == nil then
        return
    end
    local level = game:GetLevel()
    if getBlockReason(game, level, getCurrentMainRoom(level)) then
        return
    end
    if inputHook == InputHook.GET_ACTION_VALUE then
        return 0
    end
    return false
end

local function onNewRoom()
    pendingChoice = nil
    resetMenu()
end

local function onNewFloor()
    anchor, notice = nil, nil
    waitForRelease = false
    onNewRoom()
end

mod:AddCallback(ModCallbacks.MC_POST_RENDER, onRender)
mod:AddCallback(ModCallbacks.MC_POST_UPDATE, onUpdate)
mod:AddCallback(ModCallbacks.MC_INPUT_ACTION, onInputAction)
mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, onNewRoom)
mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, onNewFloor)
mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, onNewFloor)
mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, onNewFloor)
