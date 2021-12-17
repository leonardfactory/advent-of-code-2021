import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(raw => raw.split('').map(r => (r === '#' ? 1 : 0)));

  return new Map().fromInput(input);
}

type Point = { x: number; y: number; value: 0 | 1 };

export class Map {
  height: number = 0;
  width: number = 0;
  lights: Point[][] = [];

  constructor() {}

  fromInput(lights: (0 | 1)[][]) {
    this.height = lights.length;
    this.width = lights[0].length;
    this.lights = lights.map((row, y) =>
      row.map((v, x) => ({ x, y, value: v }))
    );
    return this;
  }

  at(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    return this.lights[y][x].value;
  }

  adjacent(point: Point) {
    return (
      this.at(point.x + 1, point.y) +
      this.at(point.x + 1, point.y + 1) +
      this.at(point.x, point.y + 1) +
      this.at(point.x - 1, point.y + 1) +
      this.at(point.x - 1, point.y) +
      this.at(point.x - 1, point.y - 1) +
      this.at(point.x, point.y - 1) +
      this.at(point.x + 1, point.y - 1)
    );
  }

  step() {
    let map = new Map();
    map.width = this.width;
    map.height = this.height;
    map.lights = this.lights.map(row =>
      row.map(light => {
        const neighbours = this.adjacent(light);
        return {
          ...light,
          value:
            light.value === 1
              ? neighbours === 2 || neighbours === 3
                ? 1
                : 0
              : neighbours === 3
              ? 1
              : 0
        };
      })
    );
    return map;
  }
}

export type Input = ReturnType<typeof parse>;

function run() {
  let map = parse();
  for (let i = 0; i < 100; i++) {
    map = map.step();
  }

  console.log(
    `Lights On: ${map.lights.flatMap(l => l).filter(l => l.value === 1).length}`
  );
}

if (!module.parent) {
  run();
}
