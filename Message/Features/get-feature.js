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

	execute: async function (m, { sock, text, usedPrefix, command }) {
		if (!text) {
			return m.reply(`*Usage*: ${usedPrefix + command} simi`);
		}

		const files = readdirSync("./Message/Features");

		if (!files.includes(text + ".js")) {
			const fileList = files.map((file, index) => `${index + 1}. ${file}`).join("\n");
			return m.reply(`'${text}.js' not found\n\nFound this:\n${fileList}`);
		}

		m.reply(await readFileSync(join("./Message/Features", text + ".js"), "utf-8"));
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
