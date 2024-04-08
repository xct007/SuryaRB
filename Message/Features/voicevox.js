import { to_audio } from "../../Libs/Converter.js";

export default {
	command: ["voicevox", "voice"],
	description: "Voicevox.",
	category: "Voice",
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
		if (text.startsWith("model")) {
			const { data } = await api.get("/voicevox/speakers");
			const { status, result, message: msgmodel } = data;
			if (!status) {
				return m.reply(msgmodel);
			}
			let count = 1;
			let replyMessage = "";
			for (const speaker in result.speakers) {
				replyMessage += `*${count}. ${speaker}:*\n`;
				for (const voiceType in result.speakers[speaker]) {
					replyMessage += `> ${voiceType}: ${result.speakers[speaker][voiceType]}\n`;
				}
				count++;
				replyMessage += "\n";
			}
			return m.reply(replyMessage);
		}

		if (!text) {
			return m.reply("Input text.");
		}

		const match = text.match(/(\d+)\s+(.+)/);

		let speaker = 3;
		let message = text;

		if (match) {
			speaker = parseInt(match[1]);
			message = match[2];
		}

		const response = await api.get("/tools/translate", {
			text: message,
			source_lang: "auto",
			target_lang: "ja",
		});

		const { status: _status, result: _result, message: _message } = response.data;

		if (!_status) {
			return m.reply(_message);
		}

		const _text = _result.translations[0];

		const { data } = await api.post(
			"/voicevox/synthesis",
			{
				speaker: speaker,
				text: _text,
			},
			{
				responseType: "arraybuffer",
			}
		);
		const audio = await to_audio(data, "opus");
		await sock.sendMessage(
			m.chat,
			{
				audio: Buffer.from(audio),
				mimetype: "audio/ogg; codecs=opus",
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
