import { parseInput } from '@utils/command';
import fs from 'fs';

function parse() {
  const input = fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');
  return JSON.parse(input);
}

export type Input = ReturnType<typeof parse>;

function count(value: any, ctx: { sum: number }) {
  if (typeof value === 'number') {
    ctx.sum += value;
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(v => count(v, ctx));
    return;
  }

  if (typeof value === 'object') {
    const values = Object.values(value);
    if (values.includes('red')) return;
    values.forEach(v => count(v, ctx));
  }
}

function run() {
  const obj = parse();
  let ctx = { sum: 0 };
  count(obj, ctx);

  console.log(`Sum: ${ctx.sum}`);
}

if (!module.parent) {
  run();
}
