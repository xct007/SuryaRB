// File://home/rose/BOT/SuryaRB/Utils/ApiRequest.js
import axios from "axios";
import { Config } from "../config.js";

const instance = axios.create({
	baseURL: "https://api.itsrose.life",
	headers: {
		Authorization: "Bearer " + Config.itsrose_apikey,
	},
});
// ignore http errors
instance.defaults.validateStatus = () => true;

export const ApiRequest = {
	async get(path, params) {
		return instance.get(path, { params });
	},
	async post(path, data) {
		return instance.post(path, data);
	},
};
