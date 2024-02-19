// File://home/rose/BOT/SuryaRB/Message/Features/chatbing.js
import Queue from "../../Libs/Queue.js";

export default {
	command: ["waitlist"],
	description: "List of waiting commands",
	category: "Owner",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		const list = Queue.list;
		const keys = Object.keys(list);
		if (!keys.length) {
			m.reply("No waiting commands");
			return;
		}
		let message = "";
		for (const key of keys) {
			message += `*${key}*\n`;
			for (const plugin of list[key]) {
				const command = Array.isArray(plugin.command)
					? plugin.command[0]
					: plugin.command;
				message += `↳ ${command}\n`;
			}
		}
		m.reply(message.trim());
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
