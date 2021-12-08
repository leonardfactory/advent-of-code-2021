import fs from 'fs';
import { Input, parse } from './part-1';

function cheapest(positions: Input) {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  let targetFuel = Infinity;
  let target = 0;
  for (let j = min; j < max; j++) {
    let fuel = 0;
    for (let i = 0; i < positions.length; i++) {
      let delta = Math.abs(positions[i] - j);
      fuel += (delta * (delta + 1)) / 2;
    }
    if (fuel < targetFuel) {
      targetFuel = fuel;
      target = j;
    }
  }

  return { target, targetFuel };
}

function run() {
  const positions = parse();
  const { targetFuel, target } = cheapest(positions);

  console.log(`Fuel is ${targetFuel} (target: ${target})`);
}

if (!module.parent) {
  run();
}
