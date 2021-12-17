import fs from 'fs';
import { uniq } from 'lodash';
import { arrange, findBestArrangement, Input, parse } from './part-1';

export function addSanta(constraints: Input) {
  let guests = uniq(constraints.map(c => c.guest));
  for (const guest of guests) {
    constraints.push({ guest, amount: 0, adjacent: 'Santa' });
    constraints.push({ guest: 'Santa', amount: 0, adjacent: guest });
  }
}

function run() {
  const constraints = parse();
  addSanta(constraints);
  console.log('cs', constraints);
  const arrangements = arrange(constraints);
  const best = findBestArrangement(arrangements, constraints);

  console.log(`Best: ${best}`);
}

if (!module.parent) {
  run();
}
