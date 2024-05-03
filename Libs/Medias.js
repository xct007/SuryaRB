export function isMediaMessage(str) {
	return (
		str === "imageMessage" ||
		str === "videoMessage" ||
		str === "audioMessage" ||
		str === "documentMessage" ||
		str === "stickerMessage" ||
		str === "gif" ||
		str?.includes(["image", "video", "document", "gif"])
	);
}

/**
 * @type {keyof import("@whiskeysockets/baileys").proto.Message}
 */
export const mimeMap = {
	imageMessage: "image",
	videoMessage: "video",
	stickerMessage: "sticker",
	documentMessage: "document",
	audioMessage: "audio",
	ptvMessage: "ptv",
};
