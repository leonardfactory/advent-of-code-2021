import fs from 'fs';
import { parseInput } from '@utils/command';
import { sumBy } from 'lodash';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n');

  return input;
}

export type Input = ReturnType<typeof parse>;

export function characters(strings: Input) {
  return sumBy(strings, s => stringChars(s));
}

function stringChars(str: string) {
  let total = str.length;
  let valid = 0;
  let escaped = false;
  for (let i = 1; i < str.length - 1; i++) {
    if (str[i] === '\\' && (str[i + 1] === '"' || str[i + 1] === '\\')) {
      valid += 1;
      i++;
      continue;
    }

    if (str[i] === '\\' && str[i + 1] === 'x') {
      valid += 1;
      i += 3;
      continue;
    }

    valid++;
  }

  console.log(`str: ${str}, valid ${valid}, total ${total}`);

  return total - valid;
}

function run() {
  const strings = parse();
  const count = characters(strings);

  console.log(`Memory: ${count}`);
}

if (!module.parent) {
  run();
}
