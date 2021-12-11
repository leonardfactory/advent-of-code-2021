import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n');

  return input;
}

export type Input = ReturnType<typeof parse>;

export const vowels = 'aeiou'.split('');
export const banned = ['ab', 'cd', 'pq', 'xy'];

export function countNice(words: Input) {
  return words.filter(isNice).length;
}

function isNice(word: string) {
  for (const ban of banned) {
    if (word.indexOf(ban) >= 0) return false;
  }

  let vowelsCount = 0;
  let hasDoubles = false;
  for (let i = 0; i < word.length; i++) {
    if (vowels.indexOf(word[i]) >= 0) vowelsCount++;
    if (i > 0 && word[i] === word[i - 1]) hasDoubles = true;
  }

  return hasDoubles && vowelsCount >= 3;
}

function run() {
  const words = parse();
  console.log(`Nice: ${countNice(words)}`);
}

if (!module.parent) {
  run();
}
