import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input =
    parseInput() === 'test.txt'
      ? { min: { x: 20, y: -10 }, max: { x: 30, y: -5 } }
      : { min: { x: 70, y: -179 }, max: { x: 96, y: -124 } };

  return input;
}

export type Input = ReturnType<typeof parse>;
export type Pos = { x: number; y: number };

export function step(pos: Pos, velocity: Pos) {
  pos.x += velocity.x;
  pos.y += velocity.y;
  if (velocity.x !== 0) velocity.x += -velocity.x / Math.abs(velocity.x);
  velocity.y -= 1;
}

const pp = (p: Pos) => `(x=${p.x},y=${p.y})`;

export function trajectory(target: Input, velocity: Pos) {
  let pos: Pos = { x: 0, y: 0 };
  let maxHeight = 0;
  // console.log(`Velocity: ${pp(velocity)}`);
  while (pos.y > target.min.y) {
    step(pos, velocity);
    if (pos.y > maxHeight) maxHeight = pos.y;
    if (inArea(target, pos)) {
      // console.log(` --> OK! maxHeight=${maxHeight}`);
      return maxHeight;
    }
  }
  return -1;
}

function inArea(area: Input, pos: Pos) {
  return (
    pos.x >= area.min.x &&
    pos.x <= area.max.x &&
    pos.y >= area.min.y &&
    pos.y <= area.max.y
  );
}

function run() {
  const input = parse();
  let maxHeight = 0;
  for (let x = 1; x < 1000; x++) {
    for (let y = 1; y < 1000; y++) {
      maxHeight = Math.max(maxHeight, trajectory(input, { x, y }));
    }
  }

  console.log(`Max Height: ${maxHeight}`);
}

if (!module.parent) {
  run();
}
