local mod = RegisterMod("Underground Pawnshop", 1)
local rules = include("pawnshop_rules")
local ui = include("pawnshop_ui")
local json = require("json")

local COUNTER_DISTANCE = 50
local FEEDBACK_FRAMES = 100
local PAD_PRESS_THRESHOLD = 0.60
local PAD_RELEASE_THRESHOLD = 0.35
local PAD_DIRECTION_MARGIN = 0.15

local shootActions = {
    [ButtonAction.ACTION_SHOOTLEFT] = true,
    [ButtonAction.ACTION_SHOOTRIGHT] = true,
    [ButtonAction.ACTION_SHOOTUP] = true,
    [ButtonAction.ACTION_SHOOTDOWN] = true,
}

local ledger = { runReady = false }
local counter = { itemId = rules.HANGER_ID }
local roomEntry
local previousFloorEntry
local rewindPending = false

local function getFloorId()
    return tostring(Game():GetLevel():GetDungeonPlacementSeed())
end

local function snapshotLedger()
    return rules.makeSaveData(ledger, ledger.runId)
end

local function getRunPlayer()
    if not ledger.runReady then
        return nil
    end

    local game = Game()
    if game:IsGreedMode() then
        return nil
    end

    local primary
    for index = 0, game:GetNumPlayers() - 1 do
        local player = Isaac.GetPlayer(index)
        if player.Parent == nil then
            if primary ~= nil then
                return nil
            end
            primary = player
        end
    end

    if primary ~= nil and not primary:IsDead() then
        return primary
    end

    return nil
end

local function readTradeState(player)
    local itemCounts = {}
    for _, item in ipairs(rules.ITEMS) do
        itemCounts[item.id] = player:GetCollectibleNum(item.id, true)
    end

    return {
        coins = player:GetNumCoins(),
        itemCounts = itemCounts,
        floorId = ledger.floorId,
        usedThisFloor = ledger.usedThisFloor,
        ticket = ledger.ticket,
    }
end

local function changeItemCount(player, itemId, amount)
    if amount == 0 then
        return
    end

    if amount > 0 then
        for _ = 1, amount do
            player:AddCollectible(itemId, 0, false)
        end
    else
        for _ = 1, -amount do
            player:RemoveCollectible(itemId, true, ActiveSlot.SLOT_PRIMARY, false)
        end
    end

    player:AddCacheFlags(CacheFlag.CACHE_ALL)
    player:EvaluateItems()
end

local function rollbackTrade(player, itemId, coins, count)
    local actualCount = player:GetCollectibleNum(itemId, true)
    changeItemCount(player, itemId, count - actualCount)

    local coinDifference = coins - player:GetNumCoins()
    if coinDifference ~= 0 then
        player:AddCoins(coinDifference)
    end

    return player:GetNumCoins() == coins
        and player:GetCollectibleNum(itemId, true) == count
end

local function executeTrade(player, offer)
    local draft = readTradeState(player)
    local itemId = offer.itemId
    local coinsBefore = draft.coins
    local countBefore = draft.itemCounts[itemId]

    if not rules.confirmCounterOffer(draft, offer) then
        return "offer_changed"
    end

    local expectedCount = draft.itemCounts[itemId]
    local failure

    player:AddCoins(draft.coins - coinsBefore)
    if player:GetNumCoins() ~= draft.coins then
        failure = "coin_limit"
    else
        changeItemCount(player, itemId, expectedCount - countBefore)
        if player:GetCollectibleNum(itemId, true) ~= expectedCount
            or player:GetNumCoins() ~= draft.coins
        then
            failure = "trade_failed"
        end
    end

    if failure ~= nil then
        if rollbackTrade(player, itemId, coinsBefore, countBefore) then
            return failure
        end
        return "recovery_incomplete"
    end

    if roomEntry == nil then
        roomEntry = snapshotLedger()
    end
    ledger.ticket = draft.ticket
    ledger.usedThisFloor = draft.usedThisFloor
    rules.cancelCounterOffer(ledger)
    SFXManager():Play(SoundEffect.SOUND_CASH_REGISTER, 0.55, 0, false, 1)

    return offer.kind
end

local function loadSavedLedger()
    if not mod:HasData() then
        return nil
    end

    local ok, saved = pcall(json.decode, mod:LoadData())
    if ok and type(saved) == "table" then
        return saved
    end

    print("[Pawnshop] Could not read saved ledger.")
    return nil
