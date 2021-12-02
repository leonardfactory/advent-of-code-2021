import fs from 'fs';
import { parseInput } from '../utils/command';

export type Dir = [x: number, y: number];
export type Pos = [x: number, y: number];
export type Move = ReturnType<typeof parse>;

const Directions = {
  forward: [1, 0] as Dir,
  down: [0, 1] as Dir,
  up: [0, -1] as Dir
};

export function parse(row: string) {
  const [direction, amount] = row.split(' ');
  return {
    direction: Directions[direction as keyof typeof Directions],
    amount: parseInt(amount, 10)
  };
}

function calculatePosition(moves: Move[]) {
  let pos: Pos = [0, 0];
  for (const move of moves) {
    pos[0] += move.amount * move.direction[0];
    pos[1] += move.amount * move.direction[1];
  }
  return pos;
}

function run() {
  const moves = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(parse);

  const pos = calculatePosition(moves);

  console.log(`Pos is ${pos}, mul is: ${pos[0] * pos[1]}`);
}

if (!module.parent) {
  run();
}
