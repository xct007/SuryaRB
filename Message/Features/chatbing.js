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

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions}
	 */
	async execute(m, { sock, api, text }) {
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
		m.replyUpdate("...", async (update) => {
			const { data } = await api.post("/chatGPT/bing_chat", {
				prompt: text,
				init_image: initImage,
				time_zone: "Asia/Jakarta",
				tone: "Balanced",
				strip_markdown: false,
			});

			const { status, message, result } = data;

			if (!status) {
				return update(message);
			}

			const {
				sources,
				message: { content },
				invocation,
			} = result;

			update(content);

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
				} catch (error) {
					console.error(error);
				}
			}
		});
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
