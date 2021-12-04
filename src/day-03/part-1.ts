import fs from 'fs';
import { parseInput } from '../utils/command';

function parse(row: string) {
  return row
    .split('')
    .reverse()
    .map((i) => parseInt(i, 10));
}

function power(numbers: number[][]) {
  const zeroCount = Array(numbers[0].length).fill(0);
  const totalCount = numbers.length;
  for (const number of numbers) {
    for (let i = 0; i < number.length; i++) {
      if (number[i] === 0) zeroCount[i]++;
    }
  }

  const gamma = zeroCount.map((z) => (z > totalCount / 2 ? 0 : 1));
  const epsilon = zeroCount.map((z) => (z > totalCount / 2 ? 1 : 0)); // invert

  return binToDec(gamma) * binToDec(epsilon);
}

function binToDec(bin: number[]) {
  return bin.reduce((dec, value, i) => dec + Math.pow(2, i) * value, 0);
}

function run() {
  const numbers = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(parse);

  console.log(`Power is ${power(numbers)}`);
}

if (!module.parent) {
  run();
}
