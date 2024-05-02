export default {
	command: ["pix", "pixiv"],
	description: "Search image work on pixiv",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, api, usedPrefix, command, text: query }) {
		if (!query) {
			return m.reply(`Example: *${usedPrefix + command}* asuna`);
		}
		const { data } = await api.post("/pixiv/search", {
			query,
			enable_nsfw: false,
			num_length: 1,
		});
		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}
		const { results } = result;
		await sock.sendMessage(
			m.chat,
			{ image: { url: results[0].url } },
			{ quoted: m }
		);
	},

	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
