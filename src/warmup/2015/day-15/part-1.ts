import fs from 'fs';
import { parseInput } from '@utils/command';
import { fromPairs, map, without } from 'lodash';

export function parse() {
  // Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(raw => {
      const [name, props] = raw.split(': ');
      return {
        name,
        props: fromPairs(
          props
            .split(', ')
            .map(p => p.split(' '))
            .map(([key, value]) => [key, Number(value)])
        ) as Props
      };
    });

  return input;
}

export type Input = ReturnType<typeof parse>;
export type Ingredient = Input[0];

export function maximize(ingredients: Input, used: Ingredient[]) {
  let best: Map<Ingredient, number>;
  let bestScore = 0;
  for (let i = 0; i < ingredients.length; i++) {
    maximize(ingredients, [ingredients[i]]);
  }
}

export type Props = {
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
};
const PropKeys = [
  'capacity',
  'durability',
  'flavor',
  'texture'
] as (keyof Props)[];

function cookieScore(solution: Map<Ingredient, number>) {
  let score = 1;
  for (const prop of PropKeys) {
    let propScore = 0;
    for (const [ingredient, quantity] of solution) {
      propScore += quantity * ingredient.props[prop];
    }
    score = score * propScore;
  }
  return score;
}

function run() {
  const ingredients = parse();
  findBest(ingredients);

  console.log(`Output:`);
}

if (!module.parent) {
  run();
}
