// File://home/rose/BOT/SuryaRB/Message/Features/stable-diffusion.js
export default {
	command: ["stablediff", "diffusion"],
	description: "Create image using diffusion.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}
		const { data } = await api.post("/image/stable/diffusion", {
			prompt: text,
			style: "realistic"
		});
		const { status, result, message } = data;

		if (!status) {
			return m.reply(message);
		}

		await sock.sendMessage(m.chat, { image: { url: result.images } }, { quoted: m });
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/ocr.js