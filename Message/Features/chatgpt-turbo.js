// File://home/rose/BOT/SuryaRB/Message/Features/chatgpt-turbo.js
export default {
	command: ["gpt4", "gpturbo"],
	description: "Chat with AI (Use GPT4).",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}
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
			return m.reply(message);
		}

		await sock.sendMessage(
			m.chat,
			{ text: result.messages.content },
			{ quoted: m }
		);
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/chatgpt-turbo.js
