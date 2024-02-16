// File://home/rose/BOT/SuryaRB/Utils/Prefix.js
import { Config } from "../config.js";

function normalizePrefix(prefix) {
	const normalizedPrefix = [];
	if (Array.isArray(prefix)) {
		prefix.forEach((p) => {
			normalizedPrefix.push(p.trim());
		});
	} else {
		normalizedPrefix.push(prefix.trim());
	}
	return normalizedPrefix;
}
export function Prefix(text) {
	const prefix = normalizePrefix(Config.prefix);
	return [prefix.some((prefix) => text?.startsWith(prefix)), prefix];
}
