import Jimp from "jimp";

export default {
	command: ["setppgc", "ppgroup"],
	description: "Setting group picture.",
	category: "Group",
	owner: false,
	group: true,
	admin: true,
	hidden: false,
	limit: false,
	private: false,

	execute: async function (m, { sock }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";

		if (!/image|document/g.test(mime)) {
			console.log(mime);
			return m.reply("Please reply/send a image with the command");
		}

		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");

		async function processGroupPicture(media) {
			return new Promise(async (resolve, reject) => {
				try {
					const jimp = await Jimp.read(media);
					const min = jimp.getWidth();
					const max = jimp.getHeight();
					const cropped = jimp.crop(0, 0, min, max);
					const img = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);
					const preview = await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG);
					resolve({ img, preview });
				} catch (error) {
					reject(error);
				}
			});
		}

		const { img } = await processGroupPicture(buffer);
		await sock.query({
			tag: "iq",
			attrs: {
				to: m.chat,
				type: "set",
				xmlns: "w:profile:picture",
			},
			content: [
				{
					tag: "picture",
					attrs: { type: "image" },
					content: img,
				},
			],
		});
		m.reply("Successfully change group picture.");
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
