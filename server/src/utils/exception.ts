function ConnectivityException(e: Error, message: any) {
	this.stack = e.stack;
	this.message = message;
}

function GameOverException(e: Error, message: any) {
	this.stack = e.stack;
	this.message = message;
}

function RoundCloseException(e: Error, message: any) {
	this.stack = e.stack;
	this.message = message;
}

function InvalidCredentialsException(e: Error, message: any) {
	this.stack = e.stack;
	this.message = message;
}

function AlreadyLoggedInException(e: Error, message: any) {
	this.stack = e.stack;
	this.message = message;
}

export {
	ConnectivityException,
	GameOverException,
	RoundCloseException,
	InvalidCredentialsException,
	AlreadyLoggedInException
};
