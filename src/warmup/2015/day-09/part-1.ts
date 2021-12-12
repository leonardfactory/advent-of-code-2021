import fs from 'fs';
import { parseInput } from '@utils/command';
import { orderBy } from 'lodash';

export function parse() {
  const graph = new Graph();
  fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .forEach(raw => {
      const [edge, weight] = raw.split(' = ');
      const [from, to] = edge.split(' to ');
      graph.add(from, to, parseInt(weight, 10));
    });

  return graph;
}

export type Edge = { weight: number; to: string };

class Graph {
  nodes: Map<string, Edge[]> = new Map();

  constructor() {}

  add(from: string, to: string, weight: number) {
    if (!this.nodes.has(from)) this.nodes.set(from, []);
    const edgesFrom = this.nodes.get(from)!;
    edgesFrom.push({ weight, to });

    if (!this.nodes.has(to)) this.nodes.set(to, []);
    const edgesTo = this.nodes.get(to)!;
    edgesTo.push({ weight, to: from });
  }
}

export type Input = ReturnType<typeof parse>;

export class Path {
  distance = 0;
  cities: string[] = [];

  constructor() {}

  visited(city: string) {
    return this.cities.includes(city);
  }

  fork(edge: Edge) {
    let next = new Path();
    next.distance = this.distance + edge.weight;
    next.cities = [...this.cities, edge.to];
    return next;
  }
}

export function findShortest(graph: Input) {
  const starts = Array.from(graph.nodes.keys());
  let paths: Path[] = [];
  for (const start of starts) {
    follow(graph, new Path(), { weight: 0, to: start }, paths);
  }
  const ordered = orderBy(paths, p => p.distance);
  return ordered[0];
}

export function follow(graph: Input, prev: Path, edge: Edge, paths: Path[]) {
  if (prev.visited(edge.to)) return;
  const path = prev.fork(edge);

  if (path.cities.length === graph.nodes.size) {
    paths.push(path);
    return;
  }

  const adjacents = graph.nodes.get(edge.to)!;
  for (const adjacent of adjacents) {
    follow(graph, path, adjacent, paths);
  }
}

function run() {
  const graph = parse();
  const shortest = findShortest(graph);

  console.log(`Shortest: ${shortest.distance}`);
}

if (!module.parent) {
  run();
}
