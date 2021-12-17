import fs from 'fs';
import { maxBy } from 'lodash';
import { Input, parse, simulateReindeer } from './part-1';

type SimulatedReindeer = Input[0] & {
  score: number;
  position: number;
};

export function simulate(input: Input, steps: number) {
  let reindeers = input.map(
    r => ({ ...r, score: 0, position: 0 } as SimulatedReindeer)
  );

  for (let i = 1; i < steps + 1; i++) {
    let best = 0;
    for (const reindeer of reindeers) {
      reindeer.position = simulateReindeer(reindeer, i);
      if (reindeer.position > best) best = reindeer.position;
    }

    for (const reindeer of reindeers) {
      if (reindeer.position === best) {
        reindeer.score++;
      }
    }
  }

  return maxBy(reindeers, r => r.score);
}

function run() {
  const reindeers = parse();
  const winner = simulate(reindeers, 2503);

  console.log(`Winner: ${winner?.score}`);
}

if (!module.parent) {
  run();
}
