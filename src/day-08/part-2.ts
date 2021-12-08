import { sign } from 'crypto';
import fs, { write } from 'fs';
import { conformsTo, sortBy, without } from 'lodash';
import { Input, parse, Pattern } from './part-1';

export function total(patterns: Input) {
  let sum = 0;
  for (const pattern of patterns) {
    const solution = resolve(pattern);
    const value = calculate(solution, pattern.outputs as Wire[][]);
    console.log('Value is ', value);
    sum += value;
  }
  return sum;
}

function calculate(segments: string[], digits: Wire[][]) {
  let final = 0;
  for (let i = 0; i < digits.length; i++) {
    const digitStr = digits[i].sort((a, b) => a.localeCompare(b)).join('');
    const value = segments.indexOf(digitStr);
    final += value * Math.pow(10, digits.length - i - 1);
  }
  return final;
}

const Segments = [
  ['a', 'b', 'c', 'e', 'f', 'g'],
  ['c', 'f'],
  ['a', 'c', 'd', 'e', 'g'],
  ['a', 'c', 'd', 'f', 'g'],
  ['b', 'c', 'd', 'f'],
  ['a', 'b', 'd', 'f', 'g'],
  ['a', 'b', 'd', 'e', 'f', 'g'],
  ['a', 'c', 'f'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'f', 'g']
] as Wire[][];

type Wire = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type Solution = { [K in Wire]: Wire | null };

function resolve(pattern: Pattern) {
  let { signals } = pattern;
  const solution: Solution = {
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    g: null
  };
  signals = sortBy(signals, (s) => s.length);

  const finalSolutions = [] as Solution[];
  resolveSignal(signals as Wire[][], solution, Segments, finalSolutions);
  const finalSolution = finalSolutions[0];

  const remappedSegments = Segments.map((s) =>
    s
      .map((m) => finalSolution[m]!)
      .sort((a, b) => a!.localeCompare(b!))
      .join('')
  );

  return remappedSegments;
}

function resolveSignal(
  signals: Wire[][],
  solution: Solution,
  segments: Wire[][],
  stack: Solution[]
) {
  if (signals.length === 0) {
    console.log('final', solution);
    if (Object.values(solution).filter((s) => s != null).length === 7) {
      stack.push(solution);
    }
    return true;
  }

  const [signal, ...otherSignals] = signals;
  const matches = segments.filter((s) => s.length === signal.length);
  if (matches.length === 0) return false;

  const solutionWires = Object.values(solution);
  // console.log(' -> sol is', solution);

  for (const match of matches) {
    console.log('matching -> ', match.join(','), ' as ', signal.join(','));
    const nextSegments = without(segments, match);

    let invalidSolution = false;
    for (const m of match) {
      if (solution[m] != null && !signal.includes(solution[m]!)) {
        invalidSolution = true;
        break;
      }
    }
    if (invalidSolution) continue;

    const unassignedSegments = match.filter((m) => !solution[m]);
    const unassignedInWire = signal.filter((m) => !solutionWires.includes(m));
    const unassignedInWirePerms = permutations(unassignedInWire);

    for (const perm of unassignedInWirePerms) {
      const nextSolution = { ...solution };
      for (let i = 0; i < perm.length; i++) {
        nextSolution[unassignedSegments[i]] = perm[i];
      }
      const found = resolveSignal(
        otherSignals,
        nextSolution,
        nextSegments,
        stack
      );
      if (found) return true;
    }
  }
}

function permutations(wires: Wire[]) {
  if (wires.length === 0) return [[]];
  let perms: Wire[][] = [];
  for (let i = 0; i < wires.length; i++) {
    perms.push(
      ...permutations(without(wires, wires[i])).map((ws) => [wires[i], ...ws])
    );
  }
  return perms;
}

function run() {
  const patterns = parse();
  const sum = total(patterns);

  console.log(`Output: ${sum}`);
}

if (!module.parent) {
  run();
}
