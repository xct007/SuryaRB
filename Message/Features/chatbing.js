// File://home/rose/BOT/SuryaRB/Message/Features/chatbing.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["bing", "bingai"],
	description: "Chat with BingAI.",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			return;
		}
		let init_image = null;
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (/webp|image|video|webm/g.test(mime)) {
			const media = await q.download();
			const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
			init_image = await telegraph(buffer).catch(() => null);
		}
		const { data } = await api.post("/chatGPT/bing_chat", {
			prompt: text,
			init_image,
			time_zone: "Asia/Jakarta",
			tone: "Balanced",
			strip_markdown: false,
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const {
			sources,
			message: { content },
			invocation,
		} = result;
		await sock.sendMessage(m.chat, { text: content }, { quoted: m });
		if (invocation?.type === "image") {
			try {
				for (const url of invocation.images) {
					await sock.sendMessage(
						m.chat,
						{
							image: {
								url,
							},
						},
						{ quoted: m }
					);
				}
			} catch {}
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
