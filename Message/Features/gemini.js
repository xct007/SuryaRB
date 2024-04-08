export default {
	command: ["gemini", "bard"],
	description: "Chat with Gemini.",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: true,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply("Please provide a prompt.");
		}
		const msg = await sock.sendMessage(m.chat, { text: "....." }, { quoted: m });

		const { data } = await api.post("/chatGPT/gemini", {
			prompt: text,
			temperature: 0.5,
			topP: 0.9,
			topK: 40,
			max_tokens: 100,
		});
		const { status, result, message } = data;

		if (!status) {
			await sock.sendMessage(m.chat, { text: message, edit: { ...msg.key } });
			return;
		}

		await sock.sendMessage(m.chat, {
			text: result.messages.content,
			edit: { ...msg.key },
		});
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
