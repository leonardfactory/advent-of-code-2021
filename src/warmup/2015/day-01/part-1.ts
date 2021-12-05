import fs from 'fs';
import { parseInput } from '../../../utils/command';

export function floor(moves: string[]) {
  let floor = 0;
  for (const move of moves) {
    floor += move === '(' ? 1 : -1;
  }
  return floor;
}

function run() {
  const moves = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('');

  console.log(`Floor: ${floor(moves)}`);
}

if (!module.parent) {
  run();
}
