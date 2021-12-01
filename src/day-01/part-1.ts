import fs from 'fs';
import { parseInput } from '../utils/command';

export function count(numbers: number[]) {
  let count = 0;
  let prev = Number.POSITIVE_INFINITY;
  for (const number of numbers) {
    if (number > prev) count++;
    prev = number;
  }

  return count;
}

function run() {
  const numbers = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((n) => parseInt(n, 10));

  console.log(`Increased are: ${count(numbers)}`);
}

if (!module.parent) {
  run();
}
