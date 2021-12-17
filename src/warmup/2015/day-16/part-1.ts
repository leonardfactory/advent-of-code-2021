import fs from 'fs';
import { parseInput } from '@utils/command';
import { Dictionary, fromPairs } from 'lodash';

export function parse() {
  // Sue 1: cars: 9, akitas: 3, goldfish: 0
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((raw, i) => {
      const colon = raw.indexOf(':');
      const compounds = raw
        .slice(colon + 2)
        .split(', ')
        .map(compound => {
          const [name, value] = compound.split(': ');
          return [name, Number(value)];
        });
      return {
        i: i + 1,
        compounds: fromPairs(compounds) as Dictionary<number>
      };
    });

  return input;
}

export const constraints: Dictionary<number> = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

export type Input = ReturnType<typeof parse>;
export type Aunt = Input[0];

export function matching(aunts: Input) {
  let availables: Aunt[] = [];
  for (const aunt of aunts) {
    let match = true;
    for (const key in constraints) {
      match =
        match &&
        (aunt.compounds[key] == null ||
          aunt.compounds[key] === constraints[key]);
      if (!match) break;
    }
    if (match) availables.push(aunt);
  }
  return availables;
}

function run() {
  const aunts = parse();

  console.log(
    `Availables:\n ${matching(aunts)
      .map(aunt => aunt.i + ': ' + JSON.stringify(aunt.compounds))
      .join('\n')}`
  );
}

if (!module.parent) {
  run();
}
