import * as Promise from "bluebird";
import { store, SocketConn, Task } from "../core";
import {
	log,
	deck,
	Utils,
	isNullOrUndef,
	ConnectivityException,
	GameOverException,
	RoundCloseException,
	InvalidCredentialsException,
	AlreadyLoggedInException
} from "../utils";
import { IUser, IGame, IPlayer } from "../interfaces";

const noOfPlayersForGame = 6;

class Game {
	private igameIdForAllocation: string;

	constructor() {
		this.igameIdForAllocation = Utils.getUniqueId();
	}

	public logout(user: any, socket: SocketConn): Function {
		return store
			.getJsonValue(`${user.gameId}:GAME`)
			.then((existingGame: IGame) => {
				if (isNullOrUndef(existingGame) === false) {
					const userNames = existingGame.players
						.filter(p => p.userName !== user.username)
						.map(m => m.userName);

					return this.sendMessageToPlayers(
						userNames,
						{
							operation: "gameClose",
							payload: {
								message: `User ${user.username} logged out from the game. So the game has been abandoned. 
										You can play again by clicking PlayAgain menu.`
							}
						},
						socket
					).then(() => this.cleanGame(user.gameId, existingGame));
				} else {
					return store.del(`${user.username}:LOGGEDIN`).then(res => {
						return store.removeArrayValue(
							`${user.gameId}:PLAYERS`,
							user.username
						);
					});
				}
			});
	}

	public register(user: IUser) {
		return store.getValue(user.username).then(res => {
			if (res !== null) {
				return Promise.resolve(false);
			}

			return store.addValue(user.username, user.password).then(res => {
				log("reg", res);
				return Promise.resolve(true);
			});
		});
	}

	public login(user: IUser, isRefresh: boolean = false) {
		const userToken = Utils.getUniqueId();

		return store
			.exists(`${user.username}:LOGGEDIN`)
			.then(res => {
				if (isRefresh === false && res === 1) {
					throw new AlreadyLoggedInException(
						new Error(),
						"Already this user is loggedin. Multiple sessions are not allowed"
					);
				}
				return Promise.resolve(user);
			})
			.then(() => {
				if (isRefresh === false) {
					return store.getValue(user.username);
				}
				return user.password;
			})
			.then(res => {
				if (res === null || user.password !== res) {
					return Promise.reject(
						new InvalidCredentialsException(new Error(), "Invalid credentials")
					);
				}

				user.gameId = this.igameIdForAllocation;
				user.token = userToken;

				return store.addArrayValue(
					`${this.igameIdForAllocation}:PLAYERS`,
					user.username
				);
			})
			.then(() => {
				return store.addJsonValue(`${user.username}:LOGGEDIN`, user);
			})
			.then(() => {
				return store.getArrayCount(`${this.igameIdForAllocation}:PLAYERS`);
			})
			.then(noOfPlayersInThisRoom => {
				const shouldGameStart = noOfPlayersInThisRoom === noOfPlayersForGame;

				const previousRoomId = this.igameIdForAllocation;

				if (shouldGameStart === true) {
					this.igameIdForAllocation = Utils.getUniqueId();
				}

				return Promise.resolve({
					userToken: userToken,
					gameId: previousRoomId,
					username: user.username,
					shouldGameStart
				});
			})
			.catch(e => {
				if (e instanceof InvalidCredentialsException) {
					throw new Error(e.message);
				}
				if (e instanceof AlreadyLoggedInException) {
					throw new Error(e.message);
				} else {
					throw new Error("Internal error, please try after sometime.");
				}
			});
	}

	public start(gameId: string, socket: SocketConn) {
		const key = `${gameId}:PLAYERS`;
		let game: IGame;

		store
			.getArrayValue(key)
			.then(usernames => {
				return this.getPlayers(usernames);
			})
			.then(players => {
				// Deleting the array which used for game allocation initially.
				// Not required anymore.
				store.del(key);
				game = this.createGameObject(players);
				return store
					.addJsonValue(`${gameId}:GAME`, game)
					.then(() => Promise.resolve())
					.catch(e => Promise.reject(e));
			})
			.then(() => {
				return this.sendCards(game, socket);
			})
			.then(() => {
				return this.sendPlayersInfo(game, socket);
			})
			.then(() =>
				this.sendMessageToAllSubcribersOfTheGame(
					game,
					{ operation: "startGame", payload: { shouldStart: true } },
					socket
				)
			)
			.then(() => {
				this.strike(gameId, socket);
			})
			.catch(e => {
				this.handleError(e, gameId, game, socket).then(() => {
					this.cleanGame(gameId, game);
				});
				log("game.start()", (<Error>e).message, true);
			});
	}

