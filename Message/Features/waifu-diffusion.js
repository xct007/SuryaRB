// File://home/rose/BOT/SuryaRB/Message/Features/waifu-diffusion.js
export default {
	command: ["waifudiff", "animedif"],
	description: "Diffusion style anime.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}
		const { data } = await api.get("/image/anime/diffusion", {
			prompt: text,
			negative_prompt: "nsfw, blur",
			width: 512,
			height: 512,
		});
		const { status, message, result } = data;

		if (!status) {
			return m.reply(message);
		}

		const images = result.images;
		const base64Image = images[0];

		await sock.sendMessage(
			m.chat,
			{ image: Buffer.from(base64Image, "base64") },
			{ quoted: m }
		);
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
