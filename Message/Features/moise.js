import Uploader from "../../Libs/Uploader.js";

export default {
	command: ["moise", "novokal"],
	description: "Separate vocal and instrumental from an audio",
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
	execute: async function (m, { sock, api, db }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/audio|video/g.test(mime)) {
			return m.reply("Please reply/send a audio/video with the command");
		}
		const media = await q.download();
		const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
		const url = await Uploader.providers.tmpfiles.upload(buffer);
		m.reply("Processing, can take a while...");
		const { data } = await api.post("/audio/moise", {
			init_url: url,
			options: {
				stems: 2,
				ai_level: 0,
				rigidity: 2,
				accuracy: 4,
				deep: 0,
			},
		});
		const { status, message, result } = data;
		if (!status) {
			return m.reply(message);
		}
		const { id } = result;

		async function pullStatus() {
			return api.get("/audio/moise/fetch_query", { id }).then((res) => res.data);
		}

		// TODO: find better way to do this
		let statusData;
		do {
			statusData = await pullStatus();
			await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
		} while (statusData?.result.status !== "done");

		const { audios } = statusData.result;

		for (const key in audios) {
			await sock.sendMessage(
				m.chat,
				{
					audio: {
						url: audios[key],
					},
					mimetype: "audio/mp4",
				},
				{ quoted: m }
			);
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