end

local function onGameStarted(_, isContinued)
    local runId = Game():GetSeeds():GetStartSeed()
    local floorId = getFloorId()
    local saved = isContinued and loadSavedLedger() or nil

    rules.startRun(ledger, saved, runId, floorId, isContinued)
    roomEntry = snapshotLedger()
    previousFloorEntry = nil
    rewindPending = false
end

local function enterFloor(floorId)
    if previousFloorEntry == nil then
        previousFloorEntry = roomEntry or snapshotLedger()
    end

    rules.onNewLevel(ledger, floorId)
    roomEntry = snapshotLedger()
end

local function onNewLevel()
    local floorId = getFloorId()
    if ledger.runReady and ledger.floorId ~= floorId then
        enterFloor(floorId)
    end
end

local function onGameExit(_, shouldSave)
    if not ledger.runReady then
        return
    end

    ledger.runReady = false
    if shouldSave then
        mod:SaveData(json.encode(snapshotLedger()))
    end
end

local function onHourglassUsed()
    if ledger.runReady then
        rewindPending = true
    end
end

local function syncRoomLedger()
    if not ledger.runReady then
        return
    end

    local floorId = getFloorId()
    local runId = ledger.runId

    if rewindPending then
        rewindPending = false
        local entry = roomEntry
        if not rules.matchesSave(entry, runId, floorId) then
            entry = previousFloorEntry
        end
        if rules.matchesSave(entry, runId, floorId) then
            rules.startRun(ledger, entry, runId, floorId, true)
        end
    end

    if ledger.floorId ~= floorId then
        enterFloor(floorId)
        return
    end

    previousFloorEntry = nil
    roomEntry = snapshotLedger()
end

local function onShopRoomEntered()
    counter = { itemId = rules.HANGER_ID }
    rules.cancelCounterOffer(ledger)
    syncRoomLedger()

    local game = Game()
    local room = game:GetRoom()
    if not game:IsGreedMode() and room:GetType() == RoomType.ROOM_SHOP then
        local desiredPosition = room:GetTopLeftPos() + Vector(40, 40)
        counter.position = room:FindFreePickupSpawnPosition(desiredPosition, 0, true)
    end
end

local function getNearbyPlayer()
    if counter.position == nil or not Game():GetRoom():IsClear() then
        return nil
    end

    local player = getRunPlayer()
    if player ~= nil and player.Position:Distance(counter.position) <= COUNTER_DISTANCE then
        return player
    end

    return nil
end

