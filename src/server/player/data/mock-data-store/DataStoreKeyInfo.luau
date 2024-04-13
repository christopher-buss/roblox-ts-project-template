local DataStoreKeyInfo = {}
DataStoreKeyInfo.__index = DataStoreKeyInfo

function DataStoreKeyInfo.new(createdTime, updatedTime, version, userIds, metadata)
	local userIdsType = typeof(userIds)

	if userIdsType ~= "nil" and userIdsType ~= "table" then
		error(`expected userIds to be a table or nil, got {userIdsType}`)
	end

	if userIdsType == "table" then
		local expectedKey = 1
		for key, value in userIds do
			assert(typeof(value) == "number", "userId must be a number")

			if key ~= expectedKey then
				error(`expected userIds to be an array, got invalid key: {key}`)
			end

			expectedKey += 1
		end
	end

	return setmetatable({
		CreatedTime = createdTime * 1000,
		UpdatedTime = updatedTime * 1000,
		Version = version,
		userIds = if userIds ~= nil then table.clone(userIds) else {},
		metadata = if metadata ~= nil then table.clone(metadata) else {},
	}, DataStoreKeyInfo)
end

function DataStoreKeyInfo:GetUserIds()
	return table.clone(self.userIds)
end

function DataStoreKeyInfo:GetMetadata()
	return table.clone(self.metadata)
end

return DataStoreKeyInfo
