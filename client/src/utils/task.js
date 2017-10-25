export default class Task {
	static Instance = new Task();

	start = (func, delay = 1) => setTimeout(() => func(), delay);

	static stop = id => clearTimeout(id);
}
