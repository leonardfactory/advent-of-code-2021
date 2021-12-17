import fs from 'fs';
import { Input, parse, trajectory } from './part-1';

function run() {
  const input = parse();
  let availables = 0;
  for (let x = 1; x < 500; x++) {
    for (let y = -1000; y < 1000; y++) {
      if (trajectory(input, { x, y }) >= 0) availables++;
    }
  }

  console.log(`Max Height: ${availables}`);
}

if (!module.parent) {
  run();
}
