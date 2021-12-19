import fs from 'fs';
import util from 'util';
import { parseInput } from '@utils/command';
import { Snailnum } from './Snailnum';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(n => Snailnum.parse(n));

  return input;
}

export type Input = ReturnType<typeof parse>;

function run() {
  const numbers = parse();
  const sum = numbers
    .slice(1)
    .reduce((num, next) => num.add(next).reduce(), numbers[0]);

  console.log(`Output: ${sum.magnitude()}`, sum.print());
}

if (!module.parent) {
  run();
}
