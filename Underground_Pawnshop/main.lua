local mod = RegisterMod("Underground Pawnshop", 1)
local rules = include("pawnshop_rules")
local json = require("json")

local COUNTER_DISTANCE = 50
local FEEDBACK_FRAMES = 60
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
local rewindUntilFrame

local commandKinds = {
    pawn_hanger = "pawn",
    redeem_hanger = "redeem",
}

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
    if game:GetNumPlayers() ~= 1 or game:IsGreedMode() then
        return nil
    end

    return Isaac.GetPlayer(0)
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
    if amount > 0 then
        for _ = 1, amount do
            player:AddCollectible(itemId, 0, false)
        end
    else
        for _ = 1, -amount do
            player:RemoveCollectible(itemId, true)
        end
    end
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
        return "Offer changed or not enough coins."
    end

    local expectedCount = draft.itemCounts[itemId]
    local failureMessage

    player:AddCoins(draft.coins - coinsBefore)
    if player:GetNumCoins() ~= draft.coins then
        failureMessage = "Could not apply the full coin amount."
    else
        changeItemCount(player, itemId, expectedCount - countBefore)
        if player:GetCollectibleNum(itemId, true) ~= expectedCount
            or player:GetNumCoins() ~= draft.coins
        then
            failureMessage = "Could not complete the trade."
        end
    end

    if failureMessage ~= nil then
        if rollbackTrade(player, itemId, coinsBefore, countBefore) then
            return failureMessage
        end
        return "Trade recovery incomplete. Check coins and items."
    end

    if roomEntry == nil then
        roomEntry = snapshotLedger()
    end
    ledger.ticket = draft.ticket
    ledger.usedThisFloor = draft.usedThisFloor
    rules.cancelCounterOffer(ledger)

    local name = rules.ITEM_BY_ID[itemId].name
    if offer.kind == "pawn" then
        return string.format("Pawned %s (+%dc)", name, offer.payout)
    end

    return string.format("Redeemed %s (-%dc)", name, offer.redeemPrice)
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
    roomEntry = nil
    previousFloorEntry = nil
    rewindUntilFrame = nil

    if not isContinued then
        roomEntry = snapshotLedger()
    end

    if rules.matchesSave(saved, runId, floorId) then
        if rules.matchesSave(saved.roomEntry, runId, floorId) then
            roomEntry = saved.roomEntry
        end

        local previous = saved.previousFloorEntry
        if type(previous) == "table"
            and previous.runId == runId
            and type(previous.floorId) == "string"
            and previous.floorId ~= floorId
        then
            previousFloorEntry = previous
        end
    end
end

local function enterFloor(floorId)
    previousFloorEntry = snapshotLedger()
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
        local saved = snapshotLedger()
        saved.roomEntry = roomEntry
        saved.previousFloorEntry = previousFloorEntry
        mod:SaveData(json.encode(saved))
    end
end

local function onHourglassUsed()
    if ledger.runReady then
        rewindUntilFrame = Game():GetFrameCount() + 2
    end
end

local function syncRoomLedger()
    if not ledger.runReady then
        return
    end

    local floorId = getFloorId()
    local runId = ledger.runId
    local deadline = rewindUntilFrame
    rewindUntilFrame = nil

    if deadline ~= nil and Game():GetFrameCount() <= deadline then
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
    if counter.position == nil then
        return nil
    end

    local player = getRunPlayer()
    if player ~= nil and player.Position:Distance(counter.position) <= COUNTER_DISTANCE then
        return player
    end

    return nil
end

local function refreshCounterOffer(player, cycle)
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
    if #choices > 0 then
        local index = selectedIndex or 1
        if cycle and selectedIndex ~= nil then
            index = index % #choices + 1
        end
        counter.itemId = choices[index]
    end

    counter.offer = rules.getCounterOffer(state, counter.itemId)
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
    elseif x >= PAD_PRESS_THRESHOLD and horizontal > vertical + PAD_DIRECTION_MARGIN then
        command = "next"
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
        refreshCounterOffer(player, false)
        return
    end

    local pressedConfirm = Input.IsButtonTriggered(Keyboard.KEY_F7, 0)
        or padCommand == "confirm"
    local pendingOffer = ledger.pendingOffer

    if pendingOffer ~= nil then
        if pressedConfirm then
            rules.cancelCounterOffer(ledger)
            local result = executeTrade(player, pendingOffer)
            counter.feedback = {
                text = result,
                hideAtFrame = Game():GetFrameCount() + FEEDBACK_FRAMES,
            }
            print("[Pawnshop] " .. result)
            refreshCounterOffer(player, false)
        end
        return
    end

    local cycle = Input.IsButtonTriggered(Keyboard.KEY_F9, 0) or padCommand == "next"
    refreshCounterOffer(player, cycle)
    if pressedConfirm and counter.offer.canConfirm then
        ledger.pendingOffer = counter.offer
        counter.feedback = nil
    end
