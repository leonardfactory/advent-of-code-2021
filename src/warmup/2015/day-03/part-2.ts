import fs from 'fs';
import { hash, Input, parse } from './part-1';

function countHousesWithRobo(input: Input) {
  let locations = new Map<number, number>();
  let currents = [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];
  locations.set(hash(0, 0), 2);

  for (let i = 0; i < input.length; i++) {
    let current = currents[i % 2];
    switch (input[i]) {
      case '^':
        current.y += 1;
        break;
      case '>':
        current.x += 1;
        break;
      case '<':
        current.x -= 1;
        break;
      case 'v':
        current.y -= 1;
        break;
    }
    const pos = hash(current.x, current.y);
    locations.set(pos, (locations.get(pos) ?? 0) + 1);
  }

  return Array.from(locations.keys()).length;
}

function run() {
  const data = parse();
  const houses = countHousesWithRobo(data);

  console.log(`Houses with robosanta: ${houses}`);
}

if (!module.parent) {
  run();
}
