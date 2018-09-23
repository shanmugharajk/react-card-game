import { signInWithoutDataListener } from "../helpers/game";
import { MockPlayer } from "../helpers/mock-player";

export const sessionsTest = async () => {
  test(
    "Login 13 players to check the game session has created properly or not",
    async () => {
      const mockPlayersIns: MockPlayer[] = await signInWithoutDataListener(13);

      const gameIds = {};
      mockPlayersIns.forEach(mockPlayerIns => {
        gameIds[mockPlayerIns.player.gameId] = "";
      });

      const length = Object.keys(gameIds).length;

      expect(length).toBe(3);
    },
    10000
  );
};
