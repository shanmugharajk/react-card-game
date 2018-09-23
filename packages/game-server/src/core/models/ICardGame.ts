import { IPlayer } from "./IPlayer";
import { IDroppedDetails } from "./IDroppedDetails";

/**
 * The main Game model object.
 */
export interface ICardGame {
  players: [IPlayer];
  currentTurn: any;
  maxTurn: any;
  droppedCards: Array<string>;
  dropDetails: any | IDroppedDetails;

  // This is to store the card details by userId/token.
  [token: string]: Array<any>;
}
