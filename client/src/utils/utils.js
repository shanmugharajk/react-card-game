export function isNull(argument) {
	if (argument === null) {
		return true;
	}
	return false;
}

export function isUndef(argument) {
	if (argument === undefined) {
		return true;
	}
	return false;
}

export function isNullOrUndef(argument) {
	if (argument === null || argument === undefined) {
		return true;
	}
	return false;
}
