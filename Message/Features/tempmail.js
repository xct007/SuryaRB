// File://home/rose/BOT/SuryaRB/Message/Features/tempmail.js

export default {
	command: ["tempmail"],
	description: "Create and check message.",
	category: "Tools",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply(`Need action (create or check).`);
		}

		const [action, param] = text.split(" ");

		if (action === "create") {
			let name = param || "icikiwir";

			const { data } = await api.post("/tools/tempMail/new", {
				name,
			});

			const { status, config, email, subscribe, message } = data;

			if (!status) {
				return m.reply(message);
			}

			let emailMessage = `[ *CREATE TEMPMAIL* ]\n\n`;
			emailMessage += `• Status: ${status}\n`;
			emailMessage += `• Name: ${config.name}\n`;
			emailMessage += `• Email: ${email}\n`;
			emailMessage += `• Subscribe: ${subscribe}`;

			await sock.sendMessage(m.chat, { text: emailMessage }, { quoted: m });
		} else if (action === "check") {
			// Check if the command is to check messages of an existing temporary email
			const { data } = await api.post("/tools/tempMail/messages", {
				email: param,
			});

			const { status, message, mails } = data;

			if (!status) {
				return m.reply(message);
			}

			let messageText = "*Message In Email:*\n\n";

			for (const email of mails) {
				messageText += `*ID:* ${email.id}\n`;
				messageText += `*From:* ${email.from}\n`;
				messageText += `*To:* ${email.to}\n`;
				messageText += `*Cc:* ${email.cc || "-"}\n`;
				messageText += `*Subject:* ${email.subject}\n`;
				messageText += `*Messages:* ${email.body_text}\n`;
				messageText += `*Created:* ${email.created_at}\n\n`;
			}

			await sock.sendMessage(m.chat, { text: messageText }, { quoted: m });
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
