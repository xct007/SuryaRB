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
		// moods = [happy, confident, hype, romantic, dark]
		const { data } = await api.post("/audio/music_ai", {
			prompt,
			gender: "female",
			// mood: "romantic",
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const { id, status: n_status } = result;

		m.reply(`${n_status}, please wait for >= 1 minutes`);

		// TODO: find better way to do this
		async function pollStatus() {
			return api.get("/audio/music_ai/query", { id }).then((res) => res.data);
		}
		try {
			let statusData;
			let retryCount = 0;
			do {
				if (retryCount > 15) {
					break;
				}
				statusData = await pollStatus();

				// don't wait if is done.
				if (statusData?.result?.status === "completed") {
					break;
				}

				await new Promise((resolve) => setTimeout(resolve, 30 * 1000));

				retryCount++;
			} while (statusData?.result?.status !== "completed");

			const { status: l_status, message, result: n_result } = statusData;
			if (!l_status) {
				return m.reply(message || "Can't get the result!");
			}
			const { title, lyrics, url, image_url } = n_result;

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
		} catch (e) {
			console.error(e);
			m.reply(String(e));
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
