import ffmpeg from "fluent-ffmpeg";
import { fileTypeFromBuffer } from "file-type";
import { Readable } from "stream";
import { readFileSync, existsSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import crypto from "crypto";
import webp from "node-webpmux";
import { outputOptionsArgs } from "../Config/Sticker.js";

/**
 * Represents a Sticker object.
 * @class
 */
class Sticker {
	/**
	 * Constructs a new Sticker object.
	 * @constructor
	 */
	constructor() {
		this.ffmpeg = ffmpeg;
		this.packname = "Itsrose";
		this.author = "Itsrose";
	}

	/**
	 * Converts the media buffer to a webp format using ffmpeg.
	 * @param {Buffer} mediaBuffer - The media buffer to convert.
	 * @param {string[]} args - The additional arguments for ffmpeg.
	 * @returns {Promise<Buffer>} - The converted media buffer.
	 */
	async convert(mediaBuffer, args) {
		const tempPath = join(tmpdir(), crypto.randomBytes(16).toString("hex"));
		return new Promise((resolve, reject) => {
			const stream = new Readable({
				read() {
					this.push(mediaBuffer);
					this.push(null);
				},
			});

			const ffmpegProcess = ffmpeg()
				.input(stream)
				.addOutputOptions(args)
				.toFormat("webp")
				.on("end", () => {
					if (existsSync(tempPath)) {
						const buffer = readFileSync(tempPath);
						unlinkSync(tempPath);
						resolve(buffer);
					}
				})
				.on("error", (err) => {
					reject(err);
				});
			ffmpegProcess.save(tempPath);
		});
	}

	/**
	 * Generates the metadata for the sticker.
	 * @param {Object} options - The options for the sticker metadata.
	 * @returns {Buffer} - The metadata buffer.
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
	 * Creates a sticker from the media buffer.
	 * @param {Buffer} mediaBuffer - The media buffer to create the sticker from.
	 * @param {Object} options - The options for creating the sticker.
	 * @param {string} options.packname - The pack name for the sticker.
	 * @param {string} options.author - The author of the sticker.
	 * @param {string[]} options.emojis - The emojis associated with the sticker.
	 * @returns {Promise<Buffer>} - The created sticker buffer.
	 */
	async create(
		mediaBuffer,
		{ packname = this.packname, author = this.author, emojis = ["❤️"] }
	) {
		const { mime } = (await fileTypeFromBuffer(mediaBuffer)) || {};
		if (!mime) {
			throw new Error("Invalid file type");
		}

		const args = mime.startsWith("image")
			? outputOptionsArgs.image
			: outputOptionsArgs.video;
		const webpBuffer =
			(!mime.includes("webp") && (await this.convert(mediaBuffer, args))) ||
			mediaBuffer;
		const image = new webp.Image();
		await image.load(webpBuffer);
		const exif = this.metadata(this.exif(packname, author, emojis));
		image.exif = exif;
		return await image.save(null);
	}

	/**
	 * Generates the exif data for the sticker.
	 * @param {string} packname - The pack name for the sticker.
	 * @param {string} author - The author of the sticker.
	 * @param {string[]} emojis - The emojis associated with the sticker.
	 * @returns {Object} - The exif data object.
	 */
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
