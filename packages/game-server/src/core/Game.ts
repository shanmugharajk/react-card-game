import { ICardGame } from "./models/ICardGame";
import { isCardAvail } from "../utils/misc";
import { IPlayer } from "./models/IPlayer";
import { Deck } from "../utils/deck";
import { MAX_PLAYERS } from "../constants/misc";
import { InMemoryStore } from "../persistence/InMemoryStore";

/**
 * The class which helps to handle each game session.
 */
export class Game {
  gameObj: ICardGame;
  roundOver: boolean;
  sameSuitDropped: boolean;

  /**
   * Initializes a new instance of the class GameApi.
   * @param gameObj The game object.
   * @param currentGameId The game id.
   * @param currentPlayerPlayed The current player played in realtime.
   */
  constructor(
    private inMemoryStore: InMemoryStore,
    private currentGameId: string,
    private droppedCard: string,
    private currentPlayerToken: string
  ) {
    this.initialize();
  }

  /**
   * Sets the dropped cards.
   */
  public set droppedCards(cards: Array<string>) {
    this.gameObj.droppedCards = cards;
  }

  /**
   * Sets the current turn.
   */
  public set currentTurn(turn: number) {
    this.gameObj.currentTurn = turn;
  }

  /**
   * Gets the current turn.
   */
  public get currentTurn(): number {
    return this.gameObj.currentTurn;
  }

  /**
   * Sets the dropped cards.
   */
  public get droppedCards() {
    return this.gameObj.droppedCards;
  }

  /**
   * Gets the current dropper card
   */
  public get currentDroppedCard(): string {
    return this.droppedCard;
  }

  /**
   * Gets the current gameId.
   */
  public get gameId(): string {
    return this.currentGameId;
  }

  /**
   * Identifies whether player actually has the card he dropped.
   */
  public get isCardAvailable(): string {
    return (this.gameObj[this.currentPlayerToken] as any).includes(
      this.droppedCard
    );
  }

  /**
   * Identifies whether the user dropped the same suit or not.
   */
  public get isValidCard(): boolean {
    return this.lastDroppedCard[0] === this.droppedCard[0];
  }

  /**
   * Identifies whether the user is cheating or not.
   */
  public get isCheating(): boolean {
    const cards = this.gameObj[this.currentPlayer.token];
    // Checking whether he has the same suit card which is been dropped earlier.
    const doesHeHasTheCorrectCard = isCardAvail(this.lastDroppedCard, cards);

    if (this.isSameSuitDropped) {
      return false;
    }

    if (!doesHeHasTheCorrectCard && !this.isSameSuitDropped) {
      return false;
    }

    return true;
  }

  /**
   * Gets the last dropped card.
   */
  public get lastDroppedCard(): string {
    const lastIndex = this.gameObj.droppedCards.length - 1;
    return this.gameObj.droppedCards[lastIndex];
  }

  /**
   * Gets the current player.
   */
  public get currentPlayer(): IPlayer {
    return this.gameObj.players[this.gameObj.currentTurn];
  }

  /**
   * Identifies the player who played is the right player in the current turn.
   */
  public get isHisTurn(): boolean {
    return this.currentPlayer.token === this.currentPlayerToken;
  }

  /**
   * Identifies that the dropped card is the last card for the current player.
   */
  public get isLastCard(): boolean {
    return this.gameObj[this.currentPlayerToken].length === 1;
  }

  /**
   * Identifies that the current turn is the first turn of the round.
   */
  public get isCurrentTurnIsFirstTurn(): boolean {
    return this.gameObj.droppedCards.length === 0;
  }

  /**
   * Identifies whether the current dropped suit is same or different from the previous suit.
   */
  public get isSameSuitDropped(): boolean {
    return this.sameSuitDropped;
  }

  /**
   * Identifies whether the round is over.
   */
  public get isRoundOver(): boolean {
    return this.roundOver;
  }

  /**
   * Gets the index of the player token who dropped the highest number card in the current round.
   */
  public get playerIndexWhoDroppedHighNumberCard(): number {
    let cardsToSort = [...this.gameObj.droppedCards];
    cardsToSort = cardsToSort.slice(0, -1);

    const sorted = Deck.sortCards(cardsToSort);
    const key = sorted[sorted.length - 1];
    const token = this.gameObj.dropDetails[key];
    return this.gameObj.players.findIndex(x => x.token === token);
  }

  /**
   * Gets the player token who dropped the highest number card in the current round.
   */
  public get playerDroppedHighNumberCard(): IPlayer {
    return this.gameObj.players[this.playerIndexWhoDroppedHighNumberCard];
  }

  /**
   * Updated the penality and returns true if it updates or false.
   */
  public updatePenality(): IPlayer | undefined {
    if (this.isSameSuitDropped) {
      return;
    }

    const player = this.playerDroppedHighNumberCard;

    this.gameObj[player.token] = this.gameObj[player.token].concat(
      this.droppedCards
    );

    return player;
  }

  /**
   * Incerements the current turn by 1.
   */
  public incrementTurn() {
    const updatedTurn = this.gameObj.currentTurn + 1;

    if (updatedTurn === MAX_PLAYERS) {
      this.gameObj.currentTurn = 0;
      this.roundOver = true;
    } else {
      this.gameObj.currentTurn = updatedTurn;
      this.roundOver = false;
    }
  }

  /**
   * Updates the strike by updating the turn, adding the drop details.
   */
  public updateStrike() {
    this.saveDropDetails();

    if (this.isSameSuitDropped) {
      this.incrementTurn();
    } else {
      this.currentTurn = this.playerIndexWhoDroppedHighNumberCard;
      this.roundOver = true;
    }
  }

  /**
   * Saves the game details to the redis store.
   */
  public saveGame() {
    this.inMemoryStore.saveGame(this.gameId, this.gameObj);
  }

  /**
   * Initializes the game object.
   */
  private initialize() {
    this.gameObj = this.inMemoryStore.fetchGame(this.gameId);
    this.roundOver = false;

    if (this.droppedCards.length === 0) {
      this.sameSuitDropped = true;
    } else {
      this.sameSuitDropped = this.droppedCard[0] === this.lastDroppedCard[0];
    }
  }

  /**
   * Saves the current dropped to the game object.
   */
  private saveDropDetails() {
    this.gameObj.dropDetails[this.droppedCard] = this.currentPlayerToken;
    this.gameObj.droppedCards.push(this.droppedCard);

    this.gameObj[this.currentPlayerToken] = this.gameObj[
      this.currentPlayerToken
    ].filter(x => x !== this.droppedCard);
  }
}
