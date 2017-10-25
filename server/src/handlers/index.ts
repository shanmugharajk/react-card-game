import * as Promise from "bluebird";
import { store, SocketConn, game, Task } from "../core";

import { log, deck, isNullOrUndef } from "../utils";
import { IUser, ILoginReply } from "../interfaces";

export const errorHandler = (err, socket) => {
	log(
		"errorHandler",
		`Got an error in the socket {${socket.id}. The error is => \n`,
		err
	);
};

export const onDisconnectHandler = (
	socket: SocketConn,
	socketId: string,
	userInfo: any
) => {
	log(
		"onDisconnectHandler",
		`Socket => [${socketId}], got disconnected at ${new Date().toLocaleTimeString()}`
	);

	log("socket.userInfo", userInfo);

	if (isNullOrUndef(userInfo) === true) {
		return;
	}

	logout(socket, userInfo).then(() => {});
};

export const loginHandler = (
	data: IUser,
	isRefresh: boolean = false
): Promise => {
	return game.login(data, isRefresh);
};

export const register = (data: IUser): Promise => {
	return game.register(data);
};

export const onGameStartHandler = (socket: SocketConn, login: ILoginReply) => {
	const gameId = login.gameId;
	game.start(gameId, socket);
};

export const logout = (socket: SocketConn, userinfo: any): Promise => {
	return game.logout(userinfo, socket);
};
