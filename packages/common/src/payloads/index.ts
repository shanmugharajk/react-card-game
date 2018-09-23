import { MESSAGES } from "../messages";

export const loginPayload = (userId: string) => {
  return { operation: MESSAGES.login, payload: { userId } };
};

export const pingPayload = () => {
  return { operation: MESSAGES.ping, payload: { ping: "ping" } };
};

export const dropCardPayload = (
  card: string,
  gameId: string,
  token: string
) => {
  return { operation: MESSAGES.dropCard, payload: { card, gameId, token } };
};
