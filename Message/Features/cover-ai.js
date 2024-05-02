export default {
	command: ["cover", "coverai"],
	description: "AI song cover, create ai cover from youtube video",
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
	execute: async function (m, { sock, api, args, usedPrefix, command }) {
		// format = ["audio", "video"]
		// source_url can be only from youtube or hosted in our api
		// see voice_id list /cover_ai/voices
		const [voice_id, source_url, format = "audio"] = args;
		if (!voice_id || !source_url) {
			return m.reply(
				`Usage: *${usedPrefix + command}* voice_id youtube_url\n\nExample: *${usedPrefix + command}* rose_idol https://www.youtube.com/watch?v=dQw4w9WgXcQ`
			);
		}
		const { data } = await api.post("/audio/cover_ai", {
			source_url,
			voice_id,
			format,
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const { id, status: n_status, source } = result;

		m.reply(
			`${n_status}, please wait for <= 2 minutes\n\n- voice id: ${voice_id}\n- Song title: ${source.title}`
		);

		// TODO: find better way to do this
		async function pollStatus() {
			return api.get("/audio/cover_ai/query", { id }).then((res) => res.data);
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

				await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

				retryCount++;
			} while (statusData?.result?.status !== "completed");

			const { status: l_status, message, result: n_result } = statusData;
			if (!l_status) {
				return m.reply(message || "Can't get the result!");
			}
			await sock.sendMessage(
				m.chat,
				{
					[format]: {
						url: n_result.url,
					},
					...((format === "audio" && {
						mimetype: "audio/mp4",
					}) || { caption: `*${voice_id}*: ${source.title}` }),
				},
				{ quoted: m }
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
