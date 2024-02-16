import chalk from "chalk";

export class Print {
	static error(...message) {
		console.log(chalk.red(...message));
	}

	static success(...message) {
		console.log(chalk.green(...message));
	}

	static info(...message) {
		console.log(chalk.blue(...message));
	}

	static warn(...message) {
		console.log(chalk.yellow(...message));
	}

	static debug(...message) {
		console.log(chalk.gray(...message));
	}

	static log(...message) {
		console.log(chalk.white(...message));
	}
}
