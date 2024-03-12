import Uploader from "../../Libs/Uploader.js";

export default {
  command: ["diffusion", "diff"],
  description: "All in One Diffusion.",
  category: "Image",
  owner: false,
  admin: false,
  hidden: false,
  limit: false,
  group: false,
  private: false,

  execute: async function (m, { sock, api, text }) {
    if (!text) {
      m.reply("Please provide a prompt.");
      return;
    }
    const q = m.quoted ? m.quoted : m;
    const mime = q.mtype || "";
    if (!/image/g.test(mime)) {
      return m.reply("Please reply/send a image with the command");
    }
    const media = await q.download();
    const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
    const url = await Uploader.providers.telegraph.upload(buffer);
    m.replyUpdate("...", async (update) => {
      const { data } = await api.post("/image/diffusion", {
        prompt: text,
        negative_prompt: "nsfw, blur",
        sampler: "Euler a",
        seed: -1,
        ratio: "1:1",
        style: "ACG",
        init_image: url,
        cfg: 7.5,
        controlNet: "none",
        image_num: 1,
        steps: 25,
      });

      const { status, message, result } = data;

      if (!status) {
        return m.reply(message);
      }

      let metadataText = "";
      for (const key in result.metadata) {
        if (result.metadata.hasOwnProperty(key)) {
          metadataText += `*${key}*: ${result.metadata[key]}\n`;
        }
      }
      update(metadataText.trim());

      await sock.sendMessage(
        m.chat,
        { image: { url: result.images } },
        { quoted: m },
      );
    });
  },

  failed: "Failed to execute the %cmd command\n%error",
  wait: null,
  done: null,
};