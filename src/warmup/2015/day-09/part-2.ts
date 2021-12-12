import fs from 'fs';
import { orderBy } from 'lodash';
import { follow, Input, parse, Path } from './part-1';

export function findLongest(graph: Input) {
  const starts = Array.from(graph.nodes.keys());
  let paths: Path[] = [];
  for (const start of starts) {
    follow(graph, new Path(), { weight: 0, to: start }, paths);
  }
  const ordered = orderBy(paths, p => p.distance);
  return ordered[ordered.length - 1];
}

function run() {
  const graph = parse();
  const longest = findLongest(graph);

  console.log(`Longest: ${longest.distance}`);
}

if (!module.parent) {
  run();
}
