local ui = {}
local rules = include("pawnshop_rules")

local LIGHT = { 1, 0.98, 0.93 }
local GOLD = { 1, 0.81, 0.49 }
local MUTED = { 0.85, 0.80, 0.72 }
local WARNING = { 1, 0.55, 0.45 }

local ITEM_LAYER = 1
local itemSprite
local spriteItemId

local function draw(text, x, y, color, scale)
    scale = scale or 1
    Isaac.RenderScaledText(text, x + 1, y + 1, scale, scale, 0.08, 0.05, 0.03, 1)
    Isaac.RenderScaledText(text, x, y, scale, scale, color[1], color[2], color[3], 1)
end

local function drawItem(itemId, x, y)
    if itemId ~= spriteItemId then
        local item = Isaac.GetItemConfig():GetCollectible(itemId)
        if item == nil or item.GfxFileName == "" then
            return
        end

        if itemSprite == nil then
            itemSprite = Sprite()
            itemSprite:Load("gfx/005.100_collectible.anm2", false)
        end

        itemSprite:ReplaceSpritesheet(ITEM_LAYER, item.GfxFileName)
        itemSprite:LoadGraphics()
        itemSprite:SetFrame("Idle", 0)
        spriteItemId = itemId
    end

    itemSprite:RenderLayer(ITEM_LAYER, Vector(x, y))
end

function ui.renderSign(position)
    local label = "PAWNSHOP"
    local screen = Isaac.WorldToScreen(position)
    draw(label, screen.X - Isaac.GetTextWidth(label) / 2, screen.Y - 18, GOLD)
end

function ui.renderTicket(ticket)
    local name = rules.ITEM_BY_ID[ticket.itemId].name
    local text = string.format("Ticket: %s  |  Redeem %dc  |  This floor", name, ticket.redeemPrice)
    draw(text, 16, Isaac.GetScreenHeight() - 22, GOLD)
end

local function drawControls(x, y, offer, pending, choiceCount)
    if pending ~= nil then
        draw("F7 Confirm  /  F8 Cancel", x, y, GOLD, 0.9)
        draw("Hold Map + Aim: Up confirm  /  Down cancel", x, y + 11, MUTED, 0.9)
    elseif offer.canConfirm then
        local keys = "F7 Review"
        local controller = "Hold Map + Aim: Up review"
        if choiceCount > 1 then
            keys = keys .. "  /  F6 Prev  /  F9 Next"
            controller = controller .. "  /  Left/Right browse"
        end
        draw(keys, x, y, GOLD, 0.9)
        draw(controller, x, y + 11, MUTED, 0.9)
    end
end

function ui.renderCounter(counter, pending, focus, frame)
    local offer = pending or counter.offer
    local x = 16
    local y = Isaac.GetScreenHeight() - 104
    local header = "UNDERGROUND PAWNSHOP"
    if pending ~= nil then
        header = "CONFIRM " .. string.upper(offer.kind)
    end
    draw(header, x, y, GOLD, 1.12)

    if offer.kind == "pawn" then
        if focus ~= nil then
            draw(string.format("Floor bonus: %s +%dc", focus, rules.FEATURE_BONUS), x, y + 15, MUTED, 0.9)
        end

        local item = rules.ITEM_BY_ID[offer.itemId]
        drawItem(offer.itemId, x + 17, y + 52)
        local selected = string.format("%s  x%d  [%d/%d]", item.name, counter.ownedCount,
            counter.choiceIndex, counter.choiceCount)
        draw(selected, x + 37, y + 29, LIGHT)
        local prices = string.format("Pawn +%dc  |  Redeem %dc", offer.payout, offer.redeemPrice)
        if offer.bonus > 0 then
            prices = prices .. "  |  Featured"
        end
        draw(prices, x + 37, y + 43, GOLD)
    elseif offer.kind == "redeem" then
        local item = rules.ITEM_BY_ID[offer.itemId]
        drawItem(offer.itemId, x + 17, y + 52)
        draw("Redeem " .. item.name, x + 37, y + 29, LIGHT)
        local prices = string.format("%dc due  |  %dc in wallet", offer.redeemPrice, counter.coins)
        local shortfall = offer.redeemPrice - counter.coins
        if shortfall > 0 then
            prices = prices .. string.format("  |  Need %dc more", shortfall)
        end
        draw(prices, x + 37, y + 43, shortfall <= 0 and GOLD or WARNING)
    elseif offer.kind == "used" then
        draw("You already made a pledge this floor.", x, y + 26, MUTED)
    else
        draw("No eligible item in your inventory.", x, y + 26, MUTED)
        if focus ~= nil then
            draw(string.format("Floor bonus: %s +%dc", focus, rules.FEATURE_BONUS), x, y + 41, MUTED, 0.9)
        end
    end

    drawControls(x, y + 58, offer, pending, counter.choiceCount)
    local feedback = counter.feedback
    if feedback ~= nil and frame < feedback.hideAtFrame then
        draw(feedback.text, x, y - 17, LIGHT)
    end
end

return ui
