// https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
const log = (methodName: string, message: any, isError: boolean = false) => {
	const isProduction = process.env.NODE_ENV;

	if (isProduction === "production" && !isError) {
		return;
	}

	console.log();

	// TODO refractor later

	// Note : This also works
	// const sh = typeof message;
	// console.log(sh === "object");

	if (message === undefined) {
		message = "undefined";
	}

	if (message === null) {
		message = "null";
	}

	if (message.constructor !== "test".constructor) {
		message = JSON.stringify(message);
	}

	if (isError) {
		console.log(
			"\x1b[31m%s\x1b[1m",
			`[donkey] log time : ${new Date().toLocaleTimeString()}`
		);
	} else {
		console.log(
			"\x1b[33m%s\x1b[1m",
			`[donkey] log time : ${new Date().toLocaleTimeString()}`
		);
	}

	if (methodName) {
		console.log(`\x1b[36mmmethodname : \x1b[37m${methodName}`);
	}

	if (isError) {
		console.log(`\x1b[36merror : \x1b[37m${message}`);
	} else {
		console.log(`\x1b[36mdetails : \x1b[37m${message}`);
	}
};

export default log;
