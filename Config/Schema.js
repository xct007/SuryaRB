export const UserSchema = {
	name: String,
	limit: Number,
	premium: Boolean,
	banned: Boolean,
};

export const GroupSchema = {
	name: String,
	banned: Boolean,
};

export const Features = {
	command: Array,
	description: String,
	category: String,
	owner: Boolean,
	admin: Boolean,
	hidden: Boolean,
	limit: Boolean,
	group: Boolean,
	private: Boolean,
	execute: Function,
	failed: String,
	wait: String,
	done: String,
};
