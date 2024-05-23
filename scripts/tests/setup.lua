-- Clear all registered modules to reset the roblox-ts runtime
for key in _G do
	if typeof(key) == "Instance" and key:IsA("ModuleScript") then
		_G[key] = nil
	end
end

return nil