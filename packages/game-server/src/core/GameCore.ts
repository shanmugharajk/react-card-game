import {
  RESPONSE_CODES,
  GameActionResponse,
  DropCardRequestPayload
} from "@rcg/common";

import { IPlayer } from "../core/models/IPlayer";
import { successResponse, errorResponse } from "../utils/responses";
import { Payloads } from "../core/payloads";
import { Deck } from "../utils/deck";
import { MAX_PLAYERS } from "../constants/misc";
import { ICardGame as GameModel } from "../core/models/ICardGame";
import { getUniqueId, delayed, sleep } from "../utils/misc";
import { Game } from "../core/Game";
import { InMemoryStore } from "../persistence/InMemoryStore";

/**
 * Game :- A main class that manages all the game actions/logics.
 */
export class GameCore {
  playersPool: IPlayer[] = [];
  currentGameId = getUniqueId();
  deck: Deck;
  inMemoryStore: InMemoryStore = InMemoryStore.instance;
  reachedMaxLoad = false;

  /**
   * Initializes a new instance of the class Game.
   * @param ioServer The ioServer instance.
   * @param socket The socket instance.
   * @param gameId The game id.
   */
  constructor(private ioServer: SocketIO.Server) {
    this.deck = new Deck();
  }

  /**
   * Adds the player to the game pool.
   * @param socket The socket instance
   * @param playerId The player id
   * @param cb The callback after the action is done.
   *
   * Note: Here we need to get the socket instance everytime and can't be stored as intance
   * variable because we are adding the socket to room (game id).
   */
  public addPlayerToGamePool(
    socket: SocketIO.Socket,
    playerId: string,
    cb: Function
  ) {
    try {
      this.checkValidityAndThrowIfInValid(playerId, socket.id);

      const player: IPlayer = {
        socketId: socket.id,
        playerId,
        token: getUniqueId(),
        gameId: this.currentGameId
      };

      this.playersPool.push(player);

      socket.join(this.currentGameId);

      (socket as any).gameInfo = player;

      cb(null, successResponse(RESPONSE_CODES.loginSuccess, player));

      if (this.playersPool.length === MAX_PLAYERS) {
        const starvingPlayers = this.playersPool.splice(0, MAX_PLAYERS);
        const starvingGamePoolId = this.currentGameId;

        this.playersPool = [];
        this.currentGameId = getUniqueId();

        this.startGame(starvingGamePoolId, [...starvingPlayers]);
      }
    } catch (error) {
      cb(null, errorResponse(RESPONSE_CODES.loginFailed, error.message));
    }
  }

  /**
   * Starts the game.
   * @param gameId The game id.
   */
  public startGame(gameId: string, players: IPlayer[]) {
    const gameObject = this.createGameObject(players);

    this.inMemoryStore.saveGame(gameId, gameObject);

    gameObject.players.forEach(player => {
      this.sendCards(player.socketId, gameObject[player.token]);
    });

    this.sendPlayersInfo(gameId, players.map(x => x.playerId));

    this.notifyTurn(gameId);
  }

  /**
   * The event handles on the card drop of a player.
   * @param req The dropCardRequest.
   */
  public onDropCard(req: DropCardRequestPayload, cb: Function) {
    const { card, gameId, token } = req;

    if (!card) {
      cb(null, errorResponse(RESPONSE_CODES.failed, "Invalid card"));
      return;
    }

    const currentGameIns = new Game(this.inMemoryStore, gameId, card, token);

    // This is possible in only hacky way of sending rather than from the UI.
    // So softly deny it and don't operate on this.
    if (!currentGameIns.isHisTurn || !currentGameIns.isCardAvailable) {
      cb(null, errorResponse(RESPONSE_CODES.failed, "Invalid operation"));
      return;
    }

    if (currentGameIns.isCurrentTurnIsFirstTurn) {
      this.rotateStrike(currentGameIns, cb);
      return;
    }

    if (currentGameIns.isLastCard) {
      this.declareWinner(currentGameIns);
      return;
    }

    if (currentGameIns.isCheating) {
      cb(
        null,
        errorResponse(RESPONSE_CODES.failed, "Invalid card. Please try again")
      );
      return;
    }

    this.rotateStrike(currentGameIns, cb);
  }

  /**
   * Rotates the game.
   * @param currentGameIns The game instance.
   * @param cb The callback function
   */
  private rotateStrike(currentGameIns: Game, cb: Function) {
    this.sendCardDropAcceptedNotification(cb);

    currentGameIns.updateStrike();

    if (currentGameIns.updatePenality()) {
      this.sendPenality(currentGameIns.playerDroppedHighNumberCard, [
        ...currentGameIns.droppedCards
      ]);
    }

    if (currentGameIns.isRoundOver) {
      currentGameIns.droppedCards = [];
    }

    this.sendDroppedCardsInfo(
      currentGameIns.gameId,
      currentGameIns.droppedCards
    );

    currentGameIns.saveGame();
    this.notifyTurn(currentGameIns.gameId);
  }

