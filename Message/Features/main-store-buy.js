export default {
	command: ["buy", "buyitem"],
	description: "Buy an item from the store",
	category: "Main",
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
	execute: async function (m, { args, usedPrefix, command, db }) {
		const user = db.users.get(m.sender);
		const [chosenItem, numberItemToBuy] = args;

		// this items should be exist in user db
		// item_name
		// price in usd
		const items = {
			// "item_name": {
			//     price: 1 // in usd (1 usd = 1 dollar)
			// }
			limit: {
				price: 0.5,
			},
		};
		const USDformatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		});
		const balance = user.balance;
		const userBalance = USDformatter.format(balance);

		if (!items[chosenItem]) {
			const listItems = Object.keys(items)
				.map((x) => `${x} - ${USDformatter.format(items[x].price)}`)
				.join("\n");
			return m.reply(
				`*[Store]*\n\n${listItems}\n\nYour balance: ${userBalance}\nExample: *${
					usedPrefix + command
				}* ${Object.keys(items)[Math.floor(Math.random() * Object.keys(items).length)]} ${Math.floor(
					Math.random() * 10
				)}`
			);
		}
		if (isNaN(numberItemToBuy)) {
			return m.reply("Please enter the number of items you want to buy");
		}

		const item = items[chosenItem];
		if (balance < item.price) {
			return m.reply(
				`You don't have enough balance to buy this item\n\nYour balance: ${userBalance}`
			);
		}

		// this is just an example, you can change this to your own item
		user.balance -= item.price;
		user[chosenItem] = parseInt(user[chosenItem]) + parseInt(numberItemToBuy);

		return m.reply(
			`You have successfully bought ${numberItemToBuy} ${chosenItem} for ${USDformatter.format(
				item.price
			)}\n\nYour balance: ${USDformatter.format(user.balance)}`
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