local function refreshCounterOffer(player, direction)
    local state = readTradeState(player)
    local choices = {}
    local selectedIndex

    if state.ticket == nil and not state.usedThisFloor then
        for _, item in ipairs(rules.ITEMS) do
            if state.itemCounts[item.id] > 0 then
                choices[#choices + 1] = item.id
                if item.id == counter.itemId then
                    selectedIndex = #choices
                end
            end
        end
    end

    counter.choiceCount = #choices
    counter.choiceIndex = nil
    if #choices > 0 then
        local index = selectedIndex or 1
        if direction ~= 0 and selectedIndex ~= nil then
            index = (index - 1 + direction) % #choices + 1
        end
        counter.itemId = choices[index]
        counter.choiceIndex = index
    end

    counter.offer = rules.getCounterOffer(state, counter.itemId)
    counter.ownedCount = state.itemCounts[counter.offer.itemId]
    counter.coins = state.coins
end

local function isPadMapHeld(player)
    local index = player.ControllerIndex
    return index > 0 and Input.IsActionPressed(ButtonAction.ACTION_MAP, index)
end

local function readPadCommand(player)
    if not isPadMapHeld(player) then
        counter.padArmed = false
        return
    end

    local index = player.ControllerIndex
    local x = Input.GetActionValue(ButtonAction.ACTION_SHOOTRIGHT, index)
        - Input.GetActionValue(ButtonAction.ACTION_SHOOTLEFT, index)
    local y = Input.GetActionValue(ButtonAction.ACTION_SHOOTDOWN, index)
        - Input.GetActionValue(ButtonAction.ACTION_SHOOTUP, index)
    local horizontal = math.abs(x)
    local vertical = math.abs(y)

    if horizontal <= PAD_RELEASE_THRESHOLD and vertical <= PAD_RELEASE_THRESHOLD then
        counter.padArmed = true
        return
    end

    if not counter.padArmed then
        return
    end

    local command
    if vertical >= PAD_PRESS_THRESHOLD and vertical > horizontal + PAD_DIRECTION_MARGIN then
        command = y < 0 and "confirm" or "cancel"
    elseif horizontal >= PAD_PRESS_THRESHOLD and horizontal > vertical + PAD_DIRECTION_MARGIN then
        command = x > 0 and "next" or "previous"
    end

    if command ~= nil then
        counter.padArmed = false
    end

    return command
end

local function onCounterInput(_, entity, hook, action)
    if not shootActions[action] or entity == nil then
        return
    end

    local offer = ledger.pendingOffer or counter.offer
    if offer == nil or not offer.canConfirm then
        return
    end

    local player = getNearbyPlayer()
    if player == nil or GetPtrHash(player) ~= GetPtrHash(entity)
        or not isPadMapHeld(player) or Game():IsPaused()
    then
        return
    end

    if hook == InputHook.GET_ACTION_VALUE then
        return 0
    end

    return false
end

local function updateShopCounter()
    if Game():IsPaused() then
        counter.padArmed = false
        return
    end

    local player = getNearbyPlayer()
    if player == nil then
        counter.padArmed = false
        rules.cancelCounterOffer(ledger)
        counter.offer = nil
        counter.feedback = nil
        return
    end

    local padCommand = readPadCommand(player)
    if Input.IsButtonTriggered(Keyboard.KEY_F8, 0) or padCommand == "cancel" then
        rules.cancelCounterOffer(ledger)
        counter.feedback = nil
        refreshCounterOffer(player, 0)
        return
    end

    local pressedConfirm = Input.IsButtonTriggered(Keyboard.KEY_F7, 0)
        or padCommand == "confirm"
    local pendingOffer = ledger.pendingOffer

    if pendingOffer ~= nil then
        counter.coins = player:GetNumCoins()
        if pendingOffer.kind == "pawn" then
            counter.ownedCount = player:GetCollectibleNum(pendingOffer.itemId, true)
        end

        if pressedConfirm then
            rules.cancelCounterOffer(ledger)
            local result = executeTrade(player, pendingOffer)
            counter.feedback = {
                result = result,
                offer = pendingOffer,
                hideAtFrame = Game():GetFrameCount() + FEEDBACK_FRAMES,
            }
            print("[Pawnshop] " .. ui.formatFeedback(counter.feedback))
            refreshCounterOffer(player, 0)
        end
        return
    end

    local direction = 0
    if not pressedConfirm then
        if Input.IsButtonTriggered(Keyboard.KEY_F9, 0) or padCommand == "next" then
            direction = 1
        elseif Input.IsButtonTriggered(Keyboard.KEY_F5, 0) or padCommand == "previous" then
            direction = -1
        end
    end

    refreshCounterOffer(player, direction)
    if pressedConfirm and counter.offer.canConfirm then
        ledger.pendingOffer = counter.offer
        counter.feedback = nil
    end
end

local function renderPawnshop()
    local player = getRunPlayer()
    if player == nil then
        return
    end

    if Game():IsPaused() then
        counter.padArmed = false
    end

    local ticket = ledger.ticket
    if ticket ~= nil and ticket.floorId == ledger.floorId then
        ui.renderTicket(ticket)
    end

    if counter.position ~= nil then
        ui.renderSign(counter.position)
    end

    if counter.offer ~= nil and getNearbyPlayer() ~= nil then
        ui.renderCounter(counter, ledger.pendingOffer, rules.getFocus(ledger.floorId), Game():GetFrameCount())
    end
end

mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, onGameStarted)
mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, onNewLevel)
mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, onGameExit)
mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, onShopRoomEntered)
mod:AddCallback(
    ModCallbacks.MC_USE_ITEM,
    onHourglassUsed,
    CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS
)
mod:AddCallback(ModCallbacks.MC_INPUT_ACTION, onCounterInput)
mod:AddCallback(ModCallbacks.MC_POST_UPDATE, updateShopCounter)
mod:AddCallback(ModCallbacks.MC_POST_RENDER, renderPawnshop)
