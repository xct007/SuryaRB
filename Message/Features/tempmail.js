export default {
	command: ["tempmail"],
	description: "Create tempmail and check message.",
	category: "Tools",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, api, text, db }) {
		if (!text) {
			return m.reply(`Need action (create or check).`);
		}

		const [action, param] = text.split(" ");

		const user = db.users.get(m.sender);

		if (action === "create") {
			// Default is "icikiwir" if no name is provided
			const name = param || "icikiwir";

			const { data } = await api.post("/tools/tempMail/new", {
				name,
			});

			const { status, message, email } = data;

			if (!status) {
				return m.reply(message);
			}

			if (!user.emails) {
				user.emails = [];
			}

			user.emails.push(email);

			await sock.sendMessage(m.chat, { text: email }, { quoted: m });
			return;
		}

		if (action === "check") {
			if (!user.emails || !user.emails.includes(param)) {
				return m.reply("You don't have access to this email.");
			}

			const { data } = await api.post("/tools/tempMail/messages", {
				email: param,
			});

			const { status, message, mails } = data;

			if (!status) {
				return m.reply(message);
			}

			if (!mails.length) {
				return m.reply("No message found.");
			}

			let messageText = "*Message In Email:*\n\n";

			for (const obj of mails) {
				for (const key in obj) {
					if (key === "body_html") {
						continue;
					}
					messageText += `*${key}:* ${obj[key]}\n`;
				}
			}

			await sock.sendMessage(m.chat, { text: messageText.trim() }, { quoted: m });
			return;
		}

		if (action === "list") {
			if (!user.emails) {
				return m.reply("You don't have any email.");
			}

			let messageText = "*List of your email:*\n\n";

			for (const [index, email] of user.emails.entries()) {
				messageText += `${index + 1}. ${
					m.isGroup
						? `*${"*".repeat(email.length / 2) + email.slice(email.length / 2)}*`
						: email
				}\n`;
			}

			await sock.sendMessage(m.chat, { text: messageText.trim() }, { quoted: m });
			return;
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
