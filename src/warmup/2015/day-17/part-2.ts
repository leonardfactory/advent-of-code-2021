import fs from 'fs';
import { min, minBy, orderBy, sortBy, uniqBy, without } from 'lodash';
import { Container, Input, parse } from './part-1';

const eggnog = process.argv[2] === '--test' ? 25 : 150;

function combine(
  all: Container[],
  availables: Input,
  solutions: Container[][],
  current: Container[] = [],
  amount: number = 0
) {
  // console.log(`${amount} > ${availables.join(',')}`);
  if (amount === eggnog) {
    solutions.push(sortBy(current, c => c.i));
    return 1;
  }
  if (amount > eggnog) return 0;
  let sum = 0;
  for (let i = 0; i < availables.length; i++) {
    if (
      current.length > 0 &&
      availables[i].size > current[current.length - 1].size
    ) {
      continue; // uniq
    }

    const nextAvailables = availables.slice(0);
    nextAvailables.splice(i, 1);
    sum += combine(
      all,
      nextAvailables,
      solutions,
      [...current, availables[i]],
      amount + availables[i].size
    );
  }
  return sum;
}

function run() {
  let containers = parse();
  let solutions: Container[][] = [];
  const combinations = combine(containers, containers, solutions);
  solutions = uniqBy(solutions, s => s.map(s => s.i).join(','));
  const minimum = minBy(solutions, s => s.length);
  const quantity = solutions.filter(s => s.length === minimum!.length);
  // console.log(
  //   `Minimum comb:\n`,
  //   quantity.map(q => q.map(i => i.size).join(','))
  // );
  console.log(
    `Tot: ${solutions.length}, Min: ${minimum!.length}, Qty ${quantity.length}`
  );
}

if (!module.parent) {
  run();
}
