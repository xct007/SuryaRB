// File: Message/Features/character-ai.js
export default {
	command: ["cai"],
	description: "Chat with Character AI",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions}
	 */
	execute: async function (m, { api, text }) {
		if (!text) {
			return m.reply("Need Text");
		}
		const update = await m.replyUpdate("...");
		const { data } = await api.post("/cai/chat", {
			character_id: "1cffd389-ecb5-4498-8780-a2734ceb5f14",
			message: text,
			enable_nsfw: false,
			model: "rs_v8_72b",
		});
		const { status, message, result } = data;
		update(status ? result.message : message);
	},

	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
