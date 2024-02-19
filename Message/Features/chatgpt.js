export default {
	command: ["gpt", "ai"],
	description: "Chat with AI.",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: true,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply("Please provide a prompt.");
		}
		m.replyUpdate("...", async (update) => {
			const { data } = await api.post("/chatGPT/completions", {
				prompt: text,
			});
			const { message } = data;
			update(message);
		});
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
