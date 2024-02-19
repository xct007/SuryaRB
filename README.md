<div align="center">
    <h1 align="center">
                SURYA </br> EXCLUSIVE
        </h1>
    <h3 align="center">
                <u>PERFECTION REDEFINED</u>
        </h3>
    <img src="https://i.pinimg.com/originals/df/f2/f5/dff2f59d1a0ad6e2b6556e3c43c1cf79.jpg" alt="Surya Exclusive MD"/>
</div>

**PT Perusahaan Rokok Tjap Gudang Garam Tbk** ([Republican spelling](https://en.wikipedia.org/wiki/Republican_Spelling_System) [Indonesian](https://en.wikipedia.org/wiki/Indonesian_language) for "Salt Warehouse brand Cigarette Company plc"), [trading as](https://en.wikipedia.org/wiki/Trade_name) **PT Gudang Garam Tbk**, is an Indonesian tobacco company, best known for its [_kretek_](https://en.wikipedia.org/wiki/Kretek) (clove cigarette) products. It is Indonesia's second-largest tobacco manufacturer, with a market share of about 20%. The company was founded on 26 June 1958 by Tjoa Ing Hwie, who changed his name to [Surya Wonowidjojo](https://en.wikipedia.org/wiki/Surya_Wonowidjojo) (1923–1985). In 1984, control of the company was passed to Wonowidjojo's son, Cai Daoheng/Tjoa To Hing ([Rachman Halim](https://en.wikipedia.org/wiki/Rachman_Halim)), who subsequently became the richest man in Indonesia. Halim headed the company until his death at the age of 60 in 2008.

# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Creating features/plugins](#creating-featuresplugins)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contributors](#contributors)

## Requirements

- [Node.js](https://nodejs.org/en/download/) v20 or higher
- [Git](https://git-scm.com/downloads)
- [NPM](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- [FFmpeg](https://ffmpeg.org/download.html)

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/xct007/SuryaRB.git
   ```
2. **Install the dependencies**
   ```sh
   npm install
   ```
3. **Create or rename the .env.example file to .env**
   ```sh
   ITSROSE_APIKEY=PASTE_YOUR_APIKEY_HERE
   ```
   Get your API key from [API Dashboard](https://dash.itsrose.life)
4. **Edit the config.js file**

   ```javascript
   export const Config = {
   	// The bot's phone number
   	// required if use pairing code
   	phone_number: "628385818401",

   	// Owner's phone number
   	owners: ["628385818401"],

   	// use pairing or not
   	use_pairing_code: true,

   	// Wait time for requesting pairing (in milliseconds)
   	pairing_wait: 1000 * 6,

   	// prefix for commands
   	prefix: ["!", "."],

   	// use .env file for API key
   	itsrose_apikey: process.env.ITSROSE_APIKEY,

   	// Database settings
   	database: {
   		// Path to the database file
   		path: "./database.json",

   		// Save interval (in milliseconds)
   		save_interval: 10_000,

   		// show database save logs
   		debug: false,
   	},
   };
   ```

5. **Run the application:**

   `node index.js` / `npm start` / `yarn start`

   or using [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/):

   ```sh
   pm2 start index.js --name "SuryaRB"
   pm2 logs SuryaRB
   ```

## Creating features/plugins

Create new file in `Message/Features` folder with the following template

```javascript
export default {
	// Command to trigger the execution
	// Can be an array of strings to have multiple triggers
	command: ["command", "command2"],
	// Description of the command, displayed in the menu
	description: "The description of the command",
	// Category as header in the menu
	category: "My Category",

	// If true, only the owner listed in config.js can call the command
	owner: false,
	// Only admin in the group can call the command
	admin: false,
	// If hidden, the command will not be shown in the menu
	hidden: false,
	// Not implemented yet
	limit: 0,

	// If true the command only can be call in group chat
	group: false,
	// If true the command only can be call in private chat
	private: false,

	/**
	 * Handler function to execute the command
	 * @param {import("../../Utils/Messages").ExtendedWAMessage} m - The message object.
	 * @param {import("../Handler").miscOptions} options - The options.
	 */
	execute: async function (
		m,
		{
			args,
			sock,
			conn,
			api,
			groupMetadata,
			isOwner,
			isAdmin,
			command,
			text,
			usedPrefix,
			db,
		}
	) {
		// Single reply
		m.reply("Hello World");

		// Single reply with fancy text
		// 2nd parameter is the style of the text listed in Config/Fonts.js
		m.reply("Hello World", "funky");

		// Reply then update message
		m.replyUpdate("previous message", async (update) => {
			// do something
			//...
			// update the message
			update("new message");
		});

		// react to the message
		m.react("👍");

		// delete the message (if the bot has the permission to do so)
		m.delete();

		// Download media (image, video, audio)
		const media = m?.download?.().catch(() => null);
		if (media) {
			// Do something with the media buffer
		}

		// Make a request to the ITSROSE API (Axios instance)
		// api.get() and api.post() are the same as axios.get() and axios.post()
		// 1st parameter is the path to the endpoint (without the base URL)
		// 2nd parameter is the request body or query parameters (optional)
		// See Utils/ApiRequest.js for more information
		const response = await api.get("/path/to/endpoint", { param: "value" });
		if (response.data.status) {
			// Do something with the response
			const data = response.data;
			m.reply(data);
		}
	},

	// Message to display when the command execution fails
	// %cmd alias for the command, %error alias for the error
	failed: "Failed to execute the %cmd command\n\n%error",

	// Message to display while waiting for the command to finish (useless for now)
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	wait: null, // null | string | string[] | any
	// wait: ["Please wait %tag", "Hold on %tag, fetching response"], // random if array

	// Message to display when the command execution is done (useless for now)
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	// %exec = speed the execution time "12.345 ms"
	done: null, // null | string | string[] | any
	// done: "Success %exec" // random if array
};
```

## Contributing

You can contribute to the development of this project by submitting a pull request. If you find any bugs, please report them by creating an issue.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributors

[![](https://contrib.rocks/image?repo=xct007/SuryaRB)](https://github.com/xct007/SuryaRB/graphs/contributors)
