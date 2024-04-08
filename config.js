// File://home/rose/BOT/SuryaRB/config.js
export const Config = {
	phone_number: "6281278380339",
	owners: ["628385818401", "+62 887-3133-561"],

	use_pairing_code: true,
	pairing_wait: 1000 * 6,

	prefix: ["!", ".", ""],

	itsrose_apikey: process.env.ITSROSE_APIKEY || "Trial_Account_10K",

	// change the timezone to your timezone
	timezone: "Asia/Jakarta",

	database: {
		use_mongo: false,
		mongo_url: "mongodb://localhost:27017/database",

		path: "./database.json",
		save_interval: 10_000,
		debug: false,
	},
};
