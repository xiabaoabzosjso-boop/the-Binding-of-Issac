local rules = {}

rules.HANGER_ID = 32
rules.ITEMS = {
    { id = rules.HANGER_ID, name = "Wire Coat Hanger", payout = 8, redeemPrice = 10 },
    { id = 27, name = "Wooden Spoon", payout = 5, redeemPrice = 7 },
    { id = 50, name = "Steven", payout = 9, redeemPrice = 11 },
}

rules.ITEM_BY_ID = {}
for _, item in ipairs(rules.ITEMS) do
    rules.ITEM_BY_ID[item.id] = item
end

local function copyTicket(ticket)
    if ticket == nil then
        return nil
    end

    return {
        itemId = ticket.itemId,
        redeemPrice = ticket.redeemPrice,
        floorId = ticket.floorId,
    }
end

local function isValidTicket(state, ticket)
    return type(ticket) == "table"
        and rules.ITEM_BY_ID[ticket.itemId] ~= nil
        and ticket.floorId == state.floorId
        and type(ticket.redeemPrice) == "number"
        and ticket.redeemPrice > 0
        and ticket.redeemPrice % 1 == 0
end

local function pawnItem(state, itemId)
    local item = rules.ITEM_BY_ID[itemId]
    if item == nil or state.usedThisFloor or state.ticket ~= nil then
        return false
    end

    local count = state.itemCounts[itemId] or 0
    if count < 1 then
        return false
    end

    state.itemCounts[itemId] = count - 1
    state.coins = state.coins + item.payout
    state.ticket = {
        itemId = itemId,
        redeemPrice = item.redeemPrice,
        floorId = state.floorId,
    }
    state.usedThisFloor = true
    return true
end

function rules.pawnHanger(state)
    return pawnItem(state, rules.HANGER_ID)
end

function rules.redeemHanger(state)
    local ticket = state.ticket
    if not isValidTicket(state, ticket) or state.coins < ticket.redeemPrice then
        return false
    end

    local itemId = ticket.itemId
    state.coins = state.coins - ticket.redeemPrice
    state.itemCounts[itemId] = (state.itemCounts[itemId] or 0) + 1
    state.ticket = nil
    state.usedThisFloor = true
    return true
end

function rules.getCounterOffer(state, itemId)
    local ticket = state.ticket
    if isValidTicket(state, ticket) then
        return {
            kind = "redeem",
            itemId = ticket.itemId,
            floorId = ticket.floorId,
            redeemPrice = ticket.redeemPrice,
            canConfirm = state.coins >= ticket.redeemPrice,
        }
    end

    if state.usedThisFloor or ticket ~= nil then
        return { kind = "used", canConfirm = false }
    end

    local item = rules.ITEM_BY_ID[itemId]
    if item ~= nil and (state.itemCounts[itemId] or 0) >= 1 then
        return {
            kind = "pawn",
            itemId = itemId,
            floorId = state.floorId,
            payout = item.payout,
            redeemPrice = item.redeemPrice,
            canConfirm = true,
        }
    end

    return { kind = "no_item", canConfirm = false }
end

function rules.confirmCounterOffer(state, offer)
    if type(offer) ~= "table" or offer.itemId == nil or offer.floorId ~= state.floorId then
        return false
    end

    local current = rules.getCounterOffer(state, offer.itemId)
    if not current.canConfirm
        or current.kind ~= offer.kind
        or current.itemId ~= offer.itemId
        or current.payout ~= offer.payout
        or current.redeemPrice ~= offer.redeemPrice
    then
        return false
    end

    if current.kind == "pawn" then
        return pawnItem(state, current.itemId)
    end

    return rules.redeemHanger(state)
end

function rules.openCounter(state, itemId)
    state.pendingOffer = rules.getCounterOffer(state, itemId)
    return state.pendingOffer
end

function rules.cancelCounterOffer(state)
    state.pendingOffer = nil
end

function rules.confirmPendingOffer(state)
    if not rules.confirmCounterOffer(state, state.pendingOffer) then
        return false
    end

    state.pendingOffer = nil
    return true
end

function rules.makeSaveData(state, runId)
    return {
        runId = runId,
        floorId = state.floorId,
        usedThisFloor = state.usedThisFloor,
        ticket = copyTicket(state.ticket),
    }
end

function rules.matchesSave(saved, runId, floorId)
    return type(saved) == "table"
        and saved.runId == runId
        and saved.floorId == floorId
end

function rules.startRun(state, saved, runId, floorId, isContinued)
    state.runId = runId
    state.floorId = floorId
    state.ticket = nil
    state.usedThisFloor = false
    state.pendingOffer = nil

    if isContinued and rules.matchesSave(saved, runId, floorId) then
        state.usedThisFloor = saved.usedThisFloor == true
        if isValidTicket(state, saved.ticket) then
            state.ticket = copyTicket(saved.ticket)
            state.usedThisFloor = true
        end
    end

    state.runReady = true
end

function rules.onNewLevel(state, floorId)
    if not state.runReady or state.floorId == floorId then
        return false
    end

    state.floorId = floorId
    state.ticket = nil
    state.usedThisFloor = false
    state.pendingOffer = nil
    return true
end

return rules
