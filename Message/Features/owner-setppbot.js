import Jimp from "jimp";

export default {
	command: ["setpp", "ppbot"],
	description: "Change profile picture.",
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
			return m.reply("Please reply/send a image with the command");
		}

		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");

		async function processProfilePicture() {
			try {
				const image = await Jimp.read(buffer);
				image.crop(0, 0, image.getWidth(), image.getHeight()).scaleToFit(720, 720);
				return await image.getBufferAsync(Jimp.MIME_JPEG);
			} catch (error) {
				console.error(error);
				return null;
			}
		}

		const content = await processProfilePicture();
		if (!content) {
			return m.reply("failed");
		}
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
					content,
				},
			],
		});

		m.reply("Successfully change profile picture.");
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
