import { combineReducers } from "redux";
import update from "immutability-helper";
import * as actions from "../actions";
import { isNullOrUndef } from "../utils";
import { PLAYER_TIMEOUT } from "../services/socket";

const auth = (state = {}, action) => {
	switch (action.type) {
		case actions.AUTH:
			return action.authDetails;
		default:
			return state;
	}
};

const register = (state = {}, action) => {
	switch (action.type) {
		case actions.REGISTER:
			return action.regDetails;
		default:
			return state;
	}
};

const roundInitialState = {
	cards: [],
	isValid: false,
	card: null,
	isRoundOver: false
};

const gameInitialState = {
	cards: [],
	players: [],
	closeGame: false,
	showMessage: false,
	message: null,
	shouldPlay: false,
	round: roundInitialState,
	timer: PLAYER_TIMEOUT
};

const game = (state = gameInitialState, action) => {
	switch (action.type) {
		case actions.RECEIVE_CARDS:
			return update(state, { cards: { $set: action.cards } });

		case actions.RECEIVE_PLAYERS:
			return update(state, { players: { $set: action.players } });

		case actions.SHOULD_START:
			return update(state, {
				shouldStartGame: {
					$set: action.shouldStartGame
				},
				showMessage: { $set: false },
				round: { $set: roundInitialState }
			});

		case actions.TURN:
			return update(state, {
				shouldPlay: { $set: action.turn.shouldPlay },
				cards: { $set: action.turn.cards },
				showMessage: { $set: false }
			});

		case actions.STRIKE_INFO:
			return update(state, {
				currentPlayer: { $set: action.currentPlayer },
				showMessage: { $set: false },
				message: { $set: null }
			});

		case actions.RESET_TURN:
			return update(state, {
				shouldPlay: { $set: false }
			});

		case actions.SHOW_TIMER:
			return update(state, { timer: { $set: action.timer } });

		case actions.DROP_CARD:
			return update(state, { round: { card: { $set: action.card } } });

		case actions.CLEAR_DROPPED_CARD:
			return update(state, {
				round: { $set: roundInitialState }
			});

		case actions.RECEIVE_DROPPED_CARDS:
			return update(state, { round: { cards: { $set: action.cards } } });

		case actions.RECEIVE_PENALITY:
			return update(state, { cards: { $push: action.cards } });

		case actions.RECEIVE_BOARD_MESSAGE:
			return update(state, {
				showMessage: { $set: true },
				round: {
					cards: { $set: action.msg.cards }
				},
				message: { $set: action.msg.message }
			});

		case actions.RECEIVE_DROP_ACK:
			if (
				isNullOrUndef(action.msg.isValid) === false &&
				isNullOrUndef(action.msg.card) === false
			) {
				const updatedCards = state.cards.filter(c => c !== action.msg.card);
				return update(state, { cards: { $set: updatedCards } });
			}
			return state;

		case actions.ROUND_CLOSE:
			return update(state, {
				showMessage: { $set: true },
				round: {
					cards: { $set: [] },
					isRoundOver: { $set: true }
				},
				message: { $set: "Round over." }
			});

		case actions.GAME_CLOSE:
			return update(state, {
				showMessage: { $set: true },
				message: { $set: action.msg.message },
				closeGame: { $set: true }
			});

		case actions.CLEAR_MESSAGES:
			return update(state, {
				showMessage: { $set: false },
				message: { $set: null }
			});

		case actions.PLAY_AGAIN:
			return gameInitialState;

		default:
			return state;
	}
};

const rootReducer = combineReducers({
	auth,
	game,
	register
});

export default rootReducer;
