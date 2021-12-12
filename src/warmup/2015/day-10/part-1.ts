import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  console.log(process.argv[3]);
  const source =
    process.argv[2] === '--seq'
      ? process.argv[3]
      : fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');

  return source.split('').map(n => parseInt(n, 10));
}

export type Input = ReturnType<typeof parse>;

export function look(seq: number[]) {
  // console.log(`seq:`, seq.join(''));
  let next: number[] = [];
  let count = 0;
  for (let i = 0; i < seq.length; i++) {
    if (i > 0 && seq[i - 1] !== seq[i]) {
      next.push(count, seq[i - 1]);
      count = 0;
    }
    count++;
  }

  if (count > 0) {
    next.push(count, seq[seq.length - 1]);
  }

  return next;
}

function run() {
  let seq = parse();
  for (let i = 0; i < 40; i++) {
    seq = look(seq);
  }

  console.log(`Output: ${seq.length}`);
}

if (!module.parent) {
  run();
}
