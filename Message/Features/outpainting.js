import Uploader from "../../Libs/Uploader.js";

export default {
  command: ["outpainting"],
  description: "Image diffusion using outpainting.",
  category: "Image",
  owner: false,
  admin: false,
  hidden: false,
  limit: false,
  group: false,
  private: false,

  execute: async function (m, { sock, api, args }) {
    const q = m.quoted ? m.quoted : m;
    const mime = q.mtype || "";
    if (!/image/g.test(mime)) {
      return m.reply("Please reply/send a image with the command");
    }
    const prompt = args.join(" ");
    const media = await q.download();
    const buffer = Buffer.isBuffer(media) ? media : Buffer.from(media, "utf-8");
    const url = await Uploader.providers.telegraph.upload(buffer);

    m.replyUpdate("...", async (update) => {
      const { data } = await api.post("/image/outpainting", {
        prompt,
        type: "url|base64",
        init_image: url,
      });

      const { status, result, message } = data;

      if (!status) {
        return update(message);
      }

      let metadataText = "";
      for (const key in result.metadata) {
        if (result.metadata.hasOwnProperty(key)) {
          metadataText += `*${key}*: ${result.metadata[key]}\n`;
        }
      }
      update(metadataText);

      const images = result.images;
      const base64Image = images[0];

      await sock.sendMessage(
        m.chat,
        { image: Buffer.from(base64Image, "base64") },
        { quoted: m },
      );
    });
  },

  failed: "Failed to execute the %cmd command\n%error",
  wait: null,
  done: null,
};