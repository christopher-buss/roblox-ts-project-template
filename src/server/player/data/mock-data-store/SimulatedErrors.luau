local SimulatedErrors = {}
SimulatedErrors.__index = SimulatedErrors

function SimulatedErrors.new()
	return setmetatable({
		errorsToSimulate = 0,
	}, SimulatedErrors)
end

function SimulatedErrors:addSimulatedErrors(amount)
	assert(typeof(amount) == "number", "`amount` must be a number")

	self.errorsToSimulate += amount
end

function SimulatedErrors:simulateError(method)
	if self.errorsToSimulate > 0 then
		self.errorsToSimulate -= 1

		error(string.format("`%s` rejected with error (simulated error)", method))
	end
end

return SimulatedErrors
