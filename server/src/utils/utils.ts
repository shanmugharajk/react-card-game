import log from "./log";

export default class Utils {
	public static getUniqueId(): string {
		const uuidv1 = require("uuid/v1");
		return uuidv1();
	}

	public static getCookieValue(key: string, cookie: string) {
		if (!key) {
			return null;
		}
		return (
			decodeURIComponent(
				cookie.replace(
					new RegExp(
						"(?:(?:^|.*;)\\s*" +
							encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") +
							"\\s*\\=\\s*([^;]*).*$)|^.*$"
					),
					"$1"
				)
			) || null
		);
	}

	public static promiseChainErrorHandler(e: any) {
		if (e["ReplyError"]) {
			return Promise.reject(`Got an error in redis, operation ${e.command}`);
		} else if (e["customError"]) {
			return Promise.reject(e.customError);
		} else {
			const err = e as Error;
			log(
				"promiseChainErrorHandler",
				`${err.message}\n${err.name}\n${err.stack}`,
				true
			);
			return Promise.reject("Unknown error");
		}
	}

	public static objToArray(obj: any) {
		const data = [];
		for (let k in obj) {
			if (k === "password") {
				continue;
			}
			data.push(k);
			data.push(obj[k]);
		}
		return data;
	}

	public static getValues(obj: any) {
		const val = [];
		for (let k in obj) {
			val.push(obj[k]);
		}
		return val;
	}

	public static getMatchingKeyByValue(obj: any, value: any) {
		for (let k in obj) {
			if (obj[k] === value) {
				return k;
			}
		}
	}

	public static isCardAvail(cardId: string, cardArr: Array<string>) {
		for (let idx in cardArr) {
			if (cardId[0] === cardArr[idx][0]) {
				return true;
			}
		}
		return false;
	}
}

export function isNull(argument) {
	if (argument === null) {
		return true;
	}
	return false;
}

export function isUndef(argument) {
	if (argument === undefined) {
		return true;
	}
	return false;
}

export function isNullOrUndef(argument) {
	if (argument === null || argument === undefined) {
		return true;
	}
	return false;
}
