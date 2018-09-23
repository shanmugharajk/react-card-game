import { IGame } from "./models/IGameInfo";
import { IUser } from "./models/IUserInfo";

export interface IStore {
  game: IGame;

  user: IUser;

  signIn(userId: string): Promise<any>;

  dropCard(card: string): Promise<any>;

  ping(): Promise<void>;

  leaveGame(): void;

  clearNotifications(): void;
}
