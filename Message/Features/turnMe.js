// File: /home/rose/BOT/SuryaRB/Message/Features/turnMe.js
import { telegraph } from "../../Libs/Uploader.js";

export default {
	command: ["turnme"],
	description: "Turning image to any styles.",
	category: "Image",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,
	group: false,
	private: false,

    execute: async function (m, { sock, api, text }) {
        if (!text) {
            return m.reply("Need text.");
        }
        const q = m.quoted ? m.quoted : m;
        const mime = q.mtype || "";
        if (!/image/g.test(mime)) {
            return m.reply("Please reply/send a image with the command");
        }
        const media = await q.download();
        const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
        const url = await telegraph(buffer);
        const [style, prompt] = text.split(" ", 2);
        if (!style || !prompt) {
            return m.reply("Please provide both style and prompt.");
        }
        const { data } = await api.post("/image/turnMe", {
            init_image: url,
            style,
            skin: "default",
            image_num: 1,
            prompt,
            strength: 0.6
        });

		const { status, message, result, styles } = data;

		if (!status) {
            let count = 1,
            extra_msg = "";
          if (styles && Array.isArray(styles)) {
            extra_msg += "\n_Here are the available styles:_\n\n";
            for (const id of styles) {
              extra_msg += `${count}. ${id}\n`;
              count += 1;
            }
          }
      
          return m.reply(message + extra_msg);
		}

		await sock.sendMessage(m.chat, { image: { url: result.images } }, { quoted: m })

	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: ["Please wait %tag", "Hold on %tag, fetching response"],
	done: null,
};