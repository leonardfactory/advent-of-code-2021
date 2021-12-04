import fs from 'fs';
import { parseInput } from '../utils/command';

function parse(row: string) {
  return row.split('').map((i) => parseInt(i, 10));
}

function bitCriteria(type: 'max' | 'min', numbers: number[][], at: number) {
  let zeroCount = 0;
  for (let number of numbers) {
    if (number[at] === 0) zeroCount++;
  }
  if (zeroCount === numbers.length / 2) return type === 'max' ? 1 : 0;

  const mostCommon = zeroCount > numbers.length / 2 ? 0 : 1;
  return type === 'max' ? mostCommon : Math.abs(mostCommon - 1);
}

function findRating(numbers: number[][], type: 'max' | 'min') {
  let pool = [...numbers];
  for (let i = 0; i < numbers[0].length; i++) {
    let next = [] as number[][];
    const criteria = bitCriteria(type, pool, i);
    console.log(
      `Type ${type}: n.${pool.length}, index=${i} criteria=${criteria}`
    );

    // filter numbers by bit criteria. criteria contains evaluated
    // bits for CO2 / oxygen
    for (let j = 0; j < pool.length; j++) {
      if (pool[j][i] === criteria) next.push(pool[j]);
    }

    pool = next;

    if (pool.length === 1) {
      return pool[0];
    }
  }

  throw new Error('Cannot find rating');
}

function binToDec(bin: number[]) {
  return bin.reduce(
    (dec, value, i) => dec + Math.pow(2, bin.length - i - 1) * value,
    0
  );
}

function run() {
  const numbers = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(parse);

  const oxygen = binToDec(findRating(numbers, 'max'));
  const co2 = binToDec(findRating(numbers, 'min'));

  console.log(`Oxygen: ${oxygen}, CO2: ${co2}, mul: ${co2 * oxygen}`);
}

if (!module.parent) {
  run();
}
