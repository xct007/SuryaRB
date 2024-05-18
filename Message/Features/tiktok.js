// File:///home/rose/BOT/SuryaRB/Message/Features/tiktok.js

export default {
	command: ["tiktok", "tt"],
	description: "Download TikTok video.",
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
			return m.reply("Please provide a TikTok link");
		}
		const { data } = await api.get("/downloader/tiktok", { url });
		const { status, message, type: _t, download, desc } = data;
		if (!status) {
			return m.reply(message);
		}
		if (_t === "images") {
			// m.sender
			for (const url of download.images) {
				await sock.sendMessage(
					m.chat,
					{ images: { url } },
					{ quoted: m }
				)
			}
			download.music && await sock.sendMessage(m.chat, { audio: { url: download.music } }, { quoted: m });
			return;
		}
		await sock.sendMessage(
			m.chat,
			{ video: { url: download.nowm }, caption: desc },
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
