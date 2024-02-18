// File://home/rose/BOT/SuryaRB/Message/Features/sticker.js
import { fileTypeFromBuffer } from "file-type";
import fluent from "fluent-ffmpeg";
import webpmux from "node-webpmux";
import fs from "fs";
import path from "path";

export default {
	command: ["sticker", "stiker", "s"],
	description: "Create a sticker",
	category: "Stickers",
	owner: false,
	admin: false,
	hidden: false,
	limit: 0,

	execute: async function (m, { sock }) {
		const q = m.quoted ? m.quoted : m;
		const mime = q.mtype || "";
		if (!/webp|image|video|webm/g.test(mime)) {
			return m.reply("Please reply/send a image with the command");
		}
		const image = await q.download();
		const sticker = await toWebp(image, m.pushName, "@itsrose", { isFull: true }); // Menambahkan konversi ke sticker webp menggunakan fungsi toWebp
		await sock.sendMessage(m.chat, { sticker: sticker }, { quoted: m });
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};

export async function toWebp(buffer, author, pack, options = {}) {
	return new Promise(async (resolve, reject) => {
		if (!Buffer.isBuffer(buffer)) return reject(`The buffer must be not empty`);
		const { ext } = await fileTypeFromBuffer(buffer);
		if (/(webp)/i.test(ext)) {
			let wm = await setExif(buffer, author, pack);
			return resolve(wm);
		}
		if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif)/i.test(ext))
			return reject(`Buffer not supported media`);
		const input = path.join(process.cwd(), `${Date.now()}.${ext}`);
		const output = path.join(process.cwd(), `${Date.now()}.webp`);
		await fs.writeFileSync(input, buffer);
		let aspectRatio = options.isFull
			? "force_original_aspect_ratio=decrease"
			: "if(gt(iw,ih),-1,299):if(gt(iw,ih),299,-1)";
		var opts;
		switch (ext) {
			case "png":
			case "jpeg":
			case "jpg":
				{
					opts = [
						"-vcodec",
						"libwebp",
						"-vf",
						`scale='min(320,iw)':min'(320,ih)':${aspectRatio},fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
					];
				}
				break;
			case "mp4":
			case "mkv":
			case "m4p":
			case "gif":
				{
					opts = [
						"-vcodec",
						"libwebp",
						"-vf",
						`scale='min(320,iw)':min'(320,ih)':${aspectRatio},fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
						"-loop",
						"0",
						"-ss",
						"00:00:00",
						"-t",
						"00:00:10",
						"-preset",
						"default",
						"-an",
						"-vsync",
						"0",
					];
				}
				break;
		}
		fluent(input)
			.input(input)
			.addOutputOptions(opts)
			.toFormat("webp")
			.save(output)
			.on("end", async () => {
				let bufferEnd = fs.readFileSync(output);
				let wm = await setExif(bufferEnd, author, pack);
				resolve(wm);
				fs.unlinkSync(input);
				fs.unlinkSync(output);
			})
			.on("error", (u) => {
				reject(u);
				fs.unlinkSync(input);
			});
	});
}

export async function setExif(buffer, author, pack) {
	if (!author) author = "@roses_are_rosie";
	if (!pack) pack = "https://itsrose.life";
	return new Promise(async (resolve, reject) => {
		if (!Buffer.isBuffer(buffer)) return reject("The buffer must be not empty");
		const { ext } = await fileTypeFromBuffer(buffer);
		if (!/webp/i.test(ext)) return reject(`The buffer must be of type webp`);
		const file = path.join(process.cwd(), `${Date.now()}.${ext}`);
		await fs.writeFileSync(file, buffer);
		let exif = new webpmux.Image();
		let dataExif = Buffer.from(
			JSON.stringify({
				"sticker-pack-id":
					"com.snowcorp.stickerly.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2",
				"sticker-pack-name": pack,
				"sticker-pack-publisher": author,
				emojis: ["itsrose-life"],
				"api-url": "https://api.itsrose.life",
				"android-app-store-link":
					"https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android",
				"ios-app-store-link":
					"https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android",
			}),
			"utf-8"
		);
		let loadDataExif = Buffer.concat([
			Buffer.from([
				0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
			]),
			dataExif,
		]);
		loadDataExif.writeUIntLE(dataExif.length, 14, 4);
		await exif.load(file);
		exif.exif = loadDataExif;
		await exif.save(file);
		let readData = await fs.readFileSync(file);
		resolve(readData);
		fs.unlinkSync(file);
	});
}
