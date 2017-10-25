import * as Promise from "bluebird";
import { Messages } from "./constants";
import * as handlers from "./handlers";
import { IGameTimer, ILoginReply } from "./interfaces";
import { log, isNullOrUndef } from "./utils";

export default class HandlerFactory {
	constructor(private _socket: any) {}

	public Process(socket: any) {
		socket.on("data", (data, cb) => {
			switch (data.operation) {
				case Messages[Messages.login]:
					this.onLogin(data, socket, cb, false);
					break;

				case Messages[Messages.logout]:
					this.onLogout(data, cb);
					break;

				case Messages[Messages.playAgain]:
					this.onLogin(data, socket, cb, true);
					break;

				case Messages[Messages.register]:
					this.onRegister(data, socket, cb);
					break;

				default:
					// code...
					break;
			}
		});

		socket.on("error", err => handlers.errorHandler(err, socket));

		socket.on("disconnect", () =>
			handlers.onDisconnectHandler(this._socket, socket.id, socket.userInfo)
		);
	}

	private onLogout(data: any, cb: Function) {
		if (isNullOrUndef(data.payload.user) === true) {
			cb();
			return;
		}

		const promise = handlers
			.logout(this._socket, data.payload.user)
			.then(cb())
			.catch(e => cb());
	}

	private onLogin(
		data: any,
		socket: any,
		cb: Function,
		isRefresh: boolean = false
	): Promise {
		data.payload["socketId"] = socket.id;

		handlers
			.loginHandler(data.payload, isRefresh)
			.then(data => {
				if (data.shouldGameStart) {
					handlers.onGameStartHandler(this._socket, data);
				}

				const newData = {};

				for (let key in data) {
					if (key !== "shouldGameStart") {
						newData[key] = data[key];
					}
				}

				socket.userInfo = newData;

				cb(null, newData);
			})
			.catch(e => cb(e.message, null));
	}

	private onRegister(data: any, socket: any, cb: Function) {
		if (
			isNullOrUndef(data.payload) === true ||
			isNullOrUndef(data.payload.username) === true ||
			isNullOrUndef(data.payload.password) === true
		) {
			cb("Enter username, password.", 0);
			return;
		}

		if (
			data.payload.username.length < 5 ||
			data.payload.username.password < 5
		) {
			cb("Username, password should be minimum 5 characters in length", 0);
			return;
		}

		handlers
			.register(data.payload)
			.then(flag => {
				if (flag === true) {
					cb(null, 1);
				} else {
					cb(null, 0);
				}
			})
			.catch(e => cb(e.message || "Error in registration.", 0));
	}
}