  /**
   * Abort the game
   * @param gameId The game id.
   */
  public abortGame(gameId: string) {
    this.inMemoryStore.deleteGame(gameId);

    if (this.currentGameId === gameId) {
      this.playersPool = [];
    }

    const payload: GameActionResponse = Payloads.sendGameAborted(
      "The player(s) disconnected from the game pool. So we aborted the game. Please sign in again to play."
    );

    const response = successResponse(RESPONSE_CODES.gameNotification, payload);
    this.ioServer.to(gameId).emit("data", response);
  }

  /**
   * Sends the message to all players with winner id.
   * @param currentGameIns The game instance
   */
  private declareWinner(currentGameIns: Game) {
    const {
      currentPlayer: { playerId },
      gameId
    } = currentGameIns;

    const payload: GameActionResponse = Payloads.sendGameOver(playerId);
    const response = successResponse(RESPONSE_CODES.gameNotification, payload);

    this.ioServer.to(gameId).emit("data", response);
  }

  /**
   * Send penality to the player.
   * @param player The player whom needs to send panlity
   * @param cards The cards
   */
  private sendPenality(player: IPlayer, cards: Array<string>) {
    const payload: GameActionResponse = Payloads.sendPenality(cards);
    const response = successResponse(RESPONSE_CODES.gameNotification, payload);

    this.ioServer.sockets.connected[player.socketId].emit("data", response);
  }

  /**
   * Send the dropped accepted notification to the player.
   * @param cb The callback function.
   */
  private sendCardDropAcceptedNotification(cb: Function) {
    const payload: GameActionResponse = Payloads.sendCardDropAccepted();
    const response = successResponse(RESPONSE_CODES.success, payload);
    cb(null, successResponse(RESPONSE_CODES.success, response));
  }

  /**
   * Send the dropped card to all game players.
   * @param gameId The game id.
   * @param cards The cards dropped.
   */
  private sendDroppedCardsInfo(gameId: string, cards: string[]) {
    const payload: GameActionResponse = Payloads.sendDroppedCards(cards);
    const response = successResponse(RESPONSE_CODES.gameNotification, payload);
    this.ioServer.to(gameId).emit("data", response);
  }

  /**
   * Sends the player info.
   * @param gameId The game id.
   * @param players The players
   */
  private sendPlayersInfo(gameId: string, players: Array<string>) {
    const payload = Payloads.sendPlayersInfo(players);
    const recievePlayersInfo = successResponse(
      RESPONSE_CODES.gameNotification,
      payload
    );
    this.ioServer.to(gameId).emit("data", recievePlayersInfo);
  }

  /**
   * Sends the cards to the players in the game.
   * @param socketId The game id.
   * @param cards cards array to send
   */
  private sendCards(socketId: string, cards: string[]) {
    const payload = Payloads.sendCards(cards);
    const recieveCards = successResponse(
      RESPONSE_CODES.gameNotification,
      payload
    );
    this.ioServer.sockets.connected[socketId].emit("data", recieveCards);
  }

  /**
   * Starts the game and signals the first player and wait's for the reply and rotates the strike.
   * @param gameId The game id.
   */
  private notifyTurn(gameId: string) {
    const gameObj = this.inMemoryStore.fetchGame(gameId);

    const playerToPlay = gameObj.players[gameObj.currentTurn];

    const payload: GameActionResponse = Payloads.sendNotifyTurn(
      playerToPlay.playerId
    );

    const response = successResponse(RESPONSE_CODES.gameNotification, payload);

    this.ioServer.to(gameId).emit("data", response);
  }

  /**
   * Creates a game object.
   */
  private createGameObject(players: IPlayer[]): GameModel {
    const game = {};
    game["players"] = [];
    game["currentTurn"] = 0;
    game["maxTurn"] = MAX_PLAYERS - 1;
    game["droppedCards"] = [];
    game["dropDetails"] = {};

    const cards: string[][] = this.deck.getCardsForGame();

    for (let idx in players) {
      const player: IPlayer = players[idx];
      game["players"].push(player);
      game[player.token] = cards[idx];
    }
    return <GameModel>game;
  }

  /**
   * Check's the player id is valid or not.
   * @param playerId The player id
   * @param socketId The socket id
   */
  private checkValidityAndThrowIfInValid(playerId: string, socketId: string) {
    if (this.reachedMaxLoad) {
      throw new Error("Game server overloaded. Please try after sometime");
    }

    if (!playerId || playerId.length === 0) {
      throw new Error("User id can't be a blank");
    }

    const index = this.playersPool.filter(
      o => o.playerId === playerId || o.socketId === socketId
    ).length;

    if (index > 0) {
      throw new Error(
        "Please choose a different name. This name is already taken."
      );
    }

    if (playerId.length > 10) {
      throw new Error(
        "Please chooose an user id with length lessthan or equal to 10 characters."
      );
    }

    if (this.inMemoryStore.count === 100) {
      this.reachedMaxLoad = true;
    }
  }
}
