export const AUTH = "AUTH";
export const RECEIVE_CARDS = "RECEIVE_CARDS";
export const RECEIVE_DROPPED_CARDS = "RECEIVE_DROPPED_CARDS";
export const RECEIVE_BOARD_MESSAGE = "RECEIVE_BOARD_MESSAGE";
export const RECEIVE_PENALITY = "RECEIVE_PENALITY";
export const SHOULD_START = "SHOULD_START";
export const TURN = "TURN";
export const RESET_TURN = "RESET_TURN";
export const SHOW_TIMER = "SHOW_TIMER";
export const DROP_CARD = "DROP_CARD";
export const CLEAR_DROPPED_CARD = "CLEAR_DROPPED_CARD";
export const RECEIVE_DROP_ACK = "RECEIVE_DROP_ACK";
export const ROUND_CLOSE = "ROUND_CLOSE";
export const GAME_CLOSE = "GAME_CLOSE";
export const CLEAR_MESSAGES = "CLEAR_MESSAGES";
export const STRIKE_INFO = "STRIKE_INFO";
export const RECEIVE_PLAYERS = "RECEIVE_PLAYERS";
export const PLAY_AGAIN = "PLAY_AGAIN";
export const REGISTER = "REGISTER";

export function auth(authDetails) {
	return {
		type: AUTH,
		authDetails
	};
}

export function register(regDetails) {
	return {
		type: REGISTER,
		regDetails
	};
}

export function recievCards(cards) {
	return {
		type: RECEIVE_CARDS,
		cards
	};
}

export function recievePlayersInfo(players) {
	return {
		type: RECEIVE_PLAYERS,
		players
	};
}

export function startGame(shouldStartGame) {
	return {
		type: SHOULD_START,
		shouldStartGame
	};
}

export function playTurn(turn) {
	return { type: TURN, turn };
}

export function resetTurn() {
	return { type: RESET_TURN };
}

export function showTimer(timer) {
	return { type: SHOW_TIMER, timer };
}

export function dropCard(card) {
	return { type: DROP_CARD, card };
}

export function clearDroppedCard() {
	return { type: CLEAR_DROPPED_CARD };
}

export function recieveDroppedCard(cards) {
	return { type: RECEIVE_DROPPED_CARDS, cards };
}

export function recieveDropValidity(msg) {
	return { type: RECEIVE_DROP_ACK, msg };
}

export function recieveDropBoardMessage(msg) {
	return { type: RECEIVE_BOARD_MESSAGE, msg };
}

export function recievePenality(cards) {
	return { type: RECEIVE_PENALITY, cards };
}

export function recieveStrikeInfo(currentPlayer) {
	return { type: STRIKE_INFO, currentPlayer };
}

export function roundClose(msg) {
	return { type: ROUND_CLOSE, msg };
}

export function gameClose(msg) {
	return { type: GAME_CLOSE, msg };
}

export function clearMessages() {
	return { type: CLEAR_MESSAGES };
}

export function playGameAgain() {
	return { type: PLAY_AGAIN };
}
