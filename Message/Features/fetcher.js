// File://home/rose/BOT/SuryaRB/Message/Features/fetcher.js
import axios from "axios";

export default {
	command: ["get", "fetch"],
	description: "get something from the url",
	category: "Utility",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, args }) {
		const url = args[0];
		if (!url) {
			return m.reply("Need url");
		}
		const { data, headers } = await axios
			.request({
				url,
				method: "GET",
				responseType: "arraybuffer",
			})
			.catch((e) => e?.response || { data: null, headers: null });
		if (!data || !headers) {
			return m.reply("Failed to fetch the url");
		}
		const mediaMap = {
			image: "image",
			video: "video",
			audio: "audio",
		};
		function validatingContent() {
			for (const key in mediaMap) {
				if (headers?.["content-type"]?.includes(mediaMap[key])) {
					return key;
				}
			}
			return null;
		}
		if (headers["content-type"].includes(Object.values(mediaMap))) {
			return sock.sendMessage(
				m.chat,
				{ [validatingContent()]: Buffer.from(data) },
				{ quoted: m }
			);
		}
		try {
			const json = JSON.parse(data.toString());
			return m.reply(JSON.stringify(json, null, 2));
		} catch {
			return m.reply(data.toString());
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
