// File://home/rose/BOT/SuryaRB/Message/Features/gfpgan.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["gfpgan", "gfp"],
	description: "Enhance image to HD using GFP.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/image/g.test(mime)) {
			return m.reply("Please reply/send a image with the command");
		}
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const url = await telegraph(buffer);
		const { data } = await api.post("/image/gfpgan", {
			init_image: url,
			enhance_bg: true,
			enhance_faces: true,
			fix_scratches: false,
		});

		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}

		await sock.sendMessage(
			m.chat,
			{ image: { url: result.images } },
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};
