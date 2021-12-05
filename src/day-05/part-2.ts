// Start at 17:48
import fs from 'fs';
import { parseInput } from '../utils/command';
import {
  createMap,
  howManyIntersecting,
  Line,
  parse,
  Point,
  Map,
  printMap
} from './part-1';

function getNormalizedDirection(line: Line) {
  const direction = {
    x: line.to.x - line.from.x,
    y: line.to.y - line.from.y
  };
  const magnitude = Math.sqrt(
    Math.pow(direction.x, 2) + Math.pow(direction.y, 2)
  );
  direction.x = Math.round(direction.x / magnitude);
  direction.y = Math.round(direction.y / magnitude);
  return direction;
}

function linePoints(line: Line) {
  const direction = getNormalizedDirection(line);
  console.log(`line direction = `, direction, line);
  let points: Point[] = [];
  let current: Point;
  let i = 0;
  while (true) {
    current = {
      x: line.from.x + i * direction.x,
      y: line.from.y + i * direction.y
    };
    points.push(current);

    i++;

    if (current.x === line.to.x && current.y === line.to.y) {
      break;
    }
  }
  return points;
}

function drawLine(map: Map, line: Line) {
  const points = linePoints(line);
  for (const point of points) {
    map[point.y][point.x] += 1;
  }
}

function run() {
  const lines = parse();
  const map = createMap(lines);
  for (const line of lines) {
    drawLine(map, line);
    // printMap(map);
  }
  // printMap(map);
  console.log(`Intersections: ${howManyIntersecting(map)}`);
}

if (!module.parent) {
  run();
}
