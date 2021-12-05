import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((raw) => {
      const sizes = raw.split('x').map((x) => parseInt(x, 10));
      return {
        w: sizes[0],
        l: sizes[1],
        h: sizes[2]
      };
    });

  return input;
}

export type Input = ReturnType<typeof parse>;

export function paper(gifts: Input) {
  let total = 0;
  for (const gift of gifts) {
    const { w, l, h } = gift;
    const slack = Math.min(l * w, w * h, h * l);
    const amount = 2 * l * w + 2 * w * h + 2 * h * l + slack;
    total += amount;
  }
  return total;
}

function run() {
  const gifts = parse();
  console.log(`Paper: ${paper(gifts)}`);
}

if (!module.parent) {
  run();
}
