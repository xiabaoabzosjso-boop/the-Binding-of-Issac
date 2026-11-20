local ui = {}
local rules = include("pawnshop_rules")

local LIGHT = { 1, 0.98, 0.93 }
local GOLD = { 1, 0.81, 0.49 }
local MUTED = { 0.85, 0.80, 0.72 }
local WARNING = { 1, 0.55, 0.45 }

local ITEM_LAYER = 1
local itemSprite
local spriteItemId
local chineseFont

local english = {
    sign = "PAWNSHOP",
    header = "UNDERGROUND PAWNSHOP",
    confirm = { pawn = "CONFIRM PAWN", redeem = "CONFIRM REDEEM" },
    ticket = "Ticket: %s  |  Redeem %dc  |  This floor",
    floorBonus = "Floor bonus: %s +%dc",
    featured = "  |  Featured",
    pawnPrices = "Pawn +%dc  |  Redeem %dc",
    redeemItem = "Redeem %s",
    wallet = "%dc due  |  %dc in wallet",
    shortage = "  |  Need %dc more",
    used = "You already made a pledge this floor.",
    noItem = "No eligible item in your inventory.",
    keyboardReview = "F7 Review",
    keyboardBrowse = "  /  F5 Prev  /  F9 Next",
    keyboardConfirm = "F7 Confirm  /  F8 Cancel",
    controllerReview = "Hold Map + Aim: Up review",
    controllerBrowse = "  /  Left/Right browse",
    controllerConfirm = "Hold Map + Aim: Up confirm  /  Down cancel",
    feedback = {
        pawn = "Pawned %s (+%dc)",
        redeem = "Redeemed %s (-%dc)",
        offer_changed = "Offer changed or not enough coins.",
        coin_limit = "Could not apply the full coin amount.",
        trade_failed = "Could not complete the trade.",
        recovery_incomplete = "Trade recovery incomplete. Check coins and items.",
    },
}

local chinese = {
    sign = "地下当铺",
    header = "地下当铺",
    confirm = { pawn = "确认抵押", redeem = "确认赎回" },
    ticket = "当票：%s  |  赎回 %d¢  |  仅限本层",
    floorBonus = "本层加价：%s +%d¢",
    categories = { Tears = "射速", Speed = "移速", Damage = "伤害" },
    featured = "  |  加价道具",
    pawnPrices = "抵押 +%d¢  |  赎回 %d¢",
    redeemItem = "赎回 %s",
    wallet = "需付 %d¢  |  持有 %d¢",
    shortage = "  |  还差 %d¢",
    used = "本层已抵押过一次。",
    noItem = "身上没有可抵押的道具。",
    keyboardReview = "F7 查看报价",
    keyboardBrowse = "  /  F5 上一件  /  F9 下一件",
    keyboardConfirm = "F7 确认  /  F8 取消",
    controllerReview = "按住地图键 + 右摇杆上推查看",
    controllerBrowse = "  /  左右切换",
    controllerConfirm = "按住地图键 + 右摇杆上推确认 / 下推取消",
    feedback = {
        pawn = "已抵押 %s（+%d¢）",
        redeem = "已赎回 %s（-%d¢）",
        offer_changed = "报价已变更或金币不足。",
        coin_limit = "金币变更失败，可能已达上限。",
        trade_failed = "未能完成交易。",
        recovery_incomplete = "恢复交易状态失败，请检查金币和道具。",
    },
    itemNames = {
        [1] = "悲伤洋葱",
        [14] = "过量类固醇",
        [27] = "木头勺子",
        [28] = "皮带",
        [32] = "铁丝衣架",
        [50] = "史蒂文",
        [70] = "生长激素",
        [143] = "混合麻药",
        [165] = "九尾鞭",
        [183] = "牙签",
        [254] = "血块",
        [341] = "撕碎的照片",
        [345] = "合成油脂",
    },
}

local function getDisplayText()
    if Options ~= nil and Options.Language == "zh" then
        if chineseFont == nil then
            local font = Font()
            local loaded = pcall(font.Load, font, "font/cjk/lanapixel.fnt")
            chineseFont = loaded and font:IsLoaded() and font or false
        end

        if chineseFont then
            return chinese, chineseFont
        end
    end

    return english
end

local function itemName(itemId, labels)
    return (labels.itemNames and labels.itemNames[itemId]) or rules.ITEM_BY_ID[itemId].name
end

