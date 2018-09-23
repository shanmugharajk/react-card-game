/**
 * Model for all game action response.
 */
export interface GameActionResponse {
  action: string;
  data: object;
}

/**
 * Card response model.
 */
export interface ICards {
  cards: string[];
}

/**
 * Turn response model.
 */
export interface INotifyTurn {
  currentPlayerId: string;
}

/**
 * Dropped response model.
 */
export interface IDroppedCards {
  cards: string[];
}

/**
 * Game over response model.
 */
export interface IGameOver {
  winnerId: string;
}

/**
 * Abort game model.
 */
export interface IGameAborted {
  reason: string;
}

/**
 * Penality cards response model.
 */
export interface IPenality extends ICards {}

/**
 * Players response model.
 */
export interface IPlayers {
  players: string[];
}
