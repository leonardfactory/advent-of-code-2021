import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split(',')
    .map((n) => parseInt(n, 10));

  return input;
}

export type Input = ReturnType<typeof parse>;

export function cycle(fishes: Input) {
  const initialSize = fishes.length;
  for (let i = 0; i < initialSize; i++) {
    if (fishes[i] === 0) {
      fishes.push(8);
      fishes[i] = 6;
    } else {
      fishes[i] -= 1;
    }
  }
}

function run() {
  const fishes = parse();
  for (let i = 0; i < 80; i++) {
    cycle(fishes);
  }

  console.log(`Fishes after 80 days: ${fishes.length}`);
}

if (!module.parent) {
  run();
}
