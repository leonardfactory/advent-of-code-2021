import fs from 'fs';
import crypto from 'crypto';
import { parseInput } from '@utils/command';

export function parse() {
  return fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');
}

export type Input = ReturnType<typeof parse>;

export function findHash(secret: Input) {
  for (let i = 0; i < 1_000_000; i++) {
    let hash = crypto
      .createHash('md5')
      .update(secret + i.toString())
      .digest('hex');

    if (hash.startsWith('00000')) return i;
  }
  console.warn(`Nope :(`);
}

function run() {
  const secret = parse();
  const number = findHash(secret);

  console.log(`Number: ${number}`);
}

if (!module.parent) {
  run();
}
