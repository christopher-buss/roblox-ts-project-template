-- Services
local RunService = game:GetService("RunService")
local SoundService = game:GetService("SoundService")

if not RunService:IsClient() then
	error("Sound System 3D is to be run on the client. Use RemoteEvents to have the client create the sound.")
end

-- Localize maths for optimization
-- local acos, cos, pi = math.acos, math.cos, math.pi
-- local atan2, deg = math.atan2, math.deg
local v3, cf = Vector3.new, CFrame.new
local dot = v3().Dot
local newInst, getType = Instance.new, typeof

-- Camera setup
local Camera = workspace.CurrentCamera

-- Create container object
local SoundContainer = newInst("Part")
SoundContainer.Name = "SoundContainer"
SoundContainer.CFrame = cf()
SoundContainer.Anchored = true
SoundContainer.CanCollide = false
SoundContainer.Transparency = 1
SoundContainer.Parent = Camera

-- Setup system
local SoundSystem = {}
local CurrentObjects = {}

function SoundSystem.Attach(SoundObj)
	--------------------------
	-- Sanity checks
	--------------------------

	assert(SoundObj:IsA("Sound"), "Attempt to attach invalid Sound object.")
	assert(
		SoundObj.Parent
			and (SoundObj.Parent:IsA("Attachment") or SoundObj.Parent:IsA("BasePart"))
			and SoundObj:IsDescendantOf(workspace),
		"Cannot have 3D effect on sound that is not in 3D environment"
	)

	--------------------------
	-- Object creation
	--------------------------

	local Equalizer = newInst("EqualizerSoundEffect") -- Create a separate one to ensure it doesn't mess with any existing effects
	Equalizer.LowGain = 0
	Equalizer.MidGain = 0
	Equalizer.HighGain = 0

	--------------------------
	-- Effect controller
	--------------------------

	local isAttachment = SoundObj.Parent:IsA("Attachment")

	local Emitter =
		{ Sound = SoundObj, Position = isAttachment and SoundObj.Parent.WorldPosition or SoundObj.Parent.Position }

	local PositionTracker = SoundObj.Parent:GetPropertyChangedSignal("Position"):Connect(function()
		Emitter.Position = isAttachment and SoundObj.Parent.WorldPosition or SoundObj.Parent.Position
	end)

	CurrentObjects[Emitter] = true

	--------------------------
	-- Finalization
	--------------------------

	Equalizer.Parent = SoundObj

	SoundObj.AncestryChanged:Connect(function(_, Parent)
		if not Parent then
			--Destroyed
			CurrentObjects[Emitter] = nil
		elseif
			(SoundObj.Parent:IsA("Attachment") or SoundObj.Parent:IsA("BasePart"))
			and SoundObj:IsDescendantOf(workspace)
		then
			--Moved
			CurrentObjects[Emitter] = true

			PositionTracker:Disconnect()
			PositionTracker = SoundObj.Parent:GetPropertyChangedSignal("Position"):Connect(function()
				Emitter.Position = isAttachment and SoundObj.Parent.WorldPosition or SoundObj.Parent.Position
			end)
		else
			--Moved to invalid object
			CurrentObjects[Emitter] = nil
		end
	end)
end

function SoundSystem.Create(ID, Target, Looped)
	local TargetType

	--------------------------
	-- Sanity checks
	--------------------------

	if not ID or getType(ID) ~= "string" or not ID:match("%d+") then -- Must exist, be a string, and have numbers
		error("Invalid ID: " .. tostring(ID))
	end
	if Target then -- Must exist
		TargetType = getType(Target)
		if TargetType ~= "Instance" and TargetType ~= "Vector3" and TargetType ~= "CFrame" then -- Must be valid type
			error("Invalid Target: " .. tostring(Target))
		end
	else
		error("Invalid Target: " .. tostring(Target))
	end
	Looped = Looped or false

	--------------------------
	-- Object creation
	--------------------------

	local Emitter = newInst("Attachment")
	--Emitter.Visible	= true

	if TargetType == "Instance" and Target.Position then
		-- Sound follows object
		RunService.RenderStepped:Connect(function()
			Emitter.WorldPosition = Target.Position
		end)
	elseif TargetType == "Vector3" then
		-- Sound in static position
		Emitter.WorldPosition = Target
	elseif TargetType == "CFrame" then
		-- Sound in static position
		Emitter.WorldPosition = Target.Position
	end

	local Sound = newInst("Sound")
	Sound.Looped = Looped
	Sound.SoundId = "rbxassetid://" .. ID:match("%d+")

	local Equalizer = newInst("EqualizerSoundEffect")
	Equalizer.LowGain = 0
	Equalizer.MidGain = 0
	Equalizer.HighGain = 0

	--------------------------
	-- Effect controller
	--------------------------

	CurrentObjects[Emitter] = true
	if not Looped then
		Sound.Ended:Connect(function()
			CurrentObjects[Emitter] = nil
			Emitter:Destroy()
		end)
	end

	--------------------------
	-- Finalization
	--------------------------

	Equalizer.Parent = Sound
	Sound.Parent = Emitter
	Emitter.Parent = SoundContainer

	Sound:Play()

	return Emitter
end

--------------------------
-- 3D-Effect management
--------------------------

RunService.RenderStepped:Connect(function()
	local _, Listener = SoundService:GetListener()

	if Listener then
		if Listener:IsA("BasePart") then
			Listener = Listener.CFrame
		end
	else
		Listener = Camera.CFrame
	end

	for Emitter, _ in pairs(CurrentObjects) do
		local Facing = Listener.LookVector
		local Vector = (Emitter.Position - Listener.Position).unit

		--Remove Y so up/down doesn't matter
		Facing = v3(Facing.X, 0, Facing.Z)
		Vector = v3(Vector.X, 0, Vector.Z)

		local Angle = math.acos(dot(Facing, Vector) / (Facing.magnitude * Vector.magnitude))

		Emitter.Sound.EqualizerSoundEffect.HighGain = -(25 * ((Angle / math.pi) ^ 2))
	end
end)

return SoundSystem
