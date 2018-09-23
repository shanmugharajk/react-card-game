import * as common from "@rcg/common";

export class Payloads {
  /**
   * Forms the response that needs to be send for 'recieveCards' action.
   * @param cards The cards array needs to send
   */
  public static sendCards(cards: string[]): common.GameActionResponse {
    const data: common.ICards = {
      cards
    };
    return {
      action: common.MESSAGES.cards,
      data
    };
  }

  /**
   * Forms reponse to notify the turn.
   * @param currentPlayerId The current player id.
   */
  public static sendNotifyTurn(currentPlayerId): common.GameActionResponse {
    const data: common.INotifyTurn = {
      currentPlayerId
    };
    return {
      action: common.MESSAGES.turnInfo,
      data
    };
  }

  /**
   * Forms reponse to notify the turn.
   */
  public static sendCardDropAccepted(): common.GameActionResponse {
    return {
      action: common.MESSAGES.cardDropAccepted,
      data: {}
    };
  }

  /**
   * Forms reponse to notify the dropped card.
   * @param cards The card to send.
   */
  public static sendDroppedCards(cards: string[]): common.GameActionResponse {
    const data: common.IDroppedCards = {
      cards
    };
    return {
      action: common.MESSAGES.droppedCards,
      data
    };
  }

  /**
   * Forms reponse to notify the game has over.
   * @param winnerId The winner id.
   */
  public static sendGameOver(winnerId: string): common.GameActionResponse {
    const data: common.IGameOver = {
      winnerId
    };
    return {
      action: common.MESSAGES.gameOver,
      data
    };
  }

  /**
   * Forms reponse to notify the game is aborted.
   * @param reason The reason to abort the game.
   */
  public static sendGameAborted(reason: string): common.GameActionResponse {
    const data: common.IGameAborted = {
      reason
    };
    return {
      action: common.MESSAGES.gameAborted,
      data
    };
  }

  /**
   * Forms response to send the penality to the players.
   * @param cards The cards
   */
  public static sendPenality(cards: string[]): common.GameActionResponse {
    const data: common.IPenality = {
      cards
    };
    return {
      action: common.MESSAGES.penality,
      data
    };
  }

  /**
   * Forms reponse to notify the players information.
   * @param players The player id's
   */
  public static sendPlayersInfo(players: string[]): common.GameActionResponse {
    const data: common.IPlayers = {
      players
    };
    return {
      action: common.MESSAGES.playerInfo,
      data
    };
  }
}
