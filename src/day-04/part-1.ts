import fs from 'fs';
import { parseInput } from '../utils/command';

export type Card = ReturnType<typeof parseCard>;

export function parse() {
  const text = fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');

  const [rawNumbers, ...rawCards] = text.split('\n\n');

  const numbers = rawNumbers.split(',').map((n) => parseInt(n, 10));
  const cards = rawCards.map(parseCard);

  return { numbers, cards };
}

function parseCard(raw: string) {
  return raw.split('\n').map((row, i) => {
    return row
      .trim()
      .split(/\s+/g)
      .map((n) => ({ number: parseInt(n, 10), marked: false }));
  });
}

export function runMatch(draw: number, cards: Card[]) {
  for (const card of cards) {
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card.length; j++) {
        if (card[i][j].number === draw) {
          card[i][j].marked = true;

          // Check for victory
          if (checkWin(card, i, j)) {
            return card;
          }
        }
      }
    }
  }
}

export function checkWin(card: Card, row: number, col: number) {
  let winningRow = true;
  let winningCol = true;
  for (let i = 0; i < card.length; i++) {
    winningRow = card[row][i].marked && winningRow;
    winningCol = card[i][col].marked && winningCol;
  }

  if (winningRow || winningCol) return true;
}

export function points(draw: number, card: Card) {
  let sum = 0;
  for (let i = 0; i < card.length; i++) {
    for (let j = 0; j < card.length; j++) {
      if (!card[i][j].marked) sum += card[i][j].number;
    }
  }
  return sum * draw;
}

function run() {
  const { numbers, cards } = parse();

  for (let i = 0; i < numbers.length; i++) {
    const draw = numbers[i];
    const winner = runMatch(draw, cards);
    if (winner) {
      console.log(
        `We've got a winner! Drawn: ${draw}, Points: ${points(draw, winner)}`
      );
      return;
    }
  }

  console.error(`No winner :(`);
}

if (!module.parent) {
  run();
}
