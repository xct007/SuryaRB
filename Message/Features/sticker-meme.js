// File://home/rose/BOT/SuryaRB/Message/Features/sticker-meme.js
import { telegraph } from "../../Libs/Uploader.js";
import Sticker from "../../Libs/Sticker.js";

export default {
	command: ["smeme", "stickermeme"],
	description: "Create sticker meme.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, args, usedPrefix, command }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/image/g.test(mime)) {
			return m.reply(`Reply or send image with caption *${usedPrefix + command}*`);
		}
		const [teks1 = "", teks2 = ""] = args
			.join(" ")
			.split("|")
			.map((text) => text.trim());
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const url = await telegraph(buffer);
		const { data } = await api.post("/canvas/memegen", {
			init_image: url,
			top: teks1,
			bottom: teks2,
		});

		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}
		const image = Buffer.from(result.base64Image, "base64");
		const sticker = await Sticker.create(image, {
			packname: "SuryaRB",
			author: "SuryaRB acikiwir",
			emojis: "🤣",
		});

		await sock.sendMessage(m.chat, { sticker: sticker }, { quoted: m });
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
