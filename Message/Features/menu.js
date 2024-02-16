// FIle://home/rose/BOT/SuryaRB/Message/Features/menu.js
import Feature from "../Feature.js";

export default {
	command: ["menu"],
	description: "Main Menu",
	category: "Main",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, usedPrefix, isOwner, isAdmin }) {
		// do good enough, but yeah we'll try
		const features = Feature.plugins;
		const filterdHidden = {};
		for (const x in features) {
			if (!features[x].hidden) {
				filterdHidden[x] = features[x];
			}
		}
		const plugins = {};
		for (const p in filterdHidden) {
			const categorie = filterdHidden[p]?.category?.trim() || "Unknown";
			if (!plugins[categorie]) {
				plugins[categorie] = [];
			}
			plugins[categorie].push(filterdHidden[p]);
		}
		const categories = Object.keys(plugins).sort();
		let message = "";
		for (const category of categories) {
			message += `-\`${category}\`\n`;
			for (const plugin of plugins[category]) {
				message += `${usedPrefix}${
					Array.isArray(plugin.command) ? plugin.command[0] : plugin.command
				}\n`;
			}
		}
		m.reply(message.trim());
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
