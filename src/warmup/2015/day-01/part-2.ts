import fs from 'fs';
import { parseInput } from '../../../utils/command';

export function floor(moves: string[]) {
  let floor = 0;
  for (let i = 0; i < moves.length; i++) {
    floor += moves[i] === '(' ? 1 : -1;
    if (floor === -1) return i + 1;
  }
  return floor;
}

function run() {
  const moves = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('');

  console.log(`-1 At: ${floor(moves)}`);
}

if (!module.parent) {
  run();
}
