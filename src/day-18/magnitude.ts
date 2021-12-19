import { Node, Snailnum } from './Snailnum';

export function magnitude(node: Node): number {
  if (typeof node === 'number') return node;
  return 3 * magnitude(node.left) + 2 * magnitude(node.right);
}
