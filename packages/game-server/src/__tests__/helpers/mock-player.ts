import { RESPONSE_CODES, SuccessResponse, loginPayload } from "@rcg/common";

import { Socket } from "./socket";
import { IPlayer } from "../../core/models/IPlayer";

export class MockPlayer {
  ioClient: SocketIOClient.Socket;
  player: IPlayer;

  constructor(
    private name: string,
    private onDataSocketListener: (
      data: SuccessResponse,
      cb: any
    ) => any = () => {}
  ) {
    this.ioClient = Socket.openClientConnection();
    this.ioClient.on("data", this.onDataSocketListener);
  }

  loginAsync = async () => {
    const response: SuccessResponse = await Socket.sendData(
      this.ioClient,
      loginPayload(this.name)
    );

    if (response.code !== RESPONSE_CODES.loginSuccess) {
      throw Error(`Player ${this.name} failed`);
    }

    this.player = response.payload;
  };

  // This is to simulate parallel request given to server and check whether the game pool
  // is working correct or not. Just give request and forget about the result.
  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      Socket.sendData(this.ioClient, loginPayload(this.name))
        .then((response: SuccessResponse) => {
          if (response.code !== RESPONSE_CODES.loginSuccess) {
            throw Error(`Player ${this.name} failed`);
          }
          this.player = response.payload;
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  closeSocketConnection() {
    this.ioClient.close();
  }
}
