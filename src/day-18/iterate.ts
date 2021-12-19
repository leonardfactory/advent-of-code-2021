import { Node, Pair, Snailnum } from './Snailnum';

export type Ancestor = {
  side: keyof Pair;
  node: Pair;
};

export class Path {
  ancestors: Ancestor[] = [];

  get length() {
    return this.ancestors.length;
  }

  follow(node: Pair, side: keyof Pair) {
    let path = new Path();
    path.ancestors = [...this.ancestors, { node, side }];
    return path;
  }
}

export type FirstResult = {
  path: Path;
  node: Node;
};

export function iterateFirst(
  num: Snailnum,
  fn: (path: Path, node: Node) => boolean,
  path: Path = new Path(),
  node: Node = num.root
): FirstResult | undefined {
  if (fn(path, node)) {
    return { path, node };
  }
  if (typeof node === 'number') return;
  let left = iterateFirst(num, fn, path.follow(node, 'left'), node.left);
  if (left) return left;
  let right = iterateFirst(num, fn, path.follow(node, 'right'), node.right);
  if (right) return right;
}
