// Description: Execute a JavaScript code
// Associated file: exec.js
// Expected behaviour: Execute a JavaScript code

export default {
	command: ["=>"],
	description: "Evaluate a JavaScript code",
	category: "Owner",
	owner: true,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { text, args }) {
		m.reply("Exec: " + text);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
