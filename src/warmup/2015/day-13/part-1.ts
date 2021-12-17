import fs from 'fs';
import { parseInput } from '@utils/command';
import { uniq, without } from 'lodash';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .replace(/would /g, '')
    .replace(/happiness units by sitting next to /g, '')
    .replace(/\./g, '')
    .split('\n')
    .map(raw => {
      const [guest, type, amount, adjacent] = raw.split(' ');
      return {
        guest,
        amount: (type === 'gain' ? 1 : -1) * parseInt(amount, 10),
        adjacent
      };
    });

  return input;
}

function happinessMap(constraints: Input) {
  const map = new Map<string, Map<string, number>>();
  for (const constraint of constraints) {
    if (!map.has(constraint.guest)) map.set(constraint.guest, new Map());
    const adjacents = map.get(constraint.guest)!;
    adjacents.set(constraint.adjacent, constraint.amount);
  }
  return map;
}

export type Input = ReturnType<typeof parse>;
export type HappinessMap = ReturnType<typeof happinessMap>;

export function arrange(constraints: Input) {
  let guests = uniq(constraints.map(c => c.guest));
  let arrangements = permutations(guests);
  return arrangements;
}

export function findBestArrangement(
  arrangements: string[][],
  constraints: Input
) {
  const map = happinessMap(constraints);
  let best = 0;
  for (const arrangement of arrangements) {
    let score = evaluate(map, arrangement);
    if (score > best) best = score;
  }
  return best;
}

function permutations(guests: string[]) {
  if (guests.length === 0) return [[]];
  let perms: string[][] = [];
  for (let i = 0; i < guests.length; i++) {
    perms.push(
      ...permutations(without(guests, guests[i])).map(xs => [guests[i], ...xs])
    );
  }
  return perms;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function evaluate(map: HappinessMap, arrangement: string[]) {
  let score = 0;
  for (let i = 0; i < arrangement.length; i++) {
    let happiness = map.get(arrangement[i])!;
    score += happiness.get(arrangement[mod(i - 1, arrangement.length)])!;
    score += happiness.get(arrangement[mod(i + 1, arrangement.length)])!;
  }
  return score;
}

function run() {
  const constraints = parse();
  const arrangements = arrange(constraints);
  const best = findBestArrangement(arrangements, constraints);

  console.log(`Best: ${best}`);
}

if (!module.parent) {
  run();
}