	private strike(gameId: string, socket: SocketConn) {
		let igame: IGame;
		let currentPlayer: IPlayer;

		try {
			this.getNextPlayer(gameId)
				.then((game: IGame) => {
					igame = game;
					return this.notifyStrikeInfo(igame, socket);
				})
				.then(() => {
					currentPlayer = igame.players[igame.currentTurn];
					return this.notifyTurn(igame, socket);
				})
				.then(({ payload }) => {
					return this.handleDrop(igame, payload.card, socket);
				})
				.then(({ didTurnReset }) => {
					if (didTurnReset === true) {
						this.checkForCloseOfgame(gameId, igame, socket);
						return this.notifyEndOfRound(igame, socket);
					} else if (igame.currentTurn === igame.maxTurn) {
						this.flushCurrentAndInitializeRound(igame);
						this.checkForCloseOfgame(gameId, igame, socket);
						return this.notifyEndOfRound(igame, socket);
					} else {
						return Promise.resolve();
					}
				})
				.then(() => {
					return this.settleDebtAndSaveGameObject(
						gameId,
						currentPlayer,
						igame,
						socket
					);
				})
				.then(() => {
					this.strike(gameId, socket);
				})
				.catch(e => {
					this.handleError(e, gameId, igame, socket).then(() => {
						this.cleanGame(gameId, igame);
					});
				});
		} catch (e) {
			log("game.strike.exception", (<Error>e).message, true);
		}
	}

