import {
  RESPONSE_CODES,
  SuccessResponse,
  ErrorResponse,
  loginPayload
} from "@rcg/common";

import { Socket } from "../helpers/socket";

const ioClient = Socket.openClientConnection();

export const loginTests = async () => {
  const userShan = "shan";
  const userSfk = "sfk";

  afterAll(() => {
    ioClient.close();
  });

  test("Should login with user 'shan'", async () => {
    const response: SuccessResponse = await Socket.sendData(
      ioClient,
      loginPayload(userShan)
    );
    expect(response.code).toBe(RESPONSE_CODES.loginSuccess);
  });

  test("Should login with user 'sfk'", async () => {
    const response: SuccessResponse = await Socket.sendData(
      ioClient,
      loginPayload(userSfk)
    );
    expect(response.code).toBe(RESPONSE_CODES.loginSuccess);
  });

  test("Should throw error when give empty user", async () => {
    const response: ErrorResponse = await Socket.sendData(
      ioClient,
      loginPayload("")
    );
    expect(response.code).toBe(RESPONSE_CODES.loginFailed);
  });
};
