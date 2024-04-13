local RunService = game:GetService("RunService")

local Budget = require(script.Budget)
local Constants = require(script.Constants)
local GlobalDataStore = require(script.GlobalDataStore)
local SimulatedErrors = require(script.SimulatedErrors)
local SimulatedYield = require(script.SimulatedYield)
local validateString = require(script.validateString)

local function assertServer()
	if not RunService:IsServer() then
		error("DataStore can't be accessed from the client")
	end
end

local DataStoreServiceMock = {}
DataStoreServiceMock.__index = DataStoreServiceMock

function DataStoreServiceMock.new()
	return setmetatable({
		dataStores = {},
		errors = SimulatedErrors.new(),
		yield = SimulatedYield.new(),
		budget = Budget.new(),
	}, DataStoreServiceMock)
end

function DataStoreServiceMock.manual()
	return setmetatable({
		dataStores = {},
		errors = SimulatedErrors.new(),
		yield = SimulatedYield.new(),
		budget = Budget.manual(),
	}, DataStoreServiceMock)
end

function DataStoreServiceMock:GetDataStore(name, scope)
	assertServer()

	scope = scope or "global"

	validateString("name", name, Constants.MAX_NAME_LENGTH)
	validateString("scope", scope, Constants.MAX_SCOPE_LENGTH)

	if self.dataStores[name] == nil then
		self.dataStores[name] = {}
	end

	if self.dataStores[name][scope] == nil then
		self.dataStores[name][scope] = GlobalDataStore.new(self.budget, self.errors, self.yield)
	end

	return self.dataStores[name][scope]
end

function DataStoreServiceMock:GetRequestBudgetForRequestType(requestType)
	local budget = self.budget.budgets[requestType]

	if budget == nil then
		error("`requestType` must be an Enum.DataStoreRequestType")
	end

	return budget
end

return DataStoreServiceMock
