// File://home/rose/BOT/SuryaRB/Message/Features/upload.js
import uploader from "../../Libs/Uploader.js";

export default {
	command: ["upload", "tourl"],
	description: "Upload a file",
	category: "Utility",
	owner: false,
	group: false,
	admin: false,
	hidden: false,
	limit: false,
	private: false,

	execute: async function (m, {}) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/webp|image|video|webm/g.test(mime)) {
			return m.reply("Please reply/send an image with the command");
		}
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		let result = "";
		for (const provider of Object.values(uploader.providers)) {
			try {
				result += `${provider.constructor.name}: ${await provider.upload(buffer)}\n`;
			} catch (error) {
				console.error(error);
			}
		}
		m.reply(result.trim());
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
