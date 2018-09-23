export const getUniqueId = () => {
  const uuidv1 = require("uuid/v1");
  return uuidv1();
};

export const hasDuplicates = array => {
  return new Set(array).size !== array.length;
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const delayed = (fn: Function, ms: number = 100) => {
  setTimeout(fn(), ms);
};

export const isCardAvail = (cardId: string, cardArr: Array<string>) => {
  for (let idx in cardArr) {
    if (cardId[0] === cardArr[idx][0]) {
      return true;
    }
  }
  return false;
};
