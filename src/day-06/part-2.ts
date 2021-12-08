import fs from 'fs';
import { Input, parse } from './part-1';

function generation(timer: number, days: number) {
  let count = 1;
  let spawning: number[] = Array(days).fill(0);
  spawning[timer] = 1;
  for (let i = timer + 7; i < days; i += 7) {
    spawning[i] = 1;
  }

  for (let i = 0; i < days; i++) {
    let spawned = spawning[i];
    let children = Math.floor((days - i - 9) / 7);
    if (i + 9 < days) {
      spawning[i + 9] += spawned;
      for (let j = 1; j <= children; j++) {
        spawning[i + j * 7 + 9] += spawned;
      }
    }
    console.log(`[Day ${i + 1}] Spawned ${spawned}, children ${children}`);
    count += spawned;
  }
  return count;
}

/**
 * child(spawn_at) =  (days - spawn_at - 9) / 7 + 1;
 */
export function analytic(fishes: Input, days: number) {
  const initial = fishes.length;
  let total = 0;
  for (let i = 0; i < initial; i++) {
    let children = generation(fishes[i], days);
    total += children;
  }
  return total;
}

function run() {
  const fishes = parse();

  // console.log(`After 80 days: ${analytic(fishes, 80)}`);
  console.log(`After 256 days: ${analytic(fishes, 256)}`);
}

if (!module.parent) {
  run();
}
