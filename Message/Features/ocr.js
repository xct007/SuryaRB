// File://home/rose/BOT/SuryaRB/Message/Features/ocr.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["ocr"],
	description: "Optical character recognition.",
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
		const { data } = await api.post("/image/ocr", {
			init_image: url,
		});

		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}

		await sock.sendMessage(m.chat, { text: result.text }, { quoted: m })

	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};