// File://home/rose/BOT/SuryaRB/Message/Features/fetcher.js
import axios from "axios";
import { to_audio } from "../../Libs/Converter.js";

export default {
	command: ["get", "fetch"],
	description: "get something from the url",
	category: "Utility",
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
	execute: async function (m, { sock, args }) {
		const url = args[0];
		if (!url) {
			return m.reply("Need url");
		}

		const { data, headers } = await axios
			.get(url, {
				responseType: "arraybuffer",
			})
			.catch((e) => e?.response);

		if (!data) {
			return m.reply("Failed to fetch the url");
		}

		const mediaMap = { image: "image", video: "video", audio: "audio" };

		function getContentType() {
			const contentType = headers?.["content-type"];
			for (const key in mediaMap) {
				if (contentType.includes(mediaMap[key])) {
					return key;
				}
			}
			return null;
		}

		const contentType = getContentType();
		if (contentType) {
			const content =
				contentType === "audio"
					? await to_audio(Buffer.from(data), "ogg")
					: Buffer.from(data);

			await sock.sendMessage(
				m.chat,
				{
					[contentType]: content,
					...(contentType === "audio" && {
						mimetype: "audio/mpeg",
					}),
				},
				{ quoted: m }
			);
		} else {
			try {
				const json = JSON.parse(data.toString());
				m.reply(JSON.stringify(json, null, 2));
			} catch {
				m.reply(data.toString());
			}
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
