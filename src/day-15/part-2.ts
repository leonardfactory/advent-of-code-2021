import fs from 'fs';
import { Input, lowestRisk, parse, Path, printPath } from './part-1';

function repeat(map: Input) {
  let dest: Input = Array(map.length * 5)
    .fill(null)
    .map(r => Array(map[0].length * 5).fill(null));

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map.length; y++) {
          const nx = x + map.length * i;
          const ny = y + map.length * j;
          const risk = map[y][x].risk + i + j;
          dest[ny][nx] = {
            risk: risk <= 9 ? risk : risk - 9,
            x: nx,
            y: ny
          };
        }
      }
    }
  }

  return dest;
}

function run() {
  const source = parse();
  const map = repeat(source);
  const path = lowestRisk(map);
  // printPath(map, path!);

  console.log(`Lowest Risk: ${path!.risk}`);
}

if (!module.parent) {
  run();
}
