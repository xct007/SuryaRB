// File://home/rose/BOT/SuryaRB/Message/Features/chatgpt-turbo.js
export default {
	command: ["gpt4", "gpturbo"],
	description: "Chat with AI (Use GPT4).",
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
	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}
		m.replyUpdate("...", async (update) => {
			const { data } = await api.post("/chatGPT/turbo", {
				model: "gpt-4-1106-preview",
				max_tokens: 200,
				messages: [
					{
						role: "user",
						content: text,
					},
				],
				filter_messages: true,
			});

			const { status, result, message } = data;

			if (!status) {
				return update(message);
			}
			update(result.messages.content);
		});
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/chatgpt-turbo.js
