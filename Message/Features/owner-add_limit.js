// File: Message/Features/character-ai.js
export default {
	command: ["limit"],
	description: "Add or reduce the limit of a user",
	category: "Owner",
	owner: true,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, db, args }) {
		const who = m.quoted?.sender || m.mentionedJid[0] || "";
		const [cmd, number] = args.filter((x) => "@" + x !== who && !x.startsWith("@"));
		const user = db.users.get(who);
		if (!user) {
			return m.reply("User not found");
		}
		if (isNaN(number)) {
			return m.reply("Invalid number");
		}
		if (cmd === "add") {
			user.limit += Number(number);
			await sock.sendMessage(
				m.chat,
				{
					text: `Success added ${number} to @${who.replace(/[^0-9]/g, "")}'s limit`,
					mentions: [who],
				},
				{ quoted: m }
			);
		} else if (cmd == "reduce") {
			user.limit -= Number(number);
			await sock.sendMessage(
				m.chat,
				{
					text: `Success reduced ${number} to @${who.replace(/[^0-9]/g, "")}'s limit`,
					mentions: [who],
				},
				{ quoted: m }
			);
		}
	},

	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
