// File://home/rose/BOT/SuryaRB/Utils/Store.js
import { makeInMemoryStore } from "@whiskeysockets/baileys";
import { logger } from "./Logger.js";

export const Store = (log = logger) => {
	const store = makeInMemoryStore({ logger: log });
	return {
		...store,
	};
};
