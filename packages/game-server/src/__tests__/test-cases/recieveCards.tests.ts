import { MESSAGES, SuccessResponse } from "@rcg/common";
import { MockPlayer } from "../helpers/mock-player";
import {
  signInWithoutDataListener,
  signInWithDataListener
} from "../helpers/game";
import { sleep } from "../../utils/misc";

export const recieveCardsTests = async () => {
  let mockPlayersIns: MockPlayer[];
  let gotRecieveCardResponse: boolean;
  let gotNotifyTurnResponse: boolean;

  beforeAll(async () => {
    mockPlayersIns = await signInWithoutDataListener(6);
  });

  afterAll(() => {
    mockPlayersIns.forEach(player => {
      player.closeSocketConnection();
    });
  });

  const onDataSocketListener = (response: SuccessResponse) => {
    if (response.payload.action === MESSAGES.cards) {
      gotRecieveCardResponse = true;
    }

    if (response.payload.action === MESSAGES.turnInfo) {
      gotNotifyTurnResponse = true;
    }
  };

  test(
    "Create a game and check whether all players recieved cards or not",
    async () => {
      mockPlayersIns = await signInWithDataListener(6, onDataSocketListener);

      // Needs to sleep here for some millisecond to capture the recieveCard
      // response properly.
      await sleep(50);

      expect(gotRecieveCardResponse).toBe(true);
      expect(gotNotifyTurnResponse).toBe(true);
    },
    10000
  );
};
