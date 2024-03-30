// File://home/rose/BOT/SuryaRB/Message/Features/get-feature.js
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export default {
	command: ["getfeature", "getplug", "gp"],
	description: "Grab message feature.",
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
	execute: async function (m, { feature, text, usedPrefix, command }) {
		if (!text) {
			return m.reply(`*Usage*: ${usedPrefix + command} simi`);
		}

		let found = false;

		for (const key in feature) {
			if (key === text) {
				found = feature[key].filePath;
				continue;
			}
			if (feature[key].command.includes(text)) {
				found = feature[key].filePath;
				continue;
			}
		}

		if (!found) {
			const featureList = Object.keys(feature)
				.sort()
				.map((name, index) => `${index + 1}. ${name}`)
				.join("\n");
			return m.reply(`'${text}' not found\n\nFound this:\n${featureList}`);
		}

		m.reply(readFileSync(found, "utf-8"));
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
