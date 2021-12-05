import fs from 'fs';
import { Input, parse } from './part-1';

function ribbon(gifts: Input) {
  let total = 0;
  for (const gift of gifts) {
    const { w, l, h } = gift;
    const perimeter = Math.min(2 * (l + w), 2 * (w + h), 2 * (h + l));
    const amount = w * l * h + perimeter;
    total += amount;
  }
  return total;
}

function run() {
  const gifts = parse();
  console.log(`Ribbon feets: ${ribbon(gifts)}`);
}

if (!module.parent) {
  run();
}
