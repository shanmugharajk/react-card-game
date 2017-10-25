import * as Promise from "bluebird";
import * as r from "redis";

import { RedisClient } from "redis";
import { Utils, log } from "../utils";

Promise.promisifyAll(r.RedisClient.prototype);
Promise.promisifyAll(r.Multi.prototype);

class Store {
	private _client: any;
	private _client2: RedisClient;

	constructor() {
		this._client = r.createClient();
	}

	public addJsonArrayValue(key: string, value: any): Promise {
		return this._client.saddAsync(key, JSON.stringify(value));
	}

	public addArrayValue(key: string, value: any): Promise {
		return this._client.saddAsync(key, value);
	}

	public addJsonValue(key: string, value: any): Promise {
		return this._client.setAsync(key, JSON.stringify(value));
	}

	public addValue(key: string, value: any): Promise {
		return this._client.setAsync(key, value);
	}

	public removeArrayValue(key: string, value: any) {
		return this._client.sremAsync(key, value);
	}

	public getValue(key: string): Promise {
		return this._client.getAsync(key);
	}

	public getArrayCount(key: string): Promise {
		return this._client.scardAsync(key);
	}

	public getJsonValue(key: string): Promise {
		return new Promise((resolve, reject) => {
			this._client
				.getAsync(key)
				.then(res => resolve(JSON.parse(res)))
				.catch(e => reject(e));
		});
	}

	public getJsonArrayValue(key: string): Promise {
		return new Promise((resolve, reject) => {
			this._client
				.smembersAsync(key)
				.then(res => {
					var data = [];

					for (let idx in res) {
						data.push(JSON.parse(res[idx]));
					}

					resolve(data);
				})
				.catch(e => reject(e));
		});
	}

	public getArrayValue(key: string): Promise {
		return this._client.smembersAsync(key);
	}

	public del(key: string): Promise {
		return this._client.delAsync(key);
	}

	public exists(key: string): Promise {
		return this._client.existsAsync(key);
	}
}

const store = new Store();
export default store;
