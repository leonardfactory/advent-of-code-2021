import fs from 'fs';
import { parseInput } from '@utils/command';
import { array2d } from '@utils/array';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('');

  return input;
}

export type Input = ReturnType<typeof parse>;

export const hash = (x: number, y: number) => x * 100_000 + y;

export function countHouses(input: Input) {
  let locations = new Map<number, number>();
  let x = 0;
  let y = 0;
  locations.set(hash(x, y), 1);

  for (const move of input) {
    switch (move) {
      case '^':
        y += 1;
        break;
      case '>':
        x += 1;
        break;
      case '<':
        x -= 1;
        break;
      case 'v':
        y -= 1;
        break;
    }
    const current = hash(x, y);
    locations.set(current, (locations.get(current) ?? 0) + 1);
  }

  return Array.from(locations.keys()).length;
}

function run() {
  const input = parse();
  const houses = countHouses(input);

  console.log(`Houses: ${houses}`);
}

if (!module.parent) {
  run();
}
