import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { Mutex } from "async-mutex";
import { Config } from "../config.js";
import { UserSchema, GroupSchema, SettingsSchema } from "../Config/Schema.js";

class Helper {
	/**
	 * @param {string} n - The object name.
	 * @param {object} data - The data object.
	 * @param {object} schema - The schema object.
	 */
	constructor(n, data, schema) {
		this.name = n;
		this[n] = data ?? {};
		this.schema = schema;
	}
	/**
	 * Retrieves the value associated with the specified key from the database.
	 * If the key doesn't exist, it creates a new object for the key from the schema.
	 * @param {string} key - The key to retrieve the value for.
	 * @returns {UserSchema | GroupSchema | null} The value associated with the key.
	 */
	get(key) {
		return this[this.name][key] ?? null;
	}

	/**
	 * Sets the value for the specified key in the database.
	 * If the key already exists, it returns the existing value.
	 * @param {string} key - The key to set the value for.
	 * @returns {UserSchema | GroupSchema} The value associated with the key.
	 */
	set(key) {
		if (this[this.name][key]) {
			return this[this.name][key];
		}
		this[this.name][key] = {};
		for (const k in this.schema) {
			this[this.name][key][k] =
				typeof this.schema[k] === "function" ? this.schema[k]() : this.schema[k];
		}
		return this[this.name][key];
	}

	/**
	 * Checks if the specified key exists in the database.
	 * @param {string} key - The key to check.
	 * @returns {boolean} True if the key exists, false otherwise.
	 */
	isExist(key) {
		return this[this.name][key] ? true : false;
	}

	/**
	 * Deletes the specified key and its associated value from the database.
	 * @param {string} key - The key to delete.
	 * @returns {void}
	 */
	delete(key) {
		delete this[this.name][key];
	}

	/**
	 * Retrieves all the data stored in the database.
	 * @returns {{[key: string]: UserSchema | GroupSchema}} All the data stored in the database.
	 */
	all() {
		return this[this.name];
	}

	/**
	 * Clears all the data stored in the database.
	 * @returns {void}
	 */
	clear() {
		this[this.name] = {};
	}
}

/**
 * @class
 * Database class
 * @classdesc Represents a database for storing data.
 */
class Database {
	/**
	 * @private
	 * @type {string}
	 */
	#path = Config?.database?.path ?? "./database.json";

	/**
	 * @private
	 * @type {Object}
	 */
	#data = {
		users: {},
		groups: {},
		settings: {},
	};

	/**
	 * @private
	 * @type {Mutex}
	 */
	#mutex = new Mutex();

	/**
	 * Creates an instance of the Database class.
	 * @constructor
	 * @returns {Database} An instance of the Database class.
	 */
	constructor() {
		this.initialize();
		setInterval(() => {
			this.#write();
			!Config?.database?.debug || console.log("Database saved");
		}, Config?.database?.save_interval ?? 10_000);
	}

	/**
	 * Initializes the database by creating an empty JSON file if it doesn't exist or if the existing file is not valid JSON.
	 * @private
	 * @returns {void}
	 */
	initialize() {
		if (!existsSync(this.#path) || !this.isValidJsonFile()) {
			this.createEmptyJsonFile();
		}
		this.#data = JSON.parse(readFileSync(this.#path, "utf-8"));
		this.#data.users = this.#data.users ?? {};
		this.#data.groups = this.#data.groups ?? {};
		this.#data.settings = this.#data.settings ?? {};
		this.users = new Helper("users", this.#data.users, UserSchema);
		this.groups = new Helper("group", this.#data.groups, GroupSchema);
		this.settings = new Helper("settings", this.#data.settings, SettingsSchema);
	}

	/**
	 * Checks if the JSON file is valid.
	 * @returns {boolean} True if the JSON file is valid, false otherwise.
	 */
	isValidJsonFile() {
		const content = readFileSync(this.#path, "utf-8");
		try {
			JSON.parse(content);
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Creates an empty JSON file.
	 * @private
	 * @returns {void}
	 */
	createEmptyJsonFile() {
		writeFileSync(this.#path, JSON.stringify({}));
	}

	/**
	 * Writes the database data to the JSON file.
	 * @private
	 * @returns {void}
	 */
	#write() {
		this.#mutex.runExclusive(() => {
			writeFileSync(this.#path, JSON.stringify(this.#data, null, 2));
		});
	}
}

const db = new Database();
export default db;
