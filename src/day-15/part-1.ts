import fs from 'fs';
import { parseInput } from '@utils/command';
import { minBy } from 'lodash';
import chalk from 'chalk';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((row, y) =>
      row.split('').map((n, x) => ({ risk: parseInt(n, 10), x, y }))
    );

  return input;
}

export type Input = ReturnType<typeof parse>;
export type Point = Input[0][0];

function at(map: Input, x: number, y: number) {
  return x < 0 || y < 0 || y >= map.length || x >= map[0].length
    ? null
    : map[y][x];
}

function getEdges(map: Input, point: Point) {
  return [
    at(map, point.x - 1, point.y),
    at(map, point.x + 1, point.y),
    at(map, point.x, point.y + 1),
    at(map, point.x, point.y - 1)
  ].filter((n): n is Point => n != null);
}

export function printPath(map: Input, path: Path) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const isPath = path.seq.includes(map[y][x]);
      process.stdout.write(
        isPath ? chalk.cyan(map[y][x].risk) : map[y][x].risk.toString()
      );
    }
    process.stdout.write(`\n`);
  }
}

export class Path {
  risk: number = 0;
  seq: Point[];

  constructor(public latest: Point) {
    this.risk = latest.risk;
    this.seq = [latest];
  }

  start() {
    this.risk = 0;
    return this;
  }

  follow(point: Point) {
    let path = new Path(point);
    path.seq = [...this.seq, point];
    path.risk += this.risk;
    return path;
  }
}

function enqueue(queue: Path[], path: Path) {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].risk > path.risk) {
      queue.splice(i, 0, path);
      return;
    }
  }
  queue.push(path);
}

export function lowestRisk(map: Input) {
  let end = {
    y: map.length - 1,
    x: map[0].length - 1
  };

  let visited = new Set<Point>();
  let queue = [new Path(map[0][0]).start()]; // priority
  let path: Path | undefined;
  while ((path = queue.shift()) != null) {
    let edges = getEdges(map, path.latest);
    for (const edge of edges) {
      if (!visited.has(edge)) {
        visited.add(edge);
        const next = path.follow(edge);
        if (edge.x === end.x && edge.y === end.y) return next;
        enqueue(queue, next);
      }
    }
  }
}

function run() {
  const map = parse();
  const path = lowestRisk(map);
  printPath(map, path!);

  console.log(`Lowest Risk: ${path!.risk}`);
}

if (!module.parent) {
  run();
}
