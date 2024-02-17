<div align="center">
    <h1 align="center"> SURYA </br> EXCLUSIVE</h1>
    <h3 align="center"> <u>PERFECTION REDEFINED</u> </h1>
    <img src="https://i.pinimg.com/originals/df/f2/f5/dff2f59d1a0ad6e2b6556e3c43c1cf79.jpg" alt="Surya Exclusive MD"/>
</div>

**PT Perusahaan Rokok Tjap Gudang Garam Tbk** ([Republican spelling](https://en.wikipedia.org/wiki/Republican_Spelling_System) [Indonesian](https://en.wikipedia.org/wiki/Indonesian_language) for "Salt Warehouse brand Cigarette Company plc"), [trading as](https://en.wikipedia.org/wiki/Trade_name) **PT Gudang Garam Tbk**, is an Indonesian tobacco company, best known for its [_kretek_](https://en.wikipedia.org/wiki/Kretek) (clove cigarette) products. It is Indonesia's second-largest tobacco manufacturer, with a market share of about 20%. The company was founded on 26 June 1958 by Tjoa Ing Hwie, who changed his name to [Surya Wonowidjojo](https://en.wikipedia.org/wiki/Surya_Wonowidjojo) (1923–1985). In 1984, control of the company was passed to Wonowidjojo's son, Cai Daoheng/Tjoa To Hing ([Rachman Halim](https://en.wikipedia.org/wiki/Rachman_Halim)), who subsequently became the richest man in Indonesia. Halim headed the company until his death at the age of 60 in 2008.

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
   ITSROSE_APIKEY=YOUR_APIKEY_HERE
   ```
4. **Run the application**
   ```sh
   npm start
   ```

## Creating features/plugins

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

	// Handler function to execute the command
	execute: async function (m, {
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
    }) {
		// Logic
        m.reply("Hello World");
	},

	// Message to display when the command execution fails
	// %cmd alias for the command, %error alias for the error
	failed: "Failed to execute the %cmd command\n\n%error",

	// Message to display while waiting for the command to finish
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	wait: null, // null | string | string[] | any
	// wait: ["Please wait %tag", "Hold on %tag, fetching response"], // random if array

	// Message to display when the command execution is done
	// aliase:
	// %name = user pushName
	// %tag = tag the user
	// %group = group subject/name
	// %exec = speed the execution time "12.345 ms"
	done: null, // null | string | string[] | any
	// done: "Success %exec" // random if array
};
```
