export default {
	command: ["music", "musicai"],
	description: "Create an song from your prompt",
	category: "Audio",
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
	execute: async function (m, { sock, api, text: prompt, usedPrefix, command }) {
		if (!prompt) {
			return m.reply(
				`Usage: *${usedPrefix + command}* I love ITSROSE API, extends your subscription now!`
			);
		}

		// genders = [male, female, random]
		// moods = [happy, confident, hype, romantic, dark] etc..
		// genres = see docs
		const options = {
			gender: "female",
		};

		// Regular expression to match --option like cli wkwk
		const regex = /--(\w+)\s+([\w-]+)/g;

		let match;
		while ((match = regex.exec(prompt)) !== null) {
			const opt_name = match[1];
			const value = match[2];

			options[opt_name] = value;
		}

		prompt = prompt.replace(regex, "").trim();

		const { data } = await api.post("/audio/music_ai", {
			prompt,
			...options,
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const { id, status: n_status } = result;

		m.reply(`${n_status}, please wait for >= 1 minutes\n\nid: ${id}`);

		const MAX_RETRIES = 15;
		const RETRY_DELAY = 30 * 1000;
		async function pollStatus(id) {
			try {
				const res = await api.get("/audio/music_ai/query", { id });
				return res.data;
			} catch (error) {
				console.error(`Error polling status: ${error}`);
				return null;
			}
		}
		let retryCount = 0;
		let statusData;
		while (retryCount < MAX_RETRIES) {
			statusData = await pollStatus(id);

			if (
				!statusData ||
				statusData?.result?.status === "completed" ||
				!statusData?.status
			) {
				break;
			}

			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			retryCount++;
		}

		if (!statusData || !statusData.status) {
			return m.reply(statusData?.message || "Can't get the result!. ID: " + id);
		}

		const { title, lyrics, url, image_url } = statusData.result;

		// send the image with title and lyrics
		const msg = await sock.sendMessage(
			m.chat,
			{
				image: { url: image_url },
				caption: `*${title}*\n\n${lyrics}\n\nid: ${id}`,
			},
			{ quoted: m }
		);

		// should we convert first?
		await sock.sendMessage(
			m.chat,
			{
				audio: { url },
				mimetype: "audio/mp4",
			},
			{ quoted: msg }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
