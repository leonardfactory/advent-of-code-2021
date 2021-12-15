import fs from 'fs';
import { parseInput } from '@utils/command';
import { Dictionary, fromPairs, orderBy, toPairs, values } from 'lodash';

export function parse() {
  let [template, rules] = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n\n');

  if (process.argv[3] === '--template') {
    template = process.argv[4];
  }

  return {
    template,
    rules: fromPairs(
      rules.split('\n').map(rule => {
        return rule.split(' -> ') as [string, string];
      })
    )
  };
}

export type Input = ReturnType<typeof parse>;
export type Rules = Input['rules'];

export function apply(template: string, rules: Rules) {
  let next: string = '';
  for (let i = 0; i < template.length - 1; i++) {
    next += template[i];
    const rule = rules[template[i] + template[i + 1]];
    if (rule) next += rule;
  }
  next += template[template.length - 1];
  return next;
}

export function scoring(template: string) {
  let scores: Dictionary<number> = {};
  for (let i = 0; i < template.length; i++) {
    scores[template[i]] = (scores[template[i]] ?? 0) + 1;
  }
  console.log('scores', scores);
  const ordered = orderBy(values(scores));
  return ordered[ordered.length - 1] - ordered[0];
}

function run() {
  let { template, rules } = parse();
  for (let i = 0; i < 10; i++) {
    template = apply(template, rules);
    // console.log(`Step ${i + 1}: ${template}`);
  }

  console.log(`Score: ${scoring(template)}`);
}

if (!module.parent) {
  run();
}
