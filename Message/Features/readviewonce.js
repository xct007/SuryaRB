export default {
	command: ["rvo", "readvo"],
	description: "Read view once.",
	category: "Utility",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	execute: async function (m, { sock }) {
		const q = m.quoted ? m.quoted : m;
		const type = Object.keys(q.message || q)[0];
		if (!q.message?.[type].viewOnce) {
			return m.reply("This message isn't viewonce.");
		}
		try {
			const txt = q.message[type].caption || "";
			const buffer = await q.download();
			if (/audio/.test(type)) {
				return await sock.sendMessage(
					m.chat,
					{ audio: buffer, ptt: true },
					{ quoted: m }
				);
			}
			await sock.sendMessage(
				m.chat,
				{ [type.includes("image") ? "image" : "video"]: buffer, caption: txt },
				{ quoted: m }
			);
		} catch (e) {
			console.log(e);
			return m.reply("Already opened.");
		}
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};