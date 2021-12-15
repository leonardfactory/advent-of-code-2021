import fs from 'fs';
import { Input, Paper, parse } from './part-1';

function run() {
  const input = parse();
  let paper = new Paper(input);

  for (const fold of input.folds) {
    paper = paper.fold(fold);
  }
  paper.print();
}

if (!module.parent) {
  run();
}
