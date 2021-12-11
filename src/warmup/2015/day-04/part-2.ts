import fs from 'fs';
import crypto from 'crypto';
import { Input, parse } from './part-1';

function findHash(secret: Input) {
  for (let i = 0; i < 10_000_000; i++) {
    let hash = crypto
      .createHash('md5')
      .update(secret + i.toString())
      .digest('hex');

    if (hash.startsWith('000000')) return i;
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
