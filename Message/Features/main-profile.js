import axios from "axios";

export default {
	command: ["profile", "myprofile"],
	description: "Show your profile information",
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
	execute: async function (m, { text, args, sock, api, feature, db }) {
		const userProfilePicture = await sock.profilePictureUrl(m.sender, "image");

		const user = db.users.get(m.sender);
		const premium = user.premium ? "Yes" : "No";

		// in usd
		const USDformatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		});
		const balance = USDformatter.format(user.balance);
		const limit = user.limit;

		async function getCurrency() {
			const { data } = await axios.get(
				"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
			);

			// change base on your currency
			const rate = data.usd.idr;
			const Currencyformatter = new Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 2,
			});

			return Currencyformatter.format(user.balance * rate);
		}

		const profile = `Name: ${user.name}
Premium: ${premium}
Balance: ${balance} / ${await getCurrency()}
Limit: ${limit}`;

		return await sock.sendMessage(
			m.chat,
			{
				[userProfilePicture ? "caption" : "text"]: profile,
				...(userProfilePicture && { image: { url: userProfilePicture } }),
			},
			{ quoted: m }
		);
	},
	failed: "Failed to execute the %cmd command\n%error",
	wait: null,
	done: null,
};
