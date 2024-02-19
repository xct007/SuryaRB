// File: /home/rose/BOT/SuryaRB/Message/Features/bingimage.js
export default {
	command: ["bingimg", "createimg"],
	description: "Generate Image use Bing.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

	execute: async function (m, { sock, api, text }) {
		if (!text) {
			await m.reply("Please provide a prompt.");
			return;
		}
		const { data } = await api.post("/image/bing_create_image", {
			prompt: text,
		});

		const { status, result, message } = data;

		if (!status) {
			return m.reply(message);
		}

		const { images } = result;

		const sendMessagePromises = images.map(async (url) => {
			await sock.sendMessage(m.chat, { image: { url: url } }, { quoted: m });
		});

		await Promise.all(sendMessagePromises); // for waiting images
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/bingimage.js
