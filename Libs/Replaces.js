// File://home/rose/BOT/SuryaRB/Libs/Replaces.js
const aliases = {
	wait: ["%name", "%tag"],
	done: ["%name", "%tag", "%exec"],
};

/**
 * @param {string} str
 * @param {string} alias
 * @param {{ sock: import("@whiskeysockets/baileys").WASocket, m: import("@whiskeysockets/baileys").proto.IWebMessageInfo & import("../Utils/Messages").ExtendedWAMessage }} options
 */
export default function Replace(str, alias, { sock, m }) {
	if (typeof str !== "string" || !aliases[alias]) {
		return str ?? "";
	}
	// we'll do later
	return str;
}
