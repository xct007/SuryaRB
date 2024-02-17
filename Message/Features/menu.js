// FIle://home/rose/BOT/SuryaRB/Message/Features/menu.js
import Feature from "../Feature.js";

export default {
	command: ["menu"],
	description: "Show this menu",
	category: "Main",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, usedPrefix, isOwner, isAdmin }) {
		const features = Feature.plugins;
		const filterdHidden = Object.fromEntries(
			Object.entries(features).filter(([_, feature]) => !feature.hidden)
		);
		const plugins = Object.entries(filterdHidden).reduce((acc, [key, value]) => {
			const category = value.category?.trim() || "Unknown";
			acc[category] = acc[category] || [];
			acc[category].push(value);
			return acc;
		}, {});
		const categories = Object.keys(plugins).sort();
		let message = "";
		for (const category of categories) {
			message += `\`\`\`[ ${category} ]\`\`\`\n`;
			for (const plugin of plugins[category]) {
				const command = Array.isArray(plugin.command)
					? plugin.command[0]
					: plugin.command;
				const aliases =
					(Array.isArray(plugin.command) ? plugin.command.slice(1).join(", ") : null) ||
					"-";
				message +=
					((plugin.owner && !isOwner) || (plugin.admin && !isAdmin)
						? `~${usedPrefix + command}~`
						: `\`${usedPrefix + command}\``) + "\n";
				message += `↳ ${plugin.description}\n`;
				message += `↳ Aliases: ${aliases}\n`;
			}
		}
		m.reply(message.trim());
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
