import fs from 'fs';
import { parseInput } from '@utils/command';
import { sumBy } from 'lodash';

export const IllegalScore: { [key in Token]?: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

export const Pairs: { [key in Token]?: Token } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

export const isOpening = (token: Token) => Pairs[token] != null;

export type Token = '(' | ')' | '[' | ']' | '{' | '}' | '>' | '<';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map((l) => l.split('') as Token[]);

  return input;
}

export type Input = ReturnType<typeof parse>;

export function allIllegalScores(lines: Input) {
  return sumBy(lines, illegalScore);
}

export function illegalScore(line: Token[]) {
  let stack: Token[] = [];
  for (const token of line) {
    if (isOpening(token)) {
      stack.push(token);
    } else {
      const opening = stack.pop();
      if (token !== Pairs[opening!]) {
        return IllegalScore[token] ?? 0;
      }
    }
  }
  return 0;
}

function run() {
  const input = parse();
  const illegal = allIllegalScores(input);

  console.log(`Illegal score:`, illegal);
}

if (!module.parent) {
  run();
}
