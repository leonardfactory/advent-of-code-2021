import fs from 'fs';
import { Input, parse } from './part-1';

function run() {
  const numbers = parse();

  let max = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i == j) continue;
      const magnitude = numbers[i].add(numbers[j]).reduce().magnitude();
      if (magnitude > max) max = magnitude;
    }
  }

  console.log(`Output: ${max}`);
}

if (!module.parent) {
  run();
}
