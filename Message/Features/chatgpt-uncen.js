// File://home/rose/BOT/SuryaRB/Message/Features/chatgpt-uncen.js
export default {
	command: ["uncenchat", "uncen"],
	description: "Chat with AI (Uncensored Version).",
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
		const { data } = await api.post("/chatGPT/uncen_chat", {
			messages: [
				{
				  role: "user",
				  content: text,
				},
			  ],
			  max_tokens: 1000,
		  });

		const { status, result, message: error } = data;

		if (!status) {
			return m.reply(error);
		}
		
		await sock.sendMessage(m.chat, { text: result.message }, { quoted: m });
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/chatgpt-uncen.js