	private handleError(e: any, gameId: string, game: IGame, socket: SocketConn) {
		if (e instanceof GameOverException) {
			return this.sendMessageToAllSubcribersOfTheGame(
				game,
				{ operation: "gameClose", payload: { message: e.message } },
				socket
			);
		}

		if (e instanceof ConnectivityException) {
			return this.sendMessageToAllSubcribersOfTheGame(
				game,
				{
					operation: "gameClose",
					payload: {
						message: `We couldn't connect one or more players in this game at the moment due to the connectivity problem with the clients. 
						So the game has been abandoned. Please choose play again option in the menu and play again.`
					}
				},
				socket
			);
		}

		log("strike(promise)", (<Error>e).stack, true);

		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "gameClose",
				payload: {
					message: `Sorry for inconvenience, we got an internal error. Please wait for sometime and choose play again option in the menu and play again.`
				}
			},
			socket
		);
	}

	private cleanGame(gameId: string, game: IGame): Promise {
		return game.players
			.reduce((promise, player) => {
				return promise.then(() => {
					return store.del(`${player.userName}:LOGGEDIN`);
				});
			}, Promise.resolve())
			.then(() => {
				return store.del(`${gameId}:GAME`);
			})
			.then(() => {
				return store.del(`${gameId}:PLAYERS`);
			})
			.catch(e => Promise.reject(e));
	}

	private getPlayers(userNames: Array<string>): Promise {
		const players = [];
		return userNames
			.reduce((promise, userName) => {
				return promise.then(() => {
					return store.getJsonValue(`${userName}:LOGGEDIN`).then(player => {
						players.push(player);
					});
				});
			}, Promise.resolve())
			.then(() => Promise.resolve(players))
			.catch(e => Promise.reject(e));
	}

	private checkForCloseOfgame(
		gameId: string,
		game: IGame,
		socket: SocketConn
	): Promise {
		const res = this.isGameOver(game);

		if (res.isGameOver === false) {
			return Promise.resolve();
		}

		const hasDebt = game.debtHistory[res.current.token] > 0;

		if (hasDebt === true) {
			return this.settleDebtAndSaveGameObject(
				gameId,
				res.current,
				game,
				socket
			);
		} else {
			throw new GameOverException(
				new Error(),
				`Game over, ${res.current.userName} won the game. Congratulations ${res
					.current.userName}`
			);
		}
	}

	private isGameOver(game: IGame) {
		for (let idx in game.players) {
			const current = game.players[idx];
			if (game[current.token].length === 0) {
				return { isGameOver: true, current };
			}
		}
		return { isGameOver: false, current: null };
	}

	private settleDebtAndSaveGameObject(
		gameId: string,
		current: IPlayer,
		game: IGame,
		socket: SocketConn
	): Promise {
		const debt = game.debtHistory[current.token];

		const hasDebt = debt > 0;

		if (hasDebt === false) {
			return store.addJsonValue(`${gameId}:GAME`, game);
		}

		const toSettle = game.droppedHistory.splice(0, debt);

		if (toSettle.length === 0) {
			toSettle.concat(deck.cardsShuffled.slice(0, debt));
		}

		// Update the debt.
		game.debtHistory[current.token] = debt - toSettle.length;

		// Update the cards array of the player.
		game[current.token].concat(toSettle);

		// Store the game object and notify the client.
		return store.addJsonValue(`${gameId}:GAME`, game).then(() => {
			return this.notifyDebtPenality(current, gameId, toSettle, socket);
		});
	}

	private notifyDebtPenality(
		current: IPlayer,
		gameId: string,
		toSettle: Array<string>,
		socket: SocketConn
	): Promise {
		log("notifyDebtPenality", toSettle);

		return this.getChannelAsync(current.userName, socket).then(channel => {
			if (channel === undefined) {
				return Promise.reject(
					new ConnectivityException(
						new Error(),
						`Couldn't connect to the player ${current.userName}, ${current.token}`
					)
				);
			}
			channel.emit("data", {
				operation: "notifyDebtPenality",
				payload: { cards: toSettle }
			});

			return Promise.resolve();
		});
	}

	private handleDrop(
		game: IGame,
		droppedCard: string,
		socket: SocketConn
	): Promise {
		if (droppedCard === null) {
			return this.ifDroppedIsNull(game, droppedCard, socket).then(() =>
				Promise.resolve({ didTurnReset: false })
			);
		}

		// First round/start after a preclose of a round.
		if (game.droppedCards.length === 0) {
			return this.addDroppedCardAndNotity(game, droppedCard, socket).then(() =>
				Promise.resolve({ didTurnReset: false })
			);
		}

		const lidx = game.droppedCards.length - 1;
		const lastDroppedCard = game.droppedCards[lidx];
		const current = game.players[game.currentTurn];

		// If player dropped the same suit.
		if (lastDroppedCard[0] === droppedCard[0]) {
			return this.addDroppedCardAndNotity(game, droppedCard, socket).then(() =>
				Promise.resolve({ didTurnReset: false })
			);
		}

		const cards = game[current.token];
		const isCheating = Utils.isCardAvail(lastDroppedCard, cards);

		if (isCheating === true) {
			return this.onCheating(game, droppedCard, socket).then(() =>
				Promise.resolve({ didTurnReset: false })
			);
		}

		// Should close the round here, because user dropped a different
		// suit. So need to find the player who put the highest number
		// among thr dropped ones and reset the strike to him. Also the
		// dropped cards will be added to his account.
		return this.closeRound(game, droppedCard, socket).then(() =>
			Promise.resolve({ didTurnReset: true })
		);
	}

	private closeRound(
		game: IGame,
		droppedCard: string,
		socket: SocketConn
	): Promise {
		const currentPlayerToken = game.players[game.currentTurn].token;
		const sorted = deck.sortCards(game.droppedCards);

		// Player who needs to get all dropped cards.
		const token = game.dropDetails[sorted[sorted.length - 1]];
		const index = game.players.findIndex(x => x.token === token);

		if (index === -1) {
			throw new RoundCloseException(
				new Error(),
				"Error occurred in determining the turn in 'setTurnAndUpdateDrop'."
			);
		}

		game.droppedCards.push(droppedCard);
		game[token] = game[token].concat(game.droppedCards);

		const newCards = game[currentPlayerToken].filter(c => c !== droppedCard);
		game[currentPlayerToken] = newCards;

		// The user to whom we need to send penality
		const userName = game.players[index].userName;

		return this.sendDroppedCards(game, socket)
			.then(() => {
				return this.sendPenality(game, userName, socket);
			})
			.then(() => {
				// -1 since in strike we are calling nextPlayer it is doing +1. So compensated :)
				this.flushCurrentAndInitializeRound(game, index - 1);
				Promise.resolve();
			});
	}

	private onCheating(
		game: IGame,
		droppedCard: string,
		socket: SocketConn
	): Promise {
		const currentPlayer = game.players[game.currentTurn];

		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "dropBoardMessage",
				payload: {
					message:
						`User ${currentPlayer.userName} cheated by putting a card of different suit (${droppedCard})` +
						`eventhough he has the same suit. So he will get one card added to his account at the end of this round.`,
					cards: game.droppedCards
				}
			},
			socket
		)
			.then(unSentIds => {
				game.debtHistory[currentPlayer.token] =
					game.debtHistory[currentPlayer.token] + 1;
				return Promise.resolve();
			})
			.catch(e => Promise.reject(e));
	}

	private ifDroppedIsNull(
		game: IGame,
		droppedCard: string,
		socket: SocketConn
	) {
		const currentPlayer = game.players[game.currentTurn];

		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "dropBoardMessage",
				payload: {
					message: `User ${currentPlayer.userName} didn't drop any card within time.
					So he will get one card added to his account at the end of this round.`
				}
			},
			socket
		)
			.then(unSentIds => {
				game.debtHistory[currentPlayer.token] =
					game.debtHistory[currentPlayer.token] + 1;
				return Promise.resolve();
			})
			.catch(e => Promise.reject(e));
	}

	private addDroppedCardAndNotity(
		game: IGame,
		droppedCard: string,
		socket: SocketConn
	): Promise {
		this.addToDrop(game, droppedCard);
		return this.sendDroppedCards(game, socket);
	}

	private addToDrop(game: IGame, droppedCard: string) {
		const token = game.players[game.currentTurn].token;
		game.droppedCards.push(droppedCard);
		game.dropDetails[droppedCard] = token;

		const newCards = game[token].filter(c => c !== droppedCard);
		game[token] = newCards;
	}

	private notifyEndOfRound(game: IGame, socket: SocketConn): Promise {
		return new Promise((resolve, reject) => {
			this.notifyRoundOver(game, socket).then(() => {
				Task.Instance.start(() => resolve(), 2000);
			});
		});
	}

	private flushCurrentAndInitializeRound(
		game: IGame,
		currentTurn: number = -1
	) {
		for (let idx in game.droppedCards) {
			game.droppedHistory.push(game.droppedCards[idx]);
		}

		game.droppedCards = [];
		game.currentTurn = currentTurn;
		game.dropDetails = {};
	}

	private notifyRoundOver(game: IGame, socket: SocketConn): Promise {
		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "roundClose",
				payload: {
					message: "Round over"
				}
			},
			socket
		);
	}

	private getConnectivityException(game: IGame): any {
		const current = game.players[game.currentTurn];

		return new ConnectivityException(
			new Error(),
			`Couldn't connect to the player ${current.userName}, ${current.token}`
		);
	}

	private sendPenality(
		game: IGame,
		userName: string,
		socket: SocketConn
	): Promise {
		return this.getChannelAsync(userName, socket).then(channel => {
			if (channel === undefined) {
				return Promise.reject(this.getConnectivityException(game));
			}
			channel.emit(
				"data",
				{
					operation: "recievePenality",
					payload: { cards: game.droppedCards }
				},
				ack => {}
			);
			return Promise.resolve();
		});
	}

	private sendDroppedCards(game: IGame, socket: SocketConn): Promise {
		const userName = game.players[game.currentTurn].userName;

		return this.getChannelAsync(userName, socket).then(channel => {
			if (channel === undefined) {
				return Promise.reject(this.getConnectivityException(game));
			}

			channel.emit(
				"data",
				{
					operation: "dropAck",
					payload: {
						isValid: true,
						card: game.droppedCards[game.droppedCards.length - 1]
					}
				},
				ack => {}
			);

			// This promise will be returned.
			return this.sendMessageToAllSubcribersOfTheGame(
				game,
				{
					operation: "recieveDroppedCards",
					payload: { cards: game.droppedCards }
				},
				socket
			);
		});
	}

	private notifyTurn(game: IGame, socket: SocketConn): Promise {
		return new Promise((resolve, reject) => {
			const current = game.players[game.currentTurn];

			this.getChannelAsync(current.userName, socket).then(channel => {
				if (channel === undefined) {
					return Promise.reject(this.getConnectivityException(game));
				}
				channel.emit(
					"data",
					{
						operation: "turn",
						payload: {
							shouldPlay: true,
							cards: game[current.token]
						}
					},
					ack => {
						return resolve(ack);
					}
				);
			});
		});
	}

	private notifyStrikeInfo(game: IGame, socket: SocketConn): Promise {
		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "strikeInfo",
				payload: {
					currentPlayer: game.players[game.currentTurn].userName
				}
			},
			socket
		);
	}

	private getNextPlayer(gameId: string): Promise {
		return store
			.getJsonValue(`${gameId}:GAME`)
			.then((game: IGame) => {
				game.currentTurn++;
				return Promise.resolve(game);
			})
			.catch(e => Promise.reject(e));
	}

	private sendMessageToAllSubcribersOfTheGame(
		game: IGame,
		message: any,
		socket: SocketConn
	): Promise {
		const notSent = [];
		return this.sendMessageToPlayers(
			game.players.map(m => m.userName),
			message,
			socket
		);
	}

	private sendMessageToPlayers(
		userNames: Array<string>,
		message: any,
		socket: SocketConn
	): Promise {
		const notSent = [];
		return userNames
			.reduce((promise, userName) => {
				return promise.then(() => {
					return this.getChannelAsync(userName, socket).then(channel => {
						if (channel === undefined) {
							notSent.push(userName);
							return;
						}
						channel.emit("data", message, ack => {});
					});
				});
			}, Promise.resolve())
			.then(() => Promise.resolve(notSent))
			.catch(e => Promise.reject(e));
	}

	private sendPlayersInfo(game: IGame, socket: SocketConn): Promise {
		const players = game.players.map(player => {
			return player.userName;
		});

		return this.sendMessageToAllSubcribersOfTheGame(
			game,
			{
				operation: "recievePlayersInfo",
				payload: {
					players
				}
			},
			socket
		);
	}

	private sendCards(game: IGame, socket: SocketConn) {
		return game.players
			.reduce((promise, player) => {
				return promise.then(() => {
					return this.getChannelAsync(player.userName, socket).then(channel => {
						if (channel === undefined) {
							throw this.getConnectivityException(game);
						}
						channel.emit("data", {
							operation: "recieveCards",
							payload: { cards: game[player.token] }
						});
					});
				});
			}, Promise.resolve())
			.then(() => Promise.resolve())
			.catch(e => Promise.reject(e));
	}

	private getChannelAsync(userName: string, socket: SocketConn): Promise {
		return store
			.getJsonValue(`${userName}:LOGGEDIN`)
			.then((player: IUser) => {
				return Promise.resolve(socket.connected[player.socketId]);
			})
			.catch(e => Promise.reject(e));
	}

	private createGameObject(players: Array<IUser>): IGame {
		const game = {};
		game["players"] = [];
		game["currentTurn"] = -1;
		game["maxTurn"] = noOfPlayersForGame - 1;
		game["droppedCards"] = [];
		game["droppedHistory"] = [];
		game["dropDetails"] = {};
		game["debtHistory"] = {};

		const cards = deck.getCardsForGame();

		for (let idx in players) {
			const user: IUser = players[idx];
			game["players"].push({
				socketId: user.socketId,
				token: user.token,
				userName: user.username
			});
			game[user.token] = cards[idx];
			game["debtHistory"][user.token] = 0;
		}
		return <IGame>game;
	}
}

const game = new Game();
export { game, noOfPlayersForGame };
