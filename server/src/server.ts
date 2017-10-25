import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import HandlerFactory from "./handlerFactory";
import { SocketConn } from "./core";
import { log } from "./utils";

export class Server {
	private _app: any;
	private _server: any;
	private _port: number;
	private _handlerFactory: HandlerFactory;
	private _socket: SocketConn;

	public static start(): Server {
		return new Server();
	}

	constructor() {
		this.createApp();
		this.config();
		this.createServer();
		this.sockets();
		this.listen();
	}

	public get App(): Server {
		return this._app;
	}

	private createApp(): void {
		this._app = express();
	}

	private createServer(): void {
		this._server = http.createServer(this._app);
	}

	private config(): void {
		this._port = 4500;
	}

	private sockets(): void {
		this._socket = new SocketConn(this._server);
	}

	private listen(): void {
		this._server.listen(this._port, () => {
			log(
				"Server.socket.listen() ",
				`Socket server on port\x1b[32m ${this._port}`
			);
		});

		this._socket.listen();
	}
}
