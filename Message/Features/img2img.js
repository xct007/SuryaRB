import Uploader from "../../Libs/Uploader.js";

export default {
	command: ["img2img", "image2image"],
	description: "Generate image to image with prompt.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import(../../Utils/Messages).ExtendedWAMessage} m - The message object.
	 * @param {import(../Handler).miscOptions}
	 */
	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/image/g.test(mime)) {
			return m.reply("Please reply/send a image with the command");
		}
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const init_image = await Uploader.providers.apiGratis.upload(buffer);

		const update = await m.replyUpdate("...");
		const { data } = await api.post("/image/diffusion/img2img", {
			server_name: "jisoo",
			prompt: text,
			negative_prompt:
				"nsfw, bad anatomy, lowres, extra hands, extra legs, extra finger",
			init_image,
			strength: 0.7,
			width: 512,
			height: 512,
			steps: 25,
			model_id: "meinamix",
			sampler: "Euler a",
			cfg: 3,
			enhance_prompt: "no",
			image_num: 1,
			safety_checker: "yes",
			safety_checker_type: "blur",
		});

		const { status, result, message } = data;

		if (!status) {
			return update(message);
		}
		update(`Image generated in ${result.generation_time.toFixed(2)} seconds`);
		let metadataText = "";
		for (const key in result.metadata) {
			if (result.metadata.hasOwnProperty(key)) {
				metadataText += `*${key}*: ${result.metadata[key]}\n`;
			}
		}
		await new Promise((resolve) =>
			setTimeout(resolve, result.generation_time * 1000)
		);
		update(metadataText);
		await sock.sendMessage(
			m.chat,
			{ image: { url: result.images[0] } },
			{ quoted: m }
		);
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
