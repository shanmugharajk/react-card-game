import { MockPlayer } from "./mock-player";
import { SuccessResponse } from "@rcg/common";

/**
 * Creates the players instance.
 * @param numberOfPlayers The numbers of players.
 * @param onDataSocketListener The data listener callback
 */
export function createPlayers(
  numberOfPlayers,
  onDataSocketListener: (data: SuccessResponse, cb: any) => any = () => {}
): MockPlayer[] {
  let players: MockPlayer[] = [];

  for (let idx = 1; idx <= numberOfPlayers; idx++) {
    players.push(new MockPlayer(`player_${idx}`, onDataSocketListener));
  }

  return players;
}

/**
 * Creates and sends the sign request for the given number of players
 * @param playersCount The no of players needs to signin.
 */
export async function signInWithoutDataListener(
  playersCount: number = 6
): Promise<MockPlayer[]> {
  const players = createPlayers(playersCount);

  let resultPromises = [];

  for (let idx = 0; idx < players.length; idx++) {
    resultPromises.push(players[idx].login());
  }

  await Promise.all(resultPromises);

  for (let idx = 0; idx < players.length; idx++) {
    players[idx].closeSocketConnection();
  }

  return players;
}

/**
 * Creates and sends the sign request for the given number of players
 * @param playersCount The players count.
 * @param onDataSocketListener The callback needs to called on the "data" listener events.
 */
export async function signInWithDataListener(
  playersCount: number = 6,
  onDataSocketListener: (data: SuccessResponse, cb: any) => any
): Promise<MockPlayer[]> {
  const players = createPlayers(playersCount, onDataSocketListener);

  let resultPromises = [];

  for (let idx = 0; idx < players.length; idx++) {
    resultPromises.push(players[idx].login());
  }

  await Promise.all(resultPromises);

  return players;
}
