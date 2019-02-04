
import {
	Alert,
	AsyncStorage
} from "react-native";
import * as _ from "lodash";
import Storage from "react-native-storage";

const baseUrl = "http://dev.mofunc.com/ws/";
// const baseUrl = "http://192.168.244.104:51202/";

const storage = new Storage({
	size: 1000,
	// Use AsyncStorage for RN apps, or window.localStorage for web apps.
	// If storageBackend is not set, data will be lost after reload.
	storageBackend: AsyncStorage, // for web: window.localStorage
	// expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: null,
	// cache data in the memory. default is true.
	enableCache: false,
	// if data was not found in storage or expired data was found,
	// the corresponding sync method will be invoked returning
	// the latest data.
	sync: {
		accessToken: () => "",
		login: () => "",
	}
});
global.storage = storage;

async function errorHandle(response) {
	if (response.status < 300) {
		return;
	}
	const result = response.text();
	let msg = result._55 || result;
	if (typeof msg === "object") {
		msg = _.get(msg, "message") || msg;
	}
	if (typeof msg === "object") {
		msg = JSON.stringify(msg);
	} else {
		const match = msg.match(/\{(.*)+\}/);
		if (match) {
			msg = _.get(JSON.parse(match[0]), "message") || msg;
		}
	}

	if (response.status === 401) {
		msg = "未登录";
	}
	Alert.alert(
		"提示",
		msg,
		[
			{ text: "确定" },
		],
	);
	if (response.status === 401) {
		await storage.remove({ key: "accessToken" });
		throw 401;
	}
}

const headers = {
	"x-requested-with": "XMLHttpRequest",
	"x-client": "android/book",
};
async function initToken() {
	const accessToken = await storage.load({ key: "accessToken" });
	if (accessToken) {
		headers["x-access-token"] = accessToken;
	} else {
		headers["x-access-token"] = undefined;
	}
}
export async function get(url:string, params:any = {}) {
	let fullUrl = `${baseUrl}${url}`;
	await initToken();
	if (params) {
		const paramsArray = Object.keys(params).map(key => `${key}=${params[key]}`);
		if (/\?/.test(url)) {
			fullUrl += `&${paramsArray.join("&")}`;
		} else {
			fullUrl += `?${paramsArray.join("&")}`;
		}
	}
	return fetch(fullUrl, {
		method: "GET",
		headers
	}).then(async (response) => {
		await errorHandle(response);
		return response.json();
	});
}


export async function query(url:string, params:any = {}) {
	let fullUrl = `${baseUrl}${url}`;
	await initToken();
	if (params) {
		const paramsArray = Object.keys(params).map(key => `${key}=${params[key]}`);
		if (/\?/.test(url)) {
			fullUrl += `&${paramsArray.join("&")}`;
		} else {
			fullUrl += `?${paramsArray.join("&")}`;
		}
	}
	return fetch(fullUrl, {
		method: "GET",
		headers,
		mode: "same-origin",
	})
		.then(async (response) => {
			await errorHandle(response);
			return { headers: response.headers, data: response.json() };
		});
}


export async function post(url:string, params:any = {}) {
	const fullUrl = `${baseUrl}${url}`;
	await initToken();
	return fetch(fullUrl, {
		method: "POST",
		headers,
		mode: "same-origin",
		body: JSON.stringify(params)
	})
		.then(async (response) => {
			await errorHandle(response);
			if (response.status === 204) {
				return;
			}
			return response.json();
		});
}


export async function del(url:string, params:any = {}) {
	const fullUrl = `${baseUrl}${url}`;
	await initToken();
	return fetch(fullUrl, {
		method: "DELETE",
		headers,
		body: JSON.stringify(params)
	})
		.then(async (response) => {
			await errorHandle(response);
			if (response.status === 204) {
				return;
			}
			return response.json();
		});
}

export const getBooks = async (params:any = {}) => get("books", params);
export const queryBooks = async (params:any = {}) => query("books", params);
export const getBook = async (bid:string, params:any = {}) => get(`books/${bid}`, params);
export const querySections = async (bid:string, params:any = {}) => query(`books/${bid}/sections`, params);
export const getContents = async (sid:string, params:any = {}) => get(`books/sections/${sid}/contents`, params);
export const signin = async (params:any = {}) => post("dis/access-tokens", params);
export const signup = async (params:any = {}) => post("dis/me", params);
export const getBookshelf = async (params:any = {}) => get("dis/me/bookshelf", params);
export const delBookshelf = async (bid:number, params:any = {}) => del(`dis/me/bookshelf/books/${bid}`, params);
export const addToBookshelf = async (bid:string, params:any = {}) => post(`books/${bid}/mark`, params);
export const footsteps = async (type:string, params:any = {}) => post(`dis/footsteps/${type}`, params);
export const getFootsteps = async (type:string, params:any = {}) => get(`dis/me/footsteps/${type}`, params);
export const bookmark = async (bid:string, sid :string, params:any = {}) => post(`books/${bid}/sections/${sid}/mark`, params);
