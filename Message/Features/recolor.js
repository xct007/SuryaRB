// File://home/rose/BOT/SuryaRB/Message/Features/recolor.js
import Uploader from "../../Libs/Uploader.js";

export default {
	command: ["recolor", "warnain"],
	description: "Recolor image.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
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
		const url = await Uploader.providers.telegraph.upload(buffer);
		const { data } = await api.get("/image/recolor", {
			url,
			json: true,
		});

		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}

		await sock.sendMessage(
			m.chat,
			{ image: Buffer.from(result.base64Image, "base64") },
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};
