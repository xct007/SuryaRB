// File://home/rose/BOT/SuryaRB/Message/Features/chatbing.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["diffusion", "diff"],
	description: "All in One Diffusion.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return m.reply("Need text.");
		}

		let initImage = null;
		const quotedMessage = m.quoted ? m.quoted : m;
		const mimeType = quotedMessage.mtype || "";

		if (/webp|image|video|webm/g.test(mimeType)) {
			const media = await quotedMessage.download();
			const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
			initImage = await telegraph(buffer).catch(() => null);
		}

		const { data } = await api.post("/image/diffusion", {
			prompt: text,
			negative_prompt: "nsfw, blur",
			sampler: "Euler a",
			seed: -1,
			ratio: "1:1",
			style: "ACG",
			init_image: initImage,
			cfg: 7.5,
			controlNet: "none",
			image_num: 1,
			steps: 25,
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
	wait: null,
	done: null,
};
