// File://home/rose/BOT/SuryaRB/Message/Features/tiktok.js
import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

export default {
	command: ["instagram", "ig"],
	description: "Download Media from Instagram.",
	category: "Downloader",
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
	execute: async function (m, { sock, api, args }) {
		const url = args[0];
		if (!url) {
			return m.reply("Please provide a Instagram link");
		}
		const { data } = await api.get("/downloader/ig", { url });
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const getT = async (url) => {
			const { data } = await axios.get(url, { responseType: "arraybuffer" });
			const { mime } = await fileTypeFromBuffer(data);
			return [
				mime.includes("video") ? "video" : mime.includes("audio") ? "audio" : "image",
				data,
			];
		};
		for (const url of result.urls) {
			const [type, data] = await getT(url);
			if (!type) {
				continue;
			}
			await sock.sendMessage(
				m.chat,
				{
					[type]: data,
				},
				{ quoted: m }
			);
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
