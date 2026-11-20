local mod = RegisterMod("手柄的“R键”", 1)
local game = Game()

local RIGHT_STICK_BUTTON = 13
local HOLD_DURATION_MS = 1250
local MAX_SAMPLE_GAP_MS = 250

local runActive = false
local armedController
local holdStartedAt
local lastHoldSampleAt

local function resetHold(controllerIndex)
    armedController = controllerIndex
    holdStartedAt = nil
    lastHoldSampleAt = nil
end

local function onRunStarted()
    runActive = true
    resetHold()
end

local function onRunStopped()
    runActive = false
    resetHold()
end

local function getSoloControllerIndex()
    local playerCount = game:GetNumPlayers()
    if playerCount == 0 then
        return nil
    end

    local player = Isaac.GetPlayer(0)
    local controllerIndex = player.ControllerIndex
    if controllerIndex <= 0 or player:IsDead() then
        return nil
    end

    local playerType = player:GetPlayerType()
    if playerType == PlayerType.PLAYER_EDEN or playerType == PlayerType.PLAYER_EDEN_B then
        return nil
    end

    for index = 1, playerCount - 1 do
        if Isaac.GetPlayer(index).ControllerIndex ~= controllerIndex then
            return nil
        end
    end

    return controllerIndex
end

local function renderProgress(elapsedMs)
    local percent = math.floor(elapsedMs * 100 / HOLD_DURATION_MS)
    local label = ("Hold RS to restart  %d%%"):format(percent)
    local x = math.floor((Isaac.GetScreenWidth() - Isaac.GetTextWidth(label)) / 2)
    local y = Isaac.GetScreenHeight() - 24
    Isaac.RenderText(label, x + 1, y + 1, 0, 0, 0, 0.9)
    Isaac.RenderText(label, x, y, 1, 0.96, 0.83, 1)
end

local function onRender()
    if not runActive or game:IsPaused() then
        resetHold()
        return
    end

    local controllerIndex = getSoloControllerIndex()
    if controllerIndex == nil then
        resetHold()
        return
    end

    if not Input.IsButtonPressed(RIGHT_STICK_BUTTON, controllerIndex) then
        resetHold(controllerIndex)
        return
    end

    if armedController ~= controllerIndex then
        resetHold()
        return
    end

    local now = Isaac.GetTime()
    if lastHoldSampleAt and (now < lastHoldSampleAt or now - lastHoldSampleAt > MAX_SAMPLE_GAP_MS) then
        resetHold()
        return
    end

    holdStartedAt = holdStartedAt or now
    lastHoldSampleAt = now
    local elapsedMs = now - holdStartedAt

    if elapsedMs >= HOLD_DURATION_MS then
        resetHold()
        Isaac.ExecuteCommand("restart")
        return
    end

    renderProgress(elapsedMs)
end

mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, onRunStarted)
mod:AddCallback(ModCallbacks.MC_POST_GAME_END, onRunStopped)
mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, onRunStopped)
mod:AddCallback(ModCallbacks.MC_POST_RENDER, onRender)
