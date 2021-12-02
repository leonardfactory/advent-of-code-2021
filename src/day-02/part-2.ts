import fs from 'fs';
import { parseInput } from '../utils/command';
import { Move, parse, Pos } from './part-1';

function calculatePosition(moves: Move[]) {
  let pos: Pos = [0, 0];
  let aim = 0;
  for (const move of moves) {
    pos[0] += move.amount * move.direction[0];
    aim += move.amount * move.direction[1];

    if (move.direction[0] !== 0) {
      pos[1] += move.amount * aim;
    }
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
