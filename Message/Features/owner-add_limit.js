// File: Message/Features/character-ai.js
export default {
	command: ["limit"],
	description: "Add or reduce the limit of a user",
	category: "Owner",
	owner: true,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, db, args }) {
		const who = m.quoted?.sender || m.mentionedJid[0] || "";
		const [cmd, number] = args.filter((x) => "@" + x !== who && !x.startsWith("@"));
		console.log({
			who,
			cmd,
			number,
		});
		const user = db.users.get(who);
		if (!user) {
			return m.reply("User not found");
		}
		if (isNaN(number)) {
			return m.reply("Invalid number");
		}
		if (cmd === "add") {
			user.limit += Number(number);
			return m.reply(`Success added ${number} to ${who}'s limit`);
		} else if (cmd == "reduce") {
			user.limit -= Number(number);
			return m.reply(`Success reduced ${number} from ${who}'s limit`);
		}
	},

	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
