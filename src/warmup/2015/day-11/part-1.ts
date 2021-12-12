import fs from 'fs';
import { parseInput } from '@utils/command';
import { range } from 'lodash';

export function parse() {
  console.log(process.argv[3]);
  const source =
    process.argv[2] === '--pass'
      ? process.argv[3]
      : fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');

  return source.split('').map(n => n.charCodeAt(0));
}

export type Input = ReturnType<typeof parse>;

const letters = range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1).reduce(
  (obj, v) => {
    obj[String.fromCharCode(v)] = v;
    return obj;
  },
  {} as Record<string, number>
);

function increase(pass: number[]) {
  let next = [...pass];
  for (let i = pass.length - 1; i >= 0; i--) {
    next[i] = pass[i] + 1;
    if (next[i] > letters.z) {
      next[i] = letters.a;
      continue;
    }
    break;
  }
  return next;
}

const insecureLetters = [letters.i, letters.o, letters.l];

function isSecure(pass: number[]) {
  let increasing = false;
  let doublesCount = 0;
  let doublesLatestIdx = -100;
  for (let i = 0; i < pass.length; i++) {
    if (insecureLetters.includes(pass[i])) return false;
    if (i >= 2 && pass[i] === pass[i - 1] + 1 && pass[i] === pass[i - 2] + 2) {
      increasing = true;
    }

    if (
      i >= 1 &&
      pass[i] === pass[i - 1] &&
      i !== doublesLatestIdx + 1 &&
      (doublesLatestIdx < 0 || pass[i] !== pass[doublesLatestIdx])
    ) {
      doublesLatestIdx = i;
      doublesCount++;
    }
  }

  return increasing && doublesCount >= 2;
}

export function nextPassword(pass: Input) {
  let curr = pass;
  do {
    curr = increase(curr);
  } while (!isSecure(curr));
  return curr;
}

function run() {
  const pass = parse();
  const next = nextPassword(pass);

  console.log(
    `Next password: ${next.map(n => String.fromCharCode(n)).join('')}`
  );
}

if (!module.parent) {
  run();
}
