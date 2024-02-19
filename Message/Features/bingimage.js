export default {
	command: ["bingimg", "createimg"],
	description: "Generate Image use Bing.",
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
	execute: async function (m, { sock, api, text }) {
		if (!text) {
			m.reply("Please provide a prompt.");
			return;
		}

		m.replyUpdate("Progress...", async (update) => {
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
			update("Done");
		});
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};

// Path: Message/Features/bingimage.js
