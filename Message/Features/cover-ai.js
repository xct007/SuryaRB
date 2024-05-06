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

		const MAX_RETRIES = 15;
		const RETRY_DELAY = 30 * 1000;
		async function pollStatus(id) {
			try {
				const res = await api.get("/audio/cover_ai/query", { id });
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
			return m.reply(statusData?.message || "Can't get the result!");
		}

		const { url } = statusData.result;
		await sock.sendMessage(
			m.chat,
			{
				[format]: {
					url,
				},
				...((format === "audio" && {
					mimetype: "audio/mp4",
				}) || { caption: `*${voice_id}*: ${source.title}` }),
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
