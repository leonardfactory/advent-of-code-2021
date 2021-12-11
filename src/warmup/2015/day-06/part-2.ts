import { array2d } from '@utils/array';
import fs from 'fs';
import { flatten, sum } from 'lodash';
import { Input, parse } from './part-1';

export function ligthen(instructions: Input) {
  const grid = array2d<number>(1000);
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      grid[y][x] = 0;
    }
  }

  for (const instruction of instructions) {
    const { x1, x2, y1, y2 } = instruction.rect;
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        switch (instruction.action) {
          case 'turn_on':
            grid[y][x] += 1;
            break;
          case 'turn_off':
            if (grid[y][x] === 0) break;
            grid[y][x] -= 1;
            break;
          case 'toggle':
            grid[y][x] += 2;
            break;
        }
      }
    }
  }

  return sum(flatten(grid));
}

function run() {
  const instructions = parse();
  const brightness = ligthen(instructions);

  console.log(`Brightness: ${brightness}`);
}

if (!module.parent) {
  run();
}
