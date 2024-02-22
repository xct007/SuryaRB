// File://home/rose/BOT/SuryaRB/Message/Feature.js
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, watch } from "node:fs";
import { importFromString } from "import-from-string";
import { Print } from "../Libs/Print.js";
import { Features } from "../Config/Schema.js";
class Feature {
	constructor() {
		this.isInit = false;
		this.__dirname = dirname(fileURLToPath(import.meta.url));
		this.folder = `${this.__dirname}/Features`;
		this.plugins = {};
	}

	read() {
		return readdirSync(this.folder);
	}

	watch() {
		watch(this.folder, (eventType, filename) => {
			if (eventType === "change") {
				Print.info(`File ${filename} has changed. Re-importing...`);
				this.import(filename);
			} else if (eventType === "rename" && !filename) {
				Print.info(`File ${filename} has been removed. Deleting...`);
				delete this.plugins[filename];
			}
		});
	}

	async parser(module, file) {
		const keys = Object.keys(Features);
		for (const key of keys) {
			if (!(key in module)) {
				Print.warn(`Feature ${file} is missing the ${key}`);
			}
		}
		const feature = module.execute.toString("utf-8");
		const newExecute = `${feature.slice(0, feature.length - 1)}try { this.callback() } catch { };}`;

		const moduleStr = readFileSync(file, "utf-8").replace(feature, newExecute);
		const newModule = (
			await importFromString(moduleStr, {
				dirname: this.folder,
			})
		).default;
		return newModule;
	}

	async import(file) {
		const isWindows = process.platform === "win32";
		const timestamp = Date.now();
		const filePath = join(isWindows ? `file:///${this.folder}` : this.folder, file);

		if (this.plugins[file]) {
			Print.info(`Re-importing ${file}`);
			delete this.plugins[file];
		}

		try {
			const importedModule = (await import(`${filePath}?t=${timestamp}`)).default;
			this.plugins[file] = await this.parser(importedModule, join(this.folder, file));
			this.plugins[file].filePath = join(this.folder, file);
		} catch (error) {
			Print.error(`Failed to import ${file}`);
			console.error(error);
		}
	}

	async init() {
		if (this.isInit) {
			return;
		}
		const files = this.read();

		for (const file of files) {
			if (file.endsWith(".js")) {
				await this.import(file);
			}
		}

		this.watch();
		this.isInit = true;
		Print.success(Object.keys(this.plugins));
	}
}

export default new Feature();
