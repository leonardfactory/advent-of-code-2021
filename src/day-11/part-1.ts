import fs from 'fs';
import { parseInput } from '@utils/command';
import chalk from 'chalk';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(row => row.split('').map(n => parseInt(n, 10)));

  return new Map(input);
}

type Octopus = { x: number; y: number; energy: number };

export class Map {
  readonly height: number;
  readonly width: number;
  readonly cells: Octopus[][];

  constructor(cells: number[][]) {
    this.height = cells.length;
    this.width = cells[0].length;
    this.cells = cells.map((row, y) =>
      row.map((v, x) => ({ x, y, energy: v }))
    );
  }

  at(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.cells[y][x];
  }

  adjacent(point: Octopus) {
    return [
      this.at(point.x + 1, point.y),
      this.at(point.x + 1, point.y + 1),
      this.at(point.x, point.y + 1),
      this.at(point.x - 1, point.y + 1),
      this.at(point.x - 1, point.y),
      this.at(point.x - 1, point.y - 1),
      this.at(point.x, point.y - 1),
      this.at(point.x + 1, point.y - 1)
    ].filter((c): c is Octopus => c != null);
  }

  print() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let octopus = this.cells[y][x];
        process.stdout.write(
          octopus.energy === 0 ? chalk.cyan('0') : octopus.energy.toString()
        );
      }
      process.stdout.write(`\n`);
    }
  }
}

export type Input = ReturnType<typeof parse>;

export function step(map: Input) {
  let flashings: Set<Octopus> = new Set();
  let stack: Octopus[] = [];

  // +1
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      let octopus = map.cells[y][x];
      octopus.energy += 1;

      if (octopus.energy > 9) stack.push(octopus);
    }
  }

  let next: Octopus | undefined;
  while ((next = stack.pop()) != null) {
    if (flashings.has(next)) continue;

    flashings.add(next);
    const adjacents = map.adjacent(next).filter(o => !flashings.has(o));
    for (const adjacent of adjacents) {
      adjacent.energy += 1;
      if (adjacent.energy > 9) stack.push(adjacent);
    }
  }

  for (const flashing of flashings) {
    flashing.energy = 0;
  }

  return flashings.size;
}

export function runSteps(map: Map, steps: number) {
  let flashes = 0;
  for (let i = 0; i < steps; i++) {
    flashes += step(map);
    // console.log(`\nStep ${i + 1}:`);
    // map.print();
  }
  return flashes;
}

function run() {
  const map = parse();
  const flashes = runSteps(map, 100);

  console.log(`Flashes: ${flashes}`);
}

if (!module.parent) {
  run();
}
