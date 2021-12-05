// Start at 17:48
import fs from 'fs';
import { parseInput } from '../utils/command';

export type Line = ReturnType<typeof parseLine>;
export type Point = { x: number; y: number };

export function parse() {
  const text = fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');
  const rawLines = text.split('\n');
  const lines = rawLines.map(parseLine);
  return lines;
}

function parseLine(raw: string) {
  const tokens = raw.split(' -> ');
  const [from, to] = tokens.map((token) => {
    const [x, y] = token.split(',');
    return {
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    };
  });

  const type =
    from.x === to.x ? 'vertical' : from.y === to.y ? 'horizontal' : 'diagonal';

  return {
    from,
    to,
    type
  } as const;
}

function mapSize(lines: Line[]) {
  let width = 0;
  let height = 0;
  for (const line of lines) {
    width = Math.max(Math.max(line.from.x, line.to.x), width);
    height = Math.max(Math.max(line.from.y, line.to.y), height);
  }
  return { width: width + 1, height: height + 1 };
}

export type Map = ReturnType<typeof createMap>;

export function createMap(lines: Line[]) {
  const { width, height } = mapSize(lines);
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill(0)) as number[][];
}

export function printMap(map: Map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      process.stdout.write(map[i][j] === 0 ? '.' : map[i][j].toString());
    }
    process.stdout.write('\n');
  }
}

export function howManyIntersecting(map: Map) {
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] > 1) count++;
    }
  }
  return count;
}

function linePoints(line: Line) {
  let points: Point[] = [];
  if (line.type === 'vertical') {
    const direction = line.to.y >= line.from.y ? 1 : -1;
    points = Array(Math.abs(line.to.y - line.from.y) + 1)
      .fill(null)
      .map((_, i) => ({
        x: line.from.x,
        y: line.from.y + i * direction
      }));
  } else if (line.type === 'horizontal') {
    const direction = line.to.x >= line.from.x ? 1 : -1;
    points = Array(Math.abs(line.to.x - line.from.x) + 1)
      .fill(null)
      .map((_, i) => ({
        x: line.from.x + i * direction,
        y: line.from.y
      }));
  }
  return points;
}

function drawLine(map: Map, line: Line) {
  const points = linePoints(line);
  // console.log(`line: `, line, points);
  for (const point of points) {
    map[point.y][point.x] += 1;
  }
}

function run() {
  const lines = parse();
  const map = createMap(lines);
  for (const line of lines) {
    drawLine(map, line);
  }
  // printMap(map);
  console.log(`Intersections: ${howManyIntersecting(map)}`);
}

if (!module.parent) {
  run();
}
