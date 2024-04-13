export default {
	command: ["numguest", "numberguest"],
	description: "Guest the number game",
	category: "Games",
	owner: false,
	admin: false,
	hidden: false,
	limit: false,
	group: false,
	private: false,

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (m, { text, db }) {
		const user = db.users.get(m.sender);
		if (!user.games) {
			user.games = {};
		}
		const numberGuest = user.games.numberGuest || {};
		if (numberGuest.active) {
			return m.reply("You have an active game");
		}
		numberGuest.active = true;
		numberGuest.number = Math.floor(Math.random() * 10) + 1;
		numberGuest.chance = 5;

		// 50 cents
		numberGuest.prize = 0.5;

		user.games.numberGuest = numberGuest;

		return m.reply(
			"*[Number Guest]* I have chosen a number between 1 and 10, you have 5 chances to guess it. What is the number?"
		);
	},

	/**
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	after: async function (m, { sock, db, text }) {
		const user = db.users.get(m.sender);
		if (!user?.games?.numberGuest?.active || !m.text) {
			return;
		}
		const numberGuest = user.games.numberGuest;
		if (isNaN(m.text.replace(/\s/g, ""))) {
			m.text.toLocaleLowerCase() === "cancel" &&
				m.reply("Number guest game has been cancelled") &&
				delete user.games.numberGuest;
			return;
		}

		const guess = Number(m.text.replace(/\s/g, ""));
		if (guess === numberGuest.number) {
			numberGuest.active = false;

			user.balance += numberGuest.prize;

			delete user.games.numberGuest;
			return m.reply(
				`*[Number Guest]* Congratulations! You have guessed the number. You have won *${"$" + numberGuest.prize}*`
			);
		}

		numberGuest.chance--;
		if (numberGuest.chance <= 0) {
			numberGuest.active = false;
			delete user.games.numberGuest;
			return m.reply(
				`*[Number Guest]* You have run out of chances, the number was *${numberGuest.number}*`
			);
		}

		// very close to the guess number
		if (guess + 1 === numberGuest.number || guess - 1 === numberGuest.number) {
			return m.reply("*[Number Guest]* You are very close to the number");
		}

		m.reply(
			`*[Number Guest]* The number is ${guess > numberGuest.number ? "lower" : "higher"} than ${guess}`
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