local function draw(text, x, y, color, scale, font)
    scale = scale or 1
    if font ~= nil then
        local width = font:GetStringWidthUTF8(text)
        local availableWidth = math.max(1, Isaac.GetScreenWidth() - x - 16)
        if width * scale > availableWidth then
            scale = availableWidth / width
        end
        font:DrawStringScaledUTF8(text, x + 1, y + 1, scale, scale, KColor(0.08, 0.05, 0.03, 1))
        font:DrawStringScaledUTF8(text, x, y, scale, scale, KColor(color[1], color[2], color[3], 1))
        return
    end

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
    local labels, font = getDisplayText()
    local label = labels.sign
    local screen = Isaac.WorldToScreen(position)
    local width = font and font:GetStringWidthUTF8(label) or Isaac.GetTextWidth(label)
    draw(label, screen.X - width / 2, screen.Y - 18, GOLD, 1, font)
end

function ui.renderTicket(ticket)
    local labels, font = getDisplayText()
    local text = string.format(labels.ticket, itemName(ticket.itemId, labels), ticket.redeemPrice)
    draw(text, 16, Isaac.GetScreenHeight() - 22, GOLD, 1, font)
end

function ui.formatFeedback(feedback, labels)
    labels = labels or english
    local result = feedback.result
    local message = labels.feedback[result]
    if result == "pawn" or result == "redeem" then
        local offer = feedback.offer
        return string.format(message, itemName(offer.itemId, labels), offer.payout or offer.redeemPrice)
    end
    return message
end

local function drawControls(x, y, offer, pending, choiceCount, labels, font)
    if pending == nil and not offer.canConfirm then
        return
    end

    local scale = font and math.min(0.9, 10 / math.max(1, font:GetLineHeight())) or 0.9
    local keys = labels.keyboardReview
    local controller = labels.controllerReview
    if pending ~= nil then
        keys = labels.keyboardConfirm
        controller = labels.controllerConfirm
    elseif choiceCount > 1 then
        keys = keys .. labels.keyboardBrowse
        controller = controller .. labels.controllerBrowse
    end

    draw(keys, x, y, GOLD, scale, font)
    draw(controller, x, y + 11, MUTED, scale, font)
end

local function drawFocus(x, y, focus, labels, font)
    if focus ~= nil then
        local category = labels.categories and labels.categories[focus] or focus
        draw(string.format(labels.floorBonus, category, rules.FEATURE_BONUS), x, y, MUTED, 0.9, font)
    end
end

function ui.renderCounter(counter, pending, focus, frame)
    local labels, font = getDisplayText()
    local offer = pending or counter.offer
    local x = 16
    local y = Isaac.GetScreenHeight() - 104
    local header = pending and labels.confirm[offer.kind] or labels.header
    draw(header, x, y, GOLD, 1.12, font)

    if offer.kind == "pawn" then
        drawFocus(x, y + 15, focus, labels, font)
        drawItem(offer.itemId, x + 17, y + 52)
        local selected = string.format("%s  x%d  [%d/%d]", itemName(offer.itemId, labels),
            counter.ownedCount, counter.choiceIndex, counter.choiceCount)
        draw(selected, x + 37, y + 29, LIGHT, 1, font)
        local prices = string.format(labels.pawnPrices, offer.payout, offer.redeemPrice)
        if offer.bonus > 0 then
            prices = prices .. labels.featured
        end
        draw(prices, x + 37, y + 43, GOLD, 1, font)
    elseif offer.kind == "redeem" then
        drawItem(offer.itemId, x + 17, y + 52)
        draw(string.format(labels.redeemItem, itemName(offer.itemId, labels)), x + 37, y + 29, LIGHT, 1, font)
        local prices = string.format(labels.wallet, offer.redeemPrice, counter.coins)
        local shortfall = offer.redeemPrice - counter.coins
        if shortfall > 0 then
            prices = prices .. string.format(labels.shortage, shortfall)
        end
        draw(prices, x + 37, y + 43, shortfall <= 0 and GOLD or WARNING, 1, font)
    elseif offer.kind == "used" then
        draw(labels.used, x, y + 26, MUTED, 1, font)
    else
        draw(labels.noItem, x, y + 26, MUTED, 1, font)
        drawFocus(x, y + 41, focus, labels, font)
    end

    drawControls(x, y + 58, offer, pending, counter.choiceCount, labels, font)
    local feedback = counter.feedback
    if feedback ~= nil and frame < feedback.hideAtFrame then
        draw(ui.formatFeedback(feedback, labels), x, y - 17, LIGHT, 1, font)
    end
end

return ui
