import jimp_1 from "jimp";

export default {
	command: ["setpp", "ppbot"],
	description: "Setting profile picture.",
	category: "Owner",
	owner: true,
	group: false,
	admin: false,
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

		async function processProfilePicture(media) {
			return new Promise(async (resolve, reject) => {
				try {
					const jimp = await jimp_1.read(media);
					const min = jimp.getWidth();
					const max = jimp.getHeight();
					const cropped = jimp.crop(0, 0, min, max);
					const img = await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG);
					const preview = await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG);
					resolve({ img, preview });
				} catch (error) {
					reject(error);
				}
			});
		}

		const { img } = await processProfilePicture(buffer);
		await sock.query({
			tag: "iq",
			attrs: {
				to: sock.user.id,
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
		m.reply("Successfully change profile picture.");
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
