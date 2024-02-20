import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["rembg"],
	description: "Remove background from an image.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { sock, text, api }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/image/g.test(mime)) {
			return m.reply("Please reply/send a image with the command");
		}

		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const url = await telegraph(buffer);

		const { data } = await api.post("/image/rembg", {
			init_image: url,
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		await sock.sendMessage(
			m.chat,
			{
				document: {
					url: result.images,
				},
				fileName: "removedbg.png",
				mimetype: "image/png",
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n\n%error",
	wait: null,
	done: null,
};
