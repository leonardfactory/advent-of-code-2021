import { last } from 'lodash';
import { Path } from './iterate';
import { Pair, Snailnum } from './Snailnum';

export function reduce(num: Snailnum) {
  while (true) {
    if (explode(num)) continue;
    if (split(num)) continue;
    break;
  }
}

// 1. Explosion
export function explode(num: Snailnum) {
  const explode = num.first((path, node) => {
    return path.length >= 4 && typeof node !== 'number';
  });

  // No explosion found
  if (!explode) return false;

  let targetPair = explode.node as Pair;
  addSidemost(explode.path, 'left', targetPair.left as number);
  addSidemost(explode.path, 'right', targetPair.right as number);

  // Substituion
  let targetParent = last(explode.path.ancestors)!;
  targetParent.node[targetParent.side] = 0;
  // console.log(`it(exp) -> ${num.print()}`);
  return true;
}

function addSidemost(path: Path, targetSide: keyof Pair, value: number) {
  let pairs = path.ancestors.slice().reverse();
  for (let i = 0; i < pairs.length; i++) {
    let { side, node } = pairs[i];
    // console.log(` -> expl: (up) ${i}`, node);
    if (side === targetSide) continue;

    let parent = node;
    let key = targetSide;
    while (typeof parent[key] !== 'number') {
      // console.log(` -> expl: (tgt=${targetSide}) visiting ${key}`, { next: parent[key], parent }); // prettier-ignore
      parent = parent[key] as Pair;
      key = targetSide === 'left' ? 'right' : 'left';
    }
    parent[key] = (parent[key] as number) + value;
    break;
  }
}

// 2. Split
export function split(num: Snailnum) {
  let target = num.first((path, node) => {
    return typeof node === 'number' && node >= 10;
  });

  // No split found
  if (!target) return false;

  let value = target.node as number;
  let targetParent = last(target.path.ancestors)!;
  targetParent.node[targetParent.side] = {
    left: Math.floor(value / 2),
    right: Math.ceil(value / 2)
  };

  // console.log(`it(spl) -> ${num.print()}`);

  return true;
}
