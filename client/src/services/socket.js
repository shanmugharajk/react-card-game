import * as io from "socket.io-client";
import { SETTINGS } from "../constants";
import store from "../store";
import * as actions from "../actions";
import { Timer, Task } from "../utils";

export const PLAYER_TIMEOUT = 50;

const socket = io(SETTINGS.socketUrl);

// eslint-disable-next-line
const getState = () => store.getState();

const handle = ({ operation, payload }, cb) => {
	let ctr = PLAYER_TIMEOUT;
	let id = 0;

	switch (operation) {
		case "recieveCards":
			store.dispatch(actions.recievCards(payload.cards));
			break;

		case "recievePlayersInfo":
			store.dispatch(actions.recievePlayersInfo(payload.players));
			break;

		case "startGame":
			store.dispatch(actions.startGame(payload.shouldStart));
			break;

		case "turn":
			store.dispatch(actions.playTurn(payload));

			id = Timer.Instance.startTimer(() => {
				// TODO can refractor this outside ?.
				if (ctr === 0) {
					Timer.stopTimer(id);
					store.dispatch(actions.clearDroppedCard());
					store.dispatch(actions.resetTurn());
					cb({ operation: "droppedCard", payload: { card: null } });
				}

				const round = getState().game.round;
				if (round !== null && round.card) {
					Timer.stopTimer(id);
					store.dispatch(actions.clearDroppedCard());
					store.dispatch(actions.resetTurn());
					cb({ operation: "droppedCard", payload: { card: round.card } });
				}

				store.dispatch(actions.showTimer(ctr));
				ctr--;
			});
			break;

		case "strikeInfo":
			store.dispatch(actions.recieveStrikeInfo(payload.currentPlayer));
			break;

		case "recievePenality":
			store.dispatch(actions.recievePenality(payload.cards));
			break;

		case "notifyDebtPenality":
			store.dispatch(actions.recievePenality(payload.cards));
			break;

		case "recieveDroppedCards":
			store.dispatch(actions.recieveDroppedCard(payload.cards));
			break;

		case "dropAck":
			store.dispatch(actions.recieveDropValidity(payload));
			break;

		// MESSAGES
		case "dropBoardMessage":
			store.dispatch(actions.recieveDropBoardMessage(payload));
			break;

		case "roundClose":
			store.dispatch(actions.roundClose(payload));
			break;

		case "gameClose":
			store.dispatch(actions.gameClose(payload));
			break;

		default:
			break;
	}
};

socket.on("data", handle);

export default socket;

export function sendMessage(message, cb) {
	socket.emit("data", message, ack => {
		cb(ack);
	});
}

const loginCb = (err, token) => {
	if (err) {
		store.dispatch(
			actions.auth({ token: "", authMessage: err, authStatus: "FAILED" })
		);
	} else {
		store.dispatch(
			actions.auth({
				token,
				authMessage: "Successfully authenticated",
				authStatus: "SUCCESS"
			})
		);
	}
};

export function loginUser(username, password) {
	socket.emit(
		"data",
		{ operation: "login", payload: { username, password } },
		loginCb
	);
}

export function registerUser(username, password) {
	socket.emit(
		"data",
		{ operation: "register", payload: { username, password } },
		(err, flag) => {
			if (err) {
				store.dispatch(
					actions.register({ isRegisterd: false, regMessage: err })
				);
				return;
			}

			if (flag === 0) {
				store.dispatch(
					actions.register({
						isRegisterd: false,
						regMessage: "Registration failed, username already exists."
					})
				);
			} else {
				store.dispatch(
					actions.register({
						isRegisterd: true,
						regMessage: "Registration done Successfully"
					})
				);
			}
		}
	);
}

export function playAgain(user) {
	socket.emit("data", { operation: "logout", payload: { user } }, () => {
		store.dispatch(actions.playGameAgain());

		Task.Instance.start(() => {
			socket.emit(
				"data",
				{
					operation: "playAgain",
					payload: { username: user.username, token: user.userToken }
				},
				loginCb
			);
		}, 1000);
	});
}

export function logoutUser(user) {
	socket.emit("data", { operation: "logout", payload: { user } }, () => {
		Task.Instance.start(() => {
			sessionStorage.clear();
			window.location.reload();
		}, 1000);
	});
}

// eslint-disable-next-line
window.onload = e => {
	if (sessionStorage.getItem("count") === "1") {
		sessionStorage.clear();
		window.location.reload();
	}
};
