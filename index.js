// TODO: Refactor
// File://home/rose/BOT/SuryaRB/index.js
import "dotenv/config";

import connectToWhatsApp from "./Sockets/Connect.js";
import Feature from "./Message/Feature.js";

Feature.init();
connectToWhatsApp();
