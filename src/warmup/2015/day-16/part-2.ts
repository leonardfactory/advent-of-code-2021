import fs from 'fs';
import { Aunt, constraints, Input, parse } from './part-1';

function matching(aunts: Input) {
  let availables: Aunt[] = [];
  for (const aunt of aunts) {
    let match = true;
    for (const key in constraints) {
      match = match && matches(key, aunt);
      if (!match) break;
    }
    if (match) availables.push(aunt);
  }
  return availables;
}

function matches(key: string, aunt: Aunt) {
  if (aunt.compounds[key] == null) return true;
  if (key === 'cats' || key === 'trees')
    return aunt.compounds[key] > constraints[key];
  if (key === 'pomeranians' || key === 'goldfish')
    return aunt.compounds[key] < constraints[key];
  return aunt.compounds[key] === constraints[key];
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
