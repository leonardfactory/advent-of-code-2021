import fs from 'fs';
import { parseInput } from '@utils/command';
import { groupBy, sortBy, toPairs, without } from 'lodash';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((n, i) => ({ size: Number(n), i }));

  return input;
}

export type Input = ReturnType<typeof parse>;
export type Container = Input[0];

const eggnog = 150; // 150;

export function findCombinations(containers: Input) {
  containers = sortBy(containers, c => -c);

  return combine(containers, containers, { size: Infinity, i: Infinity }, 0);
}

function combine(
  all: Container[],
  availables: Input,
  current: Container,
  amount: number
) {
  // console.log(`${amount} > ${availables.join(',')}`);
  if (amount === eggnog) {
    // console.log(`--> ${availables.join(',')}`);
    return 1;
  }
  if (amount > eggnog) return 0;
  let sum = 0;
  for (let i = 0; i < availables.length; i++) {
    if (
      availables[i].size > current.size ||
      (availables[i].size === current.size &&
        all.indexOf(availables[i]) > current.i)
    ) {
      continue; // uniq
    }

    const nextAvailables = availables.slice(0);
    nextAvailables.splice(i, 1);
    sum += combine(
      all,
      nextAvailables,
      availables[i],
      amount + availables[i].size
    );
  }
  return sum;
}

function run() {
  const containers = parse();
  const count = findCombinations(containers);

  console.log(`Output: ${count}`);
}

if (!module.parent) {
  run();
}
