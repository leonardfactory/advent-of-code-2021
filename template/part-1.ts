import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n');

  return input;
}

export type Input = ReturnType<typeof parse>;

export function part1(input: Input) {
  // ...
}

function run() {
  const input = parse();

  console.log(`Output:`);
}

if (!module.parent) {
  run();
}
