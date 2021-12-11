import fs from 'fs';
import { orderBy, sortBy } from 'lodash';
import { illegalScore, Input, isOpening, Pairs, parse, Token } from './part-1';

export function repair(lines: Input) {
  let scores: number[] = [];
  for (const line of lines) {
    if (illegalScore(line) > 0) continue;
    const repaired = repairLine(line);
    const score = repaired.reduce((s, points) => s * 5 + points, 0);
    console.log('repaired score: ', score);
    scores.push(score);
  }

  return sortBy(scores, (s) => s)[Math.ceil(scores.length / 2) - 1];
}

const RepairScore: { [Key in Token]?: number } = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
};

function repairLine(line: Token[]) {
  let stack: Token[] = [];
  for (const token of line) {
    if (isOpening(token)) {
      stack.push(token);
    } else {
      // Always correct
      const opening = stack.pop();
    }
  }
  stack.reverse();
  console.log('solution', stack.join(','));
  return stack.map((t) => RepairScore[Pairs[t]!]!);
}

function run() {
  const lines = parse();
  const middleScore = repair(lines);

  console.log(`Middle score: ${middleScore}`);
}

if (!module.parent) {
  run();
}
