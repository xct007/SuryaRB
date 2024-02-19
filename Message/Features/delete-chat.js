// File://home/rose/BOT/SuryaRB/Message/Features/delete-chat.js

export default {
	command: ["del", "delete"],
	description: "Delete message.",
	category: "Group",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,

	execute: async function (m, { sock, isAdmin, isOwner, isBotAdmin }) {
		if (m.quoted) {
			if (m.isGroup && (isAdmin || isOwner) && isBotAdmin) {
				return m.quoted.delete();
			}
			if (m.quoted.fromMe) {
				m.quoted.delete();
			}
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
