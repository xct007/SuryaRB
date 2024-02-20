// File://home/rose/BOT/SuryaRB/Message/Features/pinterest.js

export default {
	command: ["pinterest", "pin"],
	description: "Pinterest image search.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply("Need text.");
		}
		const { data } = await api.get("/searching/pinterest", {
			query: text,
		});

		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}

		const random = Math.floor(Math.random() * result.length);

		await sock.sendMessage(
			m.chat,
			{ image: { url: result[random] } },
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
