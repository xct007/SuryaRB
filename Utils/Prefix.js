// File://home/rose/BOT/SuryaRB/Utils/Prefix.js

import { Config } from "../config.js";

/**
 * Normalizes the given prefix by trimming whitespace and converting it to an array if necessary.
 * @param {string | string[]} prefix - The prefix to normalize.
 * @returns {string[]} - The normalized prefix.
 */
function normalizePrefix(prefix) {
	const normalizedPrefix = Array.isArray(prefix)
		? prefix.map((p) => p.trim())
		: [prefix.trim()];
	return normalizedPrefix;
}

/**
 * Extracts the command, arguments, and prefix from the given text based on the configured prefixes.
 * @param {string} text - The text to extract the command from.
 * @returns {[string, string, string]} - An array containing the command, arguments, and prefix.
 */
export function Prefix(text) {
	const prefixes = normalizePrefix(Config.prefix);

	for (const prefix of prefixes) {
		if (text.startsWith(prefix)) {
			const textWithoutPrefix = text.slice(prefix.length).trim();
			const parts = textWithoutPrefix.split(" ");
			const command = parts.shift();
			return [
				command, // The command can be same as textWithoutPrefix
				textWithoutPrefix?.replace(command, "")?.trim() ?? text,
				prefix,
			];
		}
	}

	// If no prefix is found, assume the entire text is the command.
	return [text.trim(), text, ""];
}
