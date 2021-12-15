import fs from 'fs';
import { Dictionary, mergeWith, orderBy, toPairs, uniq, values } from 'lodash';
import { apply, Input, parse, Rules } from './part-1';

type Scores = Dictionary<number>;

/**
 * Espansione
 *   e(1,2,3) = e(1,2) + e(2,3).slice(1) + e(3,4).slice(1)
 *   e(NBB) = e(NB) + e-(BB)
 *   e(NBB, n=2) = e(NB, n=2) + e-(BB, n=2)
 *               = e(NBB, n=1) + e-(BNB, n=1)
 *               = e(NB) + e-(BB) + e-(BN) + e-(NB)
 *               = NBBN(BN)BBNBB
 *
 *  e(NBB) = e(NB) + e-(BB)
 *           NBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBB + (B)NBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNB =
 *           NBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNB
 *        vs NBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNBBNB
 *
 * Lunghezza
 *  len(str, n)  = 2 (2 (2len - 1) - 1) - 1 # i.e. n=3
 *               = 2 (4len - 3) - 1
 *               = 8len - 7
 *               = Math.pow(2, n) * str.length - (Math.pow(2, n) - 1)
 */

function expandedScore(original: string, rules: Rules) {
  let cache: Dictionary<{ expansion: string; scores: Scores }> = {};
  let iterationsCache: Record<number, Dictionary<Scores>> = {};
  let steps = 40;
  let iterations = 8;
  let stepsPerIteration = steps / iterations;
  // let score: Scores = {};

  function iterate(template: string) {
    if (!cache[template]) {
      let expansion = template;
      for (let i = 0; i < stepsPerIteration; i++) {
        expansion = apply(expansion, rules);
      }

      cache[template] = {
        expansion,
        scores: scoring(expansion)
      };
    }

    return cache[template];
  }

  function getIterationCache(iteration: number, template: string) {
    if (!iterationsCache[iteration]) iterationsCache[iteration] = {};
    return iterationsCache[iteration][template];
  }

  function expand(template: string, iteration: number) {
    const iterationCache = getIterationCache(iteration, template);
    if (iterationCache) return iterationCache;

    const expansion = iterate(template);
    if (iteration === iterations - 1) return expansion.scores;

    let scores: Scores = {};
    for (let i = 0; i < expansion.expansion.length - 1; i++) {
      const nested = expand(
        expansion.expansion[i] + expansion.expansion[i + 1],
        iteration + 1
      );
      scores = sumScores(scores, nested);
    }

    iterationsCache[iteration][template] = scores;
    return scores;
  }

  const final = expand(original, 0);
  final[original[0]]++;
  return final;
}

function scoring(template: string) {
  let scores: Dictionary<number> = {};
  for (let i = 0; i < template.length; i++) {
    scores[template[i]] = (scores[template[i]] ?? 0) + 1;
  }
  scores[template[0]]--;
  return scores;
}

function sumScores(a: Scores, b: Scores) {
  return mergeWith(a, b, (av, bv) => (av ?? 0) + (bv ?? 0));
}

function parseSteps() {
  if (process.argv[5] == '--step') return Number(process.argv[6]);
  return 5;
}

function run() {
  const { template, rules } = parse();
  const score = expandedScore(template, rules);

  const ordered = orderBy(values(score));
  const finalScore = ordered[ordered.length - 1] - ordered[0];

  console.log(`Score: ` + finalScore + '\n', score);
}

if (!module.parent) {
  run();
}
