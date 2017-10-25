export interface IUser {
	token: string;
	socketId: string;
	username: string;
	password: string;
	gameId: string;
}

export interface IGameTimer {
	[token: string]: { timer: Function; id: number };
}

export interface ILoginReply {
	userToken: string;
	gameId: string;
	shouldGameStart: boolean;
}

export interface IGame {
	players: [IPlayer];
	currentTurn: any;
	maxTurn: any;
	droppedCards: Array<any>;
	dropDetails: any | IDroppedDetails;
	droppedHistory: Array<any>;
	debtHistory: any | IDebtHistory;

	// This is to store the card details by userId/token.
	[token: string]: Array<any>;
}

export interface IPlayer {
	socketId: string;
	token: string;
	userName: string;
}

export interface IDroppedDetails {
	[cardId: string]: string;
}

export interface IDebtHistory {
	[token: string]: number;
}
