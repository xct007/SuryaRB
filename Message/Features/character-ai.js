// File: Message/Features/character-ai.js
export default {
	command: ["cai"],
	description: "Chat with Character AI",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions}
	 */
	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply("Need Text", "funky");
		}
		m.replyUpdate("...", async (update) => {
			const { data } = await api.post("/cai/chat", {
				character_id: "1cffd389-ecb5-4498-8780-a2734ceb5f14",
				message: text,
				enable_nsfw: false,
			});
			const { status, message, result } = data;
			update(status ? result.message : message);
		});
	},

	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
