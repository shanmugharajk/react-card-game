export default class Timer {
	static Instance = new Timer();

	startTimer = (func, delay = 1000) => setInterval(() => func(), delay);

	static stopTimer = id => clearInterval(id);
}
