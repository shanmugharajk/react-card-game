import { suits, names, cardToWeightageDict } from "../constants/deck";

export class Deck {
  private cards: Array<string> = [];

  constructor() {
    for (let s = 0; s < suits.length; s++) {
      for (let n = 0; n < names.length; n++) {
        this.cards.push(`${suits[s]}${names[n]}`);
      }
    }
  }

  public get cardsShuffled(): Array<string> {
    return this.shuffle(this.cards);
  }

  public static sortCards(cards: Array<string>) {
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
    let shuffled: Array<string> = this.shuffle(this.cards);

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
