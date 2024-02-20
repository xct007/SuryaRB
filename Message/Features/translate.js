// File://home/rose/BOT/SuryaRB/Message/Features/translate.js

export default {
	command: ["translate", "tr"],
	description: "Translate to any languange.",
	category: "Tools",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, args, usedPrefix, command }) {
		const defaultLang = "id";
		const q = m.quoted ? m.quoted : m;

		if (!args[0] && !q) {
			return m.reply(`*Usage*: ${usedPrefix + command} id how are you`);
		}

		let lang = args[0];
		let text = args.slice(1).join(" ");

		if ((args[0] || "").length !== 2) {
			lang = defaultLang;
			text = args.join(" ");
		}

		if (!text && q.text) {
			text = q.text;
		}

		const { data } = await api.get("/tools/translate", {
			text,
			source_lang: "auto",
			target_lang: lang,
		});

		const { status, result, message } = data;

		if (!status) {
			return m.reply(message);
		}

		await sock.sendMessage(m.chat, { text: result.translations[0] }, { quoted: m });
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
