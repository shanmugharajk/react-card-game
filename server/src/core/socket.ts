import * as io from "socket.io";
import HandlerFactory from "../handlerFactory";
import { log } from "../utils";

const redis = require("socket.io-redis");

export default class SocketConn {
	private _io: any;
	private _handlerFactory: HandlerFactory;

	constructor(httpServer) {
		this._io = io(httpServer);

		this._io.adapter(redis({ host: "localhost", port: 6379 }));

		this._handlerFactory = new HandlerFactory(this);
	}

	public listen() {
		this._io.on("connection", (socket: any) => {
			log(
				"Server:socket.connection() ",
				`Socket => [${socket.id}] got connected at ${new Date().toLocaleTimeString()}`
			);

			this._handlerFactory.Process(socket);
		});
	}

	public get connected(): any {
		return this._io.sockets.connected;
	}

	public getByRoomId(roomid: any): any {
		return this._io.in(roomid);
	}
}
