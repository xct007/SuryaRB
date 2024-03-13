export default {
  command: ["txt2img", "text2image"],
  description: "Generate image with prompt using AI.",
  category: "Image",
  owner: false,
  admin: false,
  hidden: false,
  limit: false,
  group: false,
  private: false,

  /**
   * @param {import(../../Utils/Messages).ExtendedWAMessage} m - The message object.
   * @param {import(../Handler).miscOptions}
   */
  execute: async function (m, { sock, api, text }) {
    if (!text) {
      m.reply("Please provide a prompt.");
      return;
    }
    m.replyUpdate("...", async (update) => {
      const { data } = await api.post("/image/diffusion/txt2img", {
        server_name: "jisoo",
        prompt: text,
        negative_prompt:
          "nsfw, bad anatomy, lowres, extra hands, extra legs, extra finger",
        width: 512,
        height: 512,
        steps: 25,
        model_id: "meinamix",
        sampler: "UniPC",
        cfg: 7.5,
        seed: "",
        enhance_prompt: "no",
        multi_lingual: "no",
        image_num: 1,
        panorama: "no",
        safety_checker: "no",
        safety_checker_type: "blur",
        lora_model: "",
        lora_strength: 1,
        clip_skip: 2,
        embeddings_model: "",
        webhook: "",
      });

      const { status, result, message } = data;

      if (!status) {
        return update(message);
      }
      update(`Image generated in ${result.generation_time.toFixed(2)} seconds`);
      let metadataText = "";
      for (const key in result.metadata) {
        if (result.metadata.hasOwnProperty(key)) {
          metadataText += `*${key}*: ${result.metadata[key]}\n`;
        }
      }
      setTimeout(() => {
        update(metadataText);
        setTimeout(async () => {
          await sock.sendMessage(
            m.chat,
            { image: { url: result.images[0] } },
            { quoted: m },
          );
        }, result.generation_time * 1000);
      }, result.generation_time * 1000);
    });
  },

  failed: "Failed to execute the %cmd command\n%error",
  wait: null,
  done: null,
};