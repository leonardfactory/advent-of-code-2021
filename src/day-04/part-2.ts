import { without } from 'lodash';
import { Card, checkWin, parse, points } from './part-1';

function runMatch(draw: number, cards: Card[]) {
  let winners: Card[] = [];
  for (const card of cards) {
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card.length; j++) {
        if (card[i][j].number === draw) {
          card[i][j].marked = true;

          // Check for victory
          if (checkWin(card, i, j)) {
            winners.push(card);
          }
        }
      }
    }
  }
  return winners;
}

function run() {
  let { numbers, cards } = parse();

  for (let i = 0; i < numbers.length; i++) {
    const draw = numbers[i];
    const winners = runMatch(draw, cards);
    if (winners.length) {
      for (const winner of winners) {
        console.log(`[Drawn: ${draw}] We've got a winner! Points: ${points(draw, winner)}`); // prettier-ignore
      }
    }

    cards = without(cards, ...winners);
  }
}

if (!module.parent) {
  run();
}
