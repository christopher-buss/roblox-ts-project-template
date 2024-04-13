local function validateString(name, value, maxLength)
	if #value == 0 then
		error(string.format("`%s` can't be empty string", name))
	elseif #value > maxLength then
		error(string.format("`%s` is too long (exceeds %d characters)", name, maxLength))
	end
end

return validateString
