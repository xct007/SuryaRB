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

		const msg = await sock.sendMessage(
			m.chat,
			{ text: "_Preparing Txt2Img_" },
			{ quoted: m }
		);

		const { data } = await api.post("/image/diffusion/txt2img", {
			// sd-api server name
			server_name: "frieren",

			// positif and negative prompt
			prompt: text,
			negative_prompt: "(low quality:1.3), (worst quality:1.3), (monochrome:0.8)",

			// Image w/h
			width: 512,
			height: 768,
			image_num: 1,

			// number of inference steps
			steps: 25,

			// Model and sampler
			model_id: "yesmix",
			sampler: "DPM++ 2M Karras",

			// lora model and strength
			// lora_model: "fashion-girl",
			// lora_strength: "0.8",

			// sd options
			clip_skip: 2,
			safety_checker_type: "blur",
			cfg: 7,
		});

		const { status, result, message } = data;

		if (!status) {
			await sock.sendMessage(m.chat, {
				text: message,
				edit: { ...msg.key },
			});
			return;
		}

		await sock.sendMessage(m.chat, {
			text: `Image generated in ${result["generation_time"].toFixed(2)} seconds`,
			edit: { ...msg.key },
		});

		// wait the image to be ready
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, result["generation_time"] * 1000);
		});

		await sock.sendMessage(m.chat, {
			text: (function (t = "") {
				for (const key in result["metadata"]) {
					t += `*${key}*: ${result["metadata"][key]}\n`;
				}
				return t.trim();
			})(`*server_name*: ${result["server_name"]}\n`),
			edit: { ...msg.key },
		});

		/** Loop. Can be useful if image_num more than 1 */
		try {
			for await (const url of result["images"]) {
				await sock.sendMessage(
					m.chat,
					{
						image: { url },
					},
					{ quoted: m }
				);
			}
		} catch {
			await sock.sendMessage(m.chat, {
				text: "Failed getting images from: " + result["images"].join(", "),
				edit: { ...msg.key },
			});
		}
	},

	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
