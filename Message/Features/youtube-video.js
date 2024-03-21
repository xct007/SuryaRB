import { Readable } from "stream";
import Y2Mate from "../../Libs/Y2Mate.js";

export default {
	command: ["youtube", "ytmp4", "ytvideo", "ytv"],
	description: "Download YouTube video.",
	category: "Downloader",
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
	execute: async function (m, { sock, args }) {
		const url = args[0];
		if (!url) {
			return m.reply("Please provide a YouTube link");
		}

		const { title, author, urls, error, message } = await Y2Mate.info(url);
		if (error) {
			return m.reply(message);
		}

		const availableQualities = ["360p", "480p", "720p", "1080p"];
		const quality =
			Object.keys(urls).find((key) => availableQualities.includes(key)) || null;
		if (!quality) {
			return m.reply("No available quality found");
		}

		const videoBuffer = await urls[quality].download();
		const bufferSize = videoBuffer.length;
		const fileSizeInMB = bufferSize / (1024 * 1024);
		const sendAs = fileSizeInMB > 50 ? "document" : "video";

		// Convert buffer to stream
		const stream = new Readable({
			read() {
				this.push(videoBuffer);
				this.push(null);
			},
		});

		await sock.sendMessage(
			m.chat,
			{
				[sendAs]: {
					stream,
				},
				...(sendAs === "document" && { fileName: `${title}.mp4` }),
				caption: `Title: ${title}\nAuthor: ${author}\nQuality: ${quality}\nSize: ${urls[quality].size}`,
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
