import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const graph = new Graph();
  fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .forEach(raw => {
      const [from, to] = raw.split('-');
      graph.add(from, to);
    });

  return graph;
}

export class Graph {
  nodes: Map<string, string[]> = new Map();
  smalls: Set<string> = new Set();

  constructor() {}

  add(from: string, to: string) {
    if (!this.nodes.has(from)) this.nodes.set(from, []);
    const edgesFrom = this.nodes.get(from)!;
    edgesFrom.push(to);

    if (!this.nodes.has(to)) this.nodes.set(to, []);
    const edgesTo = this.nodes.get(to)!;
    edgesTo.push(from);

    if (from.toLowerCase() === from) this.smalls.add(from);
    if (to.toLowerCase() === to) this.smalls.add(to);
  }
}

export type Input = ReturnType<typeof parse>;

class Path {
  nodes: Set<string> = new Set();
  seq: string[] = [];

  constructor() {}

  add(node: string) {
    this.seq.push(node);
    this.nodes.add(node);
  }

  fork(node: string) {
    const next = new Path();
    next.nodes = new Set(this.nodes);
    next.seq = [...this.seq];
    next.add(node);
    return next;
  }
}

export function allPaths(graph: Input) {
  let paths: Path[] = [];
  visit(graph, new Path(), 'start', paths);
  paths.forEach(path => console.log(path.seq.join(',')));
  return paths.length;
}

function visit(graph: Input, current: Path, node: string, paths: Path[]) {
  let path = current.fork(node);
  if (node === 'end') {
    paths.push(path);
    return;
  }

  const adjacents = graph.nodes.get(node)!;
  for (const adjacent of adjacents) {
    if (
      graph.smalls.has(adjacent) &&
      path.nodes.has(adjacent) &&
      adjacent !== 'end'
    ) {
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
