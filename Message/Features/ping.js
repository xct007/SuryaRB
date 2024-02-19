// File://home/rose/BOT/SuryaRB/Message/Features/ping.js
import { performance } from "perf_hooks";
import os from "os";

export default {
	// Command to trigger the execution
	command: ["ping", "p"],
	// Description of the command, displayed in the menu
	description: "Get the bot response time.",
	// Category as header in the menu
	category: "Message",

	// If true, only the owner listed in config.js can call the command
	owner: false,
	// Only admin in the group can call the command
	admin: false,
	// If hidden, the command will not be shown in the menu
	hidden: false,
	// Not useful, but we'll keep it for now
	limit: false,

	// If true the command only can be call in group chat
	group: false,
	// If true the command only can be call in private chat
	private: false,

	// Handler function to execute the command
	execute: async function (m, { sock }) {
		const old = performance.now();
		const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
		const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";

		m.reply(`\`\`\`Server Information

- ${os.cpus().length} CPU: ${os.cpus()[0].model}

- Uptime: ${Math.floor(os.uptime() / 86400)} days
- Ram: ${free_ram}/${ram}
- Speed: ${(performance.now() - old).toFixed(5)} ms\`\`\``);
	},

	// Message to display when the command execution fails
	// %cmd alias for the command, %error alias for the error
	failed: "Failed to execute the %cmd command\n\n%error",

	// Message to display while waiting for the command to finish
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	wait: null, // null | string | string[] | any
	// wait: ["Please wait %tag", "Hold on %tag, fetching response"], // random if array

	// Message to display when the command execution is done
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	// %exec = speed the execution time "12.345 ms"
	done: null, // null | string | string[] | any
	// done: "Success %exec" // random if array
};