end

local function getCounterText(offer)
    if offer.kind == "pawn" then
        local name = rules.ITEM_BY_ID[offer.itemId].name
        return string.format(
            "Pawn %s +%dc | Redeem %dc",
            name,
            offer.payout,
            offer.redeemPrice
        )
    end

    if offer.kind == "redeem" then
        local name = rules.ITEM_BY_ID[offer.itemId].name
        local text = string.format("Redeem %s %dc", name, offer.redeemPrice)
        if not offer.canConfirm then
            text = text .. " | Not enough coins"
        end
        return text
    end

    if offer.kind == "used" then
        return "Pawnshop already used this floor"
    end

    return "No eligible item"
end

local function renderTicketHud()
    local ticket = ledger.ticket
    if ticket == nil or ticket.floorId ~= ledger.floorId or getRunPlayer() == nil then
        return
    end

    local name = rules.ITEM_BY_ID[ticket.itemId].name
    local text = string.format("%s | Redeem %dc | This floor only", name, ticket.redeemPrice)
    Isaac.RenderText(text, 18, Isaac.GetScreenHeight() - 24, 1, 0.92, 0.72, 1)
end

local function renderShopCounter()
    if counter.position == nil or getRunPlayer() == nil then
        return
    end

    if Game():IsPaused() then
        counter.padArmed = false
    end

    local label = "PAWNSHOP"
    local position = Isaac.WorldToScreen(counter.position)
    local labelX = position.X - Isaac.GetTextWidth(label) / 2
    Isaac.RenderText(label, labelX, position.Y - 10, 1, 0.92, 0.72, 1)

    local offer = ledger.pendingOffer or counter.offer
    if offer == nil then
        return
    end

    local y = Isaac.GetScreenHeight() - 70
    Isaac.RenderText(getCounterText(offer), 18, y, 1, 1, 1, 1)

    local keyboardHint
    local padHint
    if ledger.pendingOffer ~= nil then
        keyboardHint = "F7 Confirm | F8 Cancel"
        padHint = "Hold Map: Aim Up Confirm | Aim Down Cancel"
    elseif offer.canConfirm then
        keyboardHint = "F7 Select offer"
        padHint = "Hold Map: Aim Up Select"
        if counter.choiceCount > 1 then
            keyboardHint = keyboardHint .. " | F9 Next item"
            padHint = padHint .. " | Aim Right Next item"
        end
    end

    if keyboardHint ~= nil then
        Isaac.RenderText(keyboardHint, 18, y + 13, 1, 0.92, 0.72, 1)
        Isaac.RenderText(padHint, 18, y + 26, 1, 0.92, 0.72, 1)
    end

    local feedback = counter.feedback
    if feedback ~= nil and Game():GetFrameCount() < feedback.hideAtFrame then
        Isaac.RenderText(feedback.text, 18, y - 13, 1, 0.92, 0.72, 1)
    end
end

local function onCommand(_, command)
    local expectedKind = commandKinds[command]
    if expectedKind == nil then
        return
    end

    local player = getRunPlayer()
    if player == nil then
        print("[Pawnshop] Start a single-player normal run first.")
        return
    end

    local offer = rules.getCounterOffer(readTradeState(player), rules.HANGER_ID)
    if offer.kind ~= expectedKind or offer.itemId ~= rules.HANGER_ID then
        print("[Pawnshop] No matching Wire Coat Hanger offer.")
        return
    end

    print("[Pawnshop] " .. executeTrade(player, offer))
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
mod:AddCallback(ModCallbacks.MC_POST_RENDER, renderTicketHud)
mod:AddCallback(ModCallbacks.MC_POST_RENDER, renderShopCounter)
mod:AddCallback(ModCallbacks.MC_EXECUTE_CMD, onCommand)