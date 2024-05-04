// File://home/rose/BOT/SuryaRB/Message/Features/chatbing.js
import Uploader from "../../Libs/Uploader.js";

export default {
	command: ["bing", "bingai"],
	description: "Chat with BingAI.",
	category: "Message",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions}
	 */
	execute: async function (m, { sock, api, text: prompt }) {
		if (!prompt) {
			return m.reply("Need text.");
		}

		let init_image = null;
		const quotedMessage = m.quoted ? m.quoted : m;
		const mimeType = quotedMessage.mtype || "";

		if (/webp|image|video|webm/g.test(mimeType)) {
			const media = await quotedMessage.download();
			const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
			init_image = await Uploader.providers.telegraph.upload(buffer);
		}

		const { data } = await api.post("/chatGPT/bing_chat", {
			prompt,
			...(init_image && { init_image }),
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

		m.reply(content);

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
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
