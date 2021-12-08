import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split(',')
    .map((n) => parseInt(n, 10));

  return input;
}

export type Input = ReturnType<typeof parse>;

export function cheapest(positions: Input) {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  let targetFuel = Infinity;
  let target = 0;
  for (let j = min; j < max; j++) {
    let fuel = 0;
    for (let i = 0; i < positions.length; i++) {
      fuel += Math.abs(positions[i] - j);
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
