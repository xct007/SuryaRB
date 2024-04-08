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

/**
 * @param {string} path - The path
 * @param {{[key: string]: any}} params - The parameters
 * @param {import("axios").AxiosRequestConfig<any>} options - The options
 * @returns {Promise<import("axios").AxiosResponse<any>>} The response
 */
export async function get(path, params, options) {
	return instance.get(path, { params, ...options }).catch((e) => e?.response);
}

/**
 * @function post
 * @param {string} path - The path
 * @param {any} data - The data
 * @param {import("axios").AxiosRequestConfig<any>} options - The options
 * @returns {Promise<import("axios").AxiosResponse<any>>} The response
 */
export async function post(path, data, options) {
	return instance.post(path, data, options).catch((e) => e?.response);
}

/**
 * @function request
 * @param {import("axios").AxiosRequestConfig<any>} options - The options
 * @returns {Promise<import("axios").AxiosResponse<any>>} The response
 */
export async function request(...options) {
	return instance
		.request({
			...options,
		})
		.catch((e) => e?.response);
}
export const ApiRequest = {
	get,
	post,
	request,
};
