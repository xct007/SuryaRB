// File://home/rose/BOT/SuryaRB/Message/Features/tiktok.js
import axios from "axios";

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
		const contentType = async (url) =>
			axios
				.head(url)
				.then((res) => res.headers["content-type"])
				.catch(() => null);
		for (const obj of result) {
			const type = await contentType(obj.url);
			if (!type) {
				continue;
			}
			await sock.sendMessage(
				m.chat,
				{
					[type.includes("video") ? "video" : type.includes("audio") ? "audio" : "image"]:
						{ url: obj.url },
				},
				{ quoted: m }
			);
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
