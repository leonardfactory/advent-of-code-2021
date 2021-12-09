import fs from 'fs';
import { parseInput } from '@utils/command';
import { sumBy } from 'lodash';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((row) => row.split('').map((n) => parseInt(n, 10)));

  return new Map(input);
}

export class Map {
  readonly height: number;
  readonly width: number;

  constructor(readonly cells: number[][]) {
    this.height = cells.length;
    this.width = cells[0].length;
  }

  at(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.cells[y][x];
  }

  adjacent(x: number, y: number) {
    return [
      this.at(x + 1, y),
      this.at(x - 1, y),
      this.at(x, y + 1),
      this.at(x, y - 1)
    ].filter((c): c is number => c != null);
  }
}

export type Input = ReturnType<typeof parse>;

export function lowPoints(map: Input) {
  let points: number[] = [];
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const value = map.at(x, y)!;
      if (map.adjacent(x, y).every((v) => v > value)) {
        console.log(`Added (${x},${y}) = ${value}`);
        points.push(value);
      }
    }
  }
  return points;
}

function adjacent(map: Input, x: number, y: number) {}

function run() {
  const map = parse();
  const points = lowPoints(map);
  const risk = sumBy(points, (p) => p + 1);

  console.log(`Risk level: ${risk}`);
}

if (!module.parent) {
  run();
}
