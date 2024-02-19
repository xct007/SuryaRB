// File://home/rose/BOT/SuryaRB/Message/Features/upload.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["upload", "tourl"],
	description: "Upload a file to telegra.ph",
	category: "Utility",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,

	execute: async function (m, { sock }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/webp|image|video|webm/g.test(mime)) {
			return m.reply("Please reply/send an image with the command");
		}
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const url = await telegraph(buffer);
		m.reply(url);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
