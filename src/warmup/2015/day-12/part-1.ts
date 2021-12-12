import fs from 'fs';
import { parseInput } from '@utils/command';
import { sum } from 'lodash';

export function parse() {
  const input = fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');
  return input;
}

export type Input = ReturnType<typeof parse>;

export function findAndSum(input: Input) {
  const numbers = input.match(/(-\d+|\d+)\b/g)!.map(n => Number(n));
  console.log(numbers, input.match(/(-\d+|\d+)\b/g));
  return sum(numbers);
}

function run() {
  const input = parse();
  const summed = findAndSum(input);

  console.log(`Sum: ${summed}`);
}

if (!module.parent) {
  run();
}
