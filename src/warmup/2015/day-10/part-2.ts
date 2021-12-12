import fs from 'fs';
import { Input, look, parse } from './part-1';

function run() {
  let seq = parse();
  for (let i = 0; i < 50; i++) {
    seq = look(seq);
  }

  console.log(`Output: ${seq.length}`);
}

if (!module.parent) {
  run();
}
