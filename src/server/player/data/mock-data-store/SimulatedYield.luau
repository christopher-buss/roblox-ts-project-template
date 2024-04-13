local SimulatedYield = {}
SimulatedYield.__index = SimulatedYield

function SimulatedYield.new()
	return setmetatable({
		yielding = false,
		threads = {},
	}, SimulatedYield)
end

function SimulatedYield:yield()
	if not self.yielding then
		return
	end

	table.insert(self.threads, coroutine.running())

	coroutine.yield()
end

function SimulatedYield:startYield()
	self.yielding = true
end

function SimulatedYield:stopYield()
	self.yielding = false

	for _, thread in self.threads do
		task.spawn(thread)
	end

	table.clear(self.threads)
end

return SimulatedYield
