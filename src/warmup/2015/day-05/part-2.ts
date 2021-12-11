import fs from 'fs';
import { Input, parse } from './part-1';

export function countNice(words: Input) {
  return words.filter(isNice).length;
}

function isNice(word: string) {
  let hasMirror = false;
  let hasRepeat = false;
  for (let i = 0; i < word.length; i++) {
    if (!hasRepeat) {
      let current = word[i] + word[i + 1];
      for (let j = i + 2; j < word.length; j++) {
        if (word[j] + word[j + 1] === current) {
          hasRepeat = true;
          break;
        }
      }
    }

    if (i > 1 && word[i] === word[i - 2]) hasMirror = true;
  }

  return hasMirror && hasRepeat;
}

function run() {
  const words = parse();
  console.log(`Nice: ${countNice(words)}`);
}

if (!module.parent) {
  run();
}
