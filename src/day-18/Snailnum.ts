import { clone, cloneDeep } from 'lodash';
import { FirstResult, iterateFirst, Path } from './iterate';
import { magnitude } from './magnitude';
import { reduce } from './reduce';
import { StringIterator } from './StringIterator';

export type Node = Pair | number;
export type Pair = {
  left: Node;
  right: Node;
};

export class Snailnum {
  constructor(public root: Pair) {}

  static parse(raw: string) {
    return new Snailnum(parsePair(new StringIterator(raw)));
  }

  add(other: Snailnum) {
    return new Snailnum({
      left: cloneDeep(this.root),
      right: cloneDeep(other.root)
    });
  }

  reduce() {
    reduce(this);
    return this;
  }

  magnitude() {
    return magnitude(this.root);
  }

  first(fn: (path: Path, node: Node) => boolean): FirstResult | undefined {
    return iterateFirst(this, fn);
  }

  print(node: number | Pair = this.root): string {
    if (typeof node === 'number') return node.toString();
    return `[${this.print(node.left)},${this.print(node.right)}]`;
  }
}

function parsePair(iter: StringIterator): Pair {
  let pair: Partial<Pair> = {};
  let char: string | undefined;
  while ((char = iter.next()) != null) {
    switch (char) {
      case '[': {
        pair[pair.left != null ? 'right' : 'left'] = parsePair(iter);
        break;
      }
      case ']': {
        if (pair.left == null || pair.right == null) {
          console.error(pair, iter.raw, iter.raw.slice(0, iter.cursor));
          throw new Error(`Cannot read pair!`);
        }
        return pair as Pair;
      }
      case ',':
        continue;
      default:
        pair[pair.left != null ? 'right' : 'left'] = Number(char);
    }
  }
  throw new Error('Invalid string');
}
