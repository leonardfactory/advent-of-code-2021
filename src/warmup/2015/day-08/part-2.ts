import fs from 'fs';
import { sumBy } from 'lodash';
import { Input, parse } from './part-1';

export function encodedCount(strings: Input) {
  return sumBy(strings, encode);
}

function encode(str: string) {
  let original = str.length;
  let next = 2; // ""
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\\' || str[i] === '"') {
      next++; // encoding
    }

    next++;
  }

  console.log(`str ${str}, next ${next}, original ${original}`);
  return next - original;
}

function run() {
  const strings = parse();
  const count = encodedCount(strings);

  console.log(`Memory: ${count}`);
}

if (!module.parent) {
  run();
}
