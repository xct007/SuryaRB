import ffmpeg from "fluent-ffmpeg";
import { fileTypeFromBuffer } from "file-type";
import { Readable, Writable } from "stream";
import { readFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import crypto from "crypto";
import webp from "node-webpmux";
import { outputOptionsArgs } from "../Config/Sticker.js";

class Sticker {
	constructor() {
		this.ffmpeg = ffmpeg;
		this.packname = "Itsrose";
		this.author = "Itsrose";
	}
	/**
	 * Convert the media to webp.
	 * @param {Buffer} mediaBuffer - The media buffer.
	 * @returns {Promise<Buffer>} - The webp buffer.
	 */
	async convert(mediaBuffer) {
		const fileType = await fileTypeFromBuffer(mediaBuffer);
		if (!fileType) {
			throw new Error("Invalid file type");
		}

		const args = fileType.mime.startsWith("image")
			? outputOptionsArgs.image
			: outputOptionsArgs.video;
		const tempPath = join(tmpdir(), crypto.randomBytes(16).toString("hex"));
		return new Promise((resolve, reject) => {
			const stream = new Readable({
				read() {
					this.push(mediaBuffer);
					this.push(null);
				},
			});

			// const buffers = [];
			// const writable = new Writable({
			// 	write(chunk, _encoding, callback) {
			// 		buffers.push(chunk);
			// 		callback();
			// 	},
			// });

			const ffmpegProcess = ffmpeg()
				.input(stream)
				.addOutputOptions(args)
				.toFormat("webp")
				.on("end", () => {
					(existsSync(tempPath) &&
						resolve(readFileSync(tempPath)) &&
						unlinkSync(tempPath)) ||
						reject("File not found");
				})
				.on("error", (err) => {
					reject(err);
				});
			ffmpegProcess.save(tempPath);

			// Im struggling to implement this part. I will try to implement it later
			// writable
			// 	.on("data", (data) => {
			// 		buffers.push(data);
			// 	})
			// 	.on("finish", () => {
			// 		resolve(Buffer.concat(buffers));
			// 	});
		});
	}
	/**
	 * Generate the metadata.
	 * @param {Object} options - The options to be included in the metadata.
	 * @returns {Buffer} - The metadata buffer.
	 * @private
	 */
	metadata(options) {
		const loadDataExif = Buffer.concat([
			Buffer.from([
				0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
			]),
			Buffer.from(JSON.stringify(options), "utf-8"),
		]);
		loadDataExif.writeUIntLE(
			Buffer.from(JSON.stringify(options), "utf-8").length,
			14,
			4
		);
		return loadDataExif;
	}
	/**
	 * Create a sticker from the media.
	 * @param {Buffer} mediaBuffer - The media buffer.
	 * @param {Object} options - The options to be included in the metadata.
	 * @param {string} options.packname - The pack name.
	 * @param {string} options.author - The author name.
	 * @param {string | string[]} options.emojis - The emojis.
	 * @returns {Promise<Buffer>} - The sticker buffer.
	 */
	async create(
		mediaBuffer,
		{ packname = this.packname, author = this.author, emojis = ["❤️"] }
	) {
		const webpBuffer = await this.convert(mediaBuffer);
		const image = new webp.Image();
		await image.load(webpBuffer);
		const exif = this.metadata(this.exif(packname, author, emojis));
		console.log(exif);
		image.exif = exif;
		return await image.save(null);
	}
	exif(packname, author, emojis) {
		return {
			"sticker-pack-id":
				"com.snowcorp.stickerly.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2",
			"sticker-pack-name": packname,
			"sticker-pack-publisher": author,
			emojis: Array.isArray(emojis) ? emojis : [emojis],
			"api-url": "https://api.itsrose.life",
			"android-app-store-link":
				"https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android",
			"ios-app-store-link":
				"https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android",
		};
	}
}

export default new Sticker();
