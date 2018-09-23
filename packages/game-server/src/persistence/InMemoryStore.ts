import { ICardGame } from "../core/models/ICardGame";

/**
 * Class helps to store the game session in memory.
 */
export class InMemoryStore {
  /**
   * The instance of the class InMemoryStore.
   */
  private static ins: InMemoryStore = new InMemoryStore();

  /**
   * The store object in which tje whole game data will be stored.
   */
  private store: { ["gameId"]: ICardGame };

  /**
   * Initializes a new instance of the class InMemoryStore.
   */
  constructor() {
    InMemoryStore.ins = this;
    (this.store as any) = {};
  }

  /**
   * Gets the static singleton instance of the store.
   */
  public static get instance(): InMemoryStore {
    return InMemoryStore.ins;
  }

  /**
   * Saves the game to the memory.
   * @param gameId The game id.
   * @param game The game data.
   */
  public saveGame(gameId: string, game: ICardGame) {
    this.store[gameId] = game;
  }

  /**
   * Fetches the game by game id.
   * @param gameId The game id.
   */
  public fetchGame(gameId: string): ICardGame {
    return this.store[gameId];
  }

  /**
   * Deletes the game from the store.
   * @param gameId The game id.
   */
  public deleteGame(gameId: string) {
    delete this.store[gameId];
  }

  /**
   * Gets the number if games sessions stored in the store.
   */
  public get count(): number {
    return Object.keys(this.store).length;
  }
}
