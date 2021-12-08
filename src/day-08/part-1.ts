import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(parseRecord);

  return input;
}

function parseRecord(record: string) {
  const raw = record.split(' | ');
  const signals = raw[0].split(' ').map((s) => s.split(''));
  const outputs = raw[1].split(' ').map((s) => s.split(''));
  return { signals, outputs };
}

export type Input = ReturnType<typeof parse>;
export type Pattern = Input[0];

export function countUniq(input: Input) {
  let count = 0;
  for (const pattern of input) {
    for (const output of pattern.outputs) {
      if (
        output.length === 2 ||
        output.length === 3 ||
        output.length === 4 ||
        output.length === 7
      ) {
        count++;
      }
    }
  }
  return count;
}

function run() {
  const input = parse();
  const uniq = countUniq(input);

  console.log(`1, 4, 7, 8 count: ${uniq}`);
}

if (!module.parent) {
  run();
}
