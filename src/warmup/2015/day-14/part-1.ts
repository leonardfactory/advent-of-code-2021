import fs from 'fs';
import { parseInput } from '@utils/command';
import { max, maxBy } from 'lodash';

export function parse() {
  // Vixen can fly 8 km/s for 8 seconds, but then must rest for 53 seconds.
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .replace(/can fly /g, '')
    .replace(/km\/s for /g, '')
    .replace(/seconds, but then must rest for /g, '')
    .replace(/seconds\./g, '')
    .split('\n')
    .map(raw => {
      const [name, speed, time, rest] = raw.split(' ');
      return {
        name,
        speed: parseInt(speed, 10),
        time: parseInt(time, 10),
        rest: parseInt(rest, 10)
      };
    });

  return input;
}

export type Input = ReturnType<typeof parse>;
export type Reindeer = Input[0];

export function simulate(reindeers: Input, steps: number) {
  const results = reindeers.map(reindeer => simulateReindeer(reindeer, steps));
  const winner = max(results);
  return winner;
}

export function simulateReindeer(reindeer: Reindeer, steps: number) {
  let cycles = Math.floor(steps / (reindeer.time + reindeer.rest));
  let remaining = steps % (reindeer.time + reindeer.rest);
  return (
    cycles * reindeer.speed * reindeer.time +
    Math.min(remaining, reindeer.time) * reindeer.speed
  );
}

function run() {
  const reindeers = parse();
  const winner = simulate(reindeers, 2503);

  console.log(`Winner: ${winner}`);
}

if (!module.parent) {
  run();
}
