import fs from 'fs';
import { parseInput } from '@utils/command';
import { array2d } from '@utils/array';
import { flatten } from 'lodash';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .replace(/turn /g, 'turn_')
    .split('\n')
    .map(parseInstruction);

  return input;
}

function parseInstruction(raw: string) {
  const tokens = raw.split(' ');
  const origin = tokens[1].split(',').map(n => parseInt(n, 10));
  const target = tokens[3].split(',').map(n => parseInt(n, 10));
  if (target[0] < origin[0] || target[1] < origin[1]) {
    console.warn('woops', origin, target);
  }
  return {
    action: tokens[0] as 'turn_on' | 'turn_off' | 'toggle',
    rect: {
      x1: origin[0],
      y1: origin[1],
      x2: target[0],
      y2: target[1]
    }
  };
}

export type Input = ReturnType<typeof parse>;

export function ligthen(instructions: Input) {
  const grid = array2d(1000);
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
            grid[y][x] = 1;
            break;
          case 'turn_off':
            grid[y][x] = 0;
            break;
          case 'toggle':
            grid[y][x] = grid[y][x] === 1 ? 0 : 1;
            break;
        }
      }
    }
  }

  return flatten(grid).filter(c => c === 1).length;
}

function run() {
  const instructions = parse();
  const lightened = ligthen(instructions);

  console.log(`Lightened: ${lightened}`);
}

if (!module.parent) {
  run();
}
