export default {
	command: ["banchat", "bnc"],
	description: "Banchat group.",
	category: "Owner",
	owner: true,
	group: false,
	admin: false,
	hidden: false,
	limit: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, db, groupMetadata }) {
		const _gc = m.chat;
		const group = db.groups.set(_gc);
		group.banned = true;

		await sock.sendMessage(
			m.chat,
			{
				text: `Banchat at ${groupMetadata.subject}`,
			},
			{ quoted: m }
		);
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
