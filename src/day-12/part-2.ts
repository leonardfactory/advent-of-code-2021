import fs from 'fs';
import { Input, parse } from './part-1';

class Path {
  nodes: Map<string, number> = new Map();
  seq: string[] = [];

  constructor() {}

  add(node: string) {
    this.seq.push(node);
    this.nodes.set(node, (this.nodes.get(node) ?? 0) + 1);
  }

  canVisit(node: string) {
    if (node === 'start') return false;
    const count = this.nodes.get(node) ?? 0;
    return count < 2;
  }

  fork(node: string) {
    const next = new Path();
    next.nodes = new Map(this.nodes);
    next.seq = [...this.seq];
    next.add(node);
    return next;
  }
}

export function allPaths(graph: Input) {
  let paths: Path[] = [];
  visit(graph, new Path(), 'start', paths);
  // paths.forEach(path => console.log(path.seq.join(',')));
  return paths.length;
}

function visit(graph: Input, current: Path, node: string, paths: Path[]) {
  let path = current.fork(node);

  const smalls = Array.from(path.nodes.entries()).filter(
    ([cave, count]) => graph.smalls.has(cave) && count >= 2
  );
  if (smalls.length > 1) return;

  if (node === 'end') {
    paths.push(path);
    return;
  }

  const adjacents = graph.nodes.get(node)!;
  for (const adjacent of adjacents) {
    if (graph.smalls.has(adjacent) && !path.canVisit(adjacent)) {
      continue;
    }

    visit(graph, path, adjacent, paths);
  }
}

function run() {
  const graph = parse();
  const paths = allPaths(graph);

  console.log(`Paths: ${paths}`);
}

if (!module.parent) {
  run();
}
