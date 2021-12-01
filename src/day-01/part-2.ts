import fs from 'fs';
import { parseInput } from '../utils/command';
import { count } from './part-1';

function countSliding(numbers: number[]) {
  let windows = [] as number[];
  for (var i = 0; i < numbers.length - 2; i++) {
    windows.push(numbers[i] + numbers[i + 1] + numbers[i + 2]);
  }
  return count(windows);
}

function run() {
  const numbers = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((n) => parseInt(n, 10));

  console.log(`Increased sliding windows are: ${countSliding(numbers)}`);
}

if (!module.parent) {
  run();
}
