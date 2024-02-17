// File://home/rose/BOT/SuryaRB/Message/Features/chatgpt.js
export default {
	command: ["gpt", "ai"],
	description: "Chat with AI.",
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
		const { data } = await api.post("/chatGPT/completions", {
			prompt: text,
		});
		const { message } = data;
		await sock.sendMessage(m.chat, { text: message }, { quoted: m });
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};
