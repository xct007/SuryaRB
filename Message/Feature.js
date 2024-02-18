// File://home/rose/BOT/SuryaRB/Message/Feature.js
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, watch } from "node:fs";
import { Print } from "../Libs/Print.js";

class Feature {
	constructor() {
		this.isInit = false;
		this.__dirname = dirname(fileURLToPath(import.meta.url));
		this.folder = `${this.__dirname}/Features`;
		this.plugins = {};
	}

	#read = () => {
		return readdirSync(this.folder);
	};

	#watch = () => {
		watch(this.folder, (eventType, filename) => {
			if (eventType === "change") {
				Print.info(`File ${filename} has changed. Re-importing...`);
				this.#import(filename);
			} else if (eventType === "rename" && !filename) {
				Print.info(`File ${filename} has been removed. Deleting...`);
				delete this.plugins[filename];
			}
		});
	};

	#import = async (file) => {
		const isWindows = process.platform === "win32";
		const timestamp = Date.now();
		const filePath = join(isWindows ? `file:///${this.folder}` : this.folder, file);

		if (this.plugins[file]) {
			Print.info(`Re-importing ${file}`);
			delete this.plugins[file];
		}

		try {
			const importedModule = (await import(`${filePath}?t=${timestamp}`)).default;
			this.plugins[file] = importedModule;
			return importedModule;
		} catch (error) {
			Print.error(`Failed to import ${file}`);
			Print.error(error);
		}
	};

	init = async () => {
		const files = this.#read();

		for (const file of files) {
			if (file.endsWith(".js")) {
				await this.#import(file);
			}
		}

		this.#watch();
		this.isInit = true;
		Print.success(Object.keys(this.plugins));
	};
}

export default new Feature();
