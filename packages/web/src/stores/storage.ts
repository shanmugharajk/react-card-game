export function clear() {
  return new Promise((resolve, reject) => {
    try {
      window.sessionStorage.clear();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export function getItem(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const value = window.sessionStorage.getItem(key);
      resolve(value as any);
    } catch (err) {
      reject(err);
    }
  });
}

export function removeItem(key: string) {
  return new Promise((resolve, reject) => {
    try {
      window.sessionStorage.removeItem(key);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export function setItem(key: string, value: string) {
  return new Promise((resolve, reject) => {
    try {
      window.sessionStorage.setItem(key, value);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
