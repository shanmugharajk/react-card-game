import { KEYS } from "../constants/misc";

/**
 * Utility class helps to form the key.
 */
export class Keys {
  /**
   * Get sthe game key.
   * @param gameId The game id.
   */
  public static getGamekey(gameId: string) {
    return `${gameId}:${KEYS.game}`;
  }

  /**
   * Get the logged in key.
   * @param userId The user id.
   */
  public static getLoggedInKey(userId: string) {
    return `${userId}:${KEYS.loggedIn}`;
  }
}
