// Can be replaced with class here. Just to try and see how it works done this way.
function Log() {
	this.isProduction = process.env.REACT_APP_DONKEY === "production";
}

// Beware using arrow function is not working here. :)
// eslint-disable-next-line
Log.prototype.Write = function(name, message) {
	if (this.isProduction) {
		return;
	}

	this.group(name);
	this.write(message);
	this.groupEnd(message);
};

// eslint-disable-next-line
Log.prototype.group = function(name) {
	if (this.isProduction) {
		return;
	}

	console.group(
		"%c%s %c%s %c%s",
		"color: brown;font-weight:bold;font-size: 9.5px",
		"[donkey]",
		"color:black",
		name.toUpperCase(),
		"color: gray;font-weight: lighter;font-size: 10px",
		`@ ${new Date().toLocaleTimeString()}`
	);
};

// eslint-disable-next-line
Log.prototype.write = function(message) {
	if (this.isProduction) {
		return;
	}

	console.log("%c message", "color: blue", message);
};

Log.prototype.groupEnd = name => console.groupEnd(name);

const log = new Log();

export default log;
