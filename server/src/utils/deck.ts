import log from "./log";

const cardToWeightageDict = {
	"1": 14,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"10": 10,
	J: 11,
	Q: 12,
	K: 13
};

const WeightageToCardDict = {
	"14": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"10": 10,
	"11": "J",
	"12": "Q",
	"13": "K"
};

class Deck {
	private _cards: Array<string> = [];

	private _names = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"J",
		"Q",
		"K"
	];
	private _suits = ["H", "D", "S", "C"];

	constructor() {
		for (let s = 0; s < this._suits.length; s++) {
			for (let n = 0; n < this._names.length; n++) {
				this._cards.push(`${this._suits[s]}${this._names[n]}`);
			}
		}
	}

	public get cardsShuffled(): Array<string> {
		return this.shuffle(this._cards);
	}

	public sortCards(cards: Array<any>) {
		const mapped = cards.map(card => {
			return { card: card, weight: cardToWeightageDict[card.slice(1)] };
		});
		const newMapped = mapped.sort((a, b) => {
			return a.weight - b.weight;
		});

		return newMapped.map(m => m.card);
	}

	public getCardsForGame(): Array<Array<string>> {
		let cards = [];
		let shuffled: Array<string> = this.shuffle(this._cards);

		let start,
			end = 0;

		for (var i = 0; i < 6; i++) {
			start = end;
			end = start + 8;
			cards.push(shuffled.slice(start, end));
		}
		return cards;
	}

	// Reference (Credits goes to the author in that blog)
	// https://bost.ocks.org/mike/shuffle/
	private shuffle(array) {
		let m = array.length,
			t,
			i;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}
}

const deck = new Deck();
export default deck;
