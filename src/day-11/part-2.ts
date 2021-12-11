import fs from 'fs';
import { Input, parse, step } from './part-1';

export function sync(map: Input) {
  const target = map.width * map.height;
  for (let i = 0; i < 100_000; i++) {
    const flashes = step(map);
    if (flashes === target) {
      return i + 1;
    }
  }
  console.log(`Nope :(`);
}

function run() {
  const map = parse();
  const syncStep = sync(map);

  console.log(`Step sync: ${syncStep}`);
}

if (!module.parent) {
  run();
}
