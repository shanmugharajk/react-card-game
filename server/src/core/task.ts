export default class Task {
	public start(task, delay: number) {
		return setTimeout(task, delay);
	}

	public static stop(taskId: any) {
		clearTimeout(taskId);
	}

	public static get Instance(): Task {
		return new Task();
	}
}
