import { parseInput } from '@utils/command';
import fs from 'fs';
import { sortBy } from 'lodash';

type Point = { x: number; y: number; value: number };

export class Map {
  readonly height: number;
  readonly width: number;
  readonly cells: Point[][];

  constructor(cells: number[][]) {
    this.height = cells.length;
    this.width = cells[0].length;
    this.cells = cells.map((row, y) => row.map((v, x) => ({ x, y, value: v })));
  }

  at(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.cells[y][x];
  }

  adjacent(point: Point) {
    return [
      this.at(point.x + 1, point.y),
      this.at(point.x - 1, point.y),
      this.at(point.x, point.y + 1),
      this.at(point.x, point.y - 1)
    ].filter((c): c is Point => c != null);
  }
}

function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((row) => row.split('').map((n) => parseInt(n, 10)));

  return new Map(input);
}

function findBasins(map: Map) {
  const lows = lowPoints(map);
  const basins: Point[][] = [];

  for (const low of lows) {
    let stack: Point[] = [low];
    let basin: Set<Point> = new Set();
    let next: Point | undefined;
    while ((next = stack.pop()) != null) {
      if (next.value === 9) continue;

      const adjacents = map.adjacent(next);
      const news = adjacents.filter((a) => !basin.has(a));

      if (news.every((a) => a.value >= next!.value)) {
        basin.add(next);
        stack.push(...news);
      }
    }
    basins.push(Array.from(basin.values()));
  }

  return sortBy(basins, (b) => -b.length);
}

function lowPoints(map: Map) {
  let points: Point[] = [];
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const point = map.at(x, y)!;
      if (map.adjacent(point).every((a) => a.value > point.value)) {
        points.push(point);
      }
    }
  }
  return points;
}

function run() {
  const map = parse();
  const basins = findBasins(map);
  console.log(
    `Basins:`,
    basins.map((b) => b.length)
  );
  const largest = basins[0].length * basins[1].length * basins[2].length;

  console.log(`Output: ${largest}`);
}

if (!module.parent) {
  run();
}
