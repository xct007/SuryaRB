export default {
	command: ["tts"],
	description: "Convert text to speech.",
	category: "Audio",
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
	execute: async function (m, { sock, text, api }) {
		if (!text) {
			return m.reply("Please provide a text to convert to speech.");
		}
		const { data } = await api.post("/sovits/tts/inference_text", {
			text,
			model_id: "c4ad0ce03792f53090a8b49caac493dd",
		});

		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		await sock.sendMessage(
			m.chat,
			{
				audio: {
					url: result.audio,
				},
				mimetype: "audio/mp4",
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
