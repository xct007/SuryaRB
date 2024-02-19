// File: Message/Features/simi.js
export default {
	command: ["simi"],
	description: "Chat with Simi.",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return sock.sendMessage(
				m.chat,
				{ text: "Please provide a prompt." },
				{ quoted: m }
			);
		}

		if (text.includes("teach")) {
			const [_, ask, answer] = text.match(/teach\s+(.+)\s*\|\s*(.+)/);
			if (!ask || !answer) {
				return sock.sendMessage(
					m.chat,
					{ text: "simi teach <ask> | <answer>" },
					{ quoted: m }
				);
			}
			const { data } = await api.post("/simsimi/teach", {
				ask: ask.trim(),
				answer: answer.trim(),
				lc: "id",
			});

			const { status, result, message: error } = data;

			if (!status) {
				return m.reply(error);
			}

			await sock.sendMessage(m.chat, { text: result.message }, { quoted: m });
		} else {
			const { data } = await api.post("/simsimi/chat", {
				message: text,
				lc: "id",
				level: 5,
			});

			const { status, result, message } = data;

			if (!status) {
				return m.reply(message);
			}

			await sock.sendMessage(m.chat, { text: result.original }, { quoted: m });
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};
