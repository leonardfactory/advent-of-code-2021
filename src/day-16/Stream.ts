import { parseInput } from '@utils/command';
import chalk from 'chalk';
import fs from 'fs';
import { parsePacket } from './Packet';

export class Stream {
  cursor = 0;
  constructor(public raw: (0 | 1)[]) {}

  static fromInput() {
    const input =
      process.argv[2] === '--stream'
        ? process.argv[3]
        : fs.readFileSync(__dirname + '/' + parseInput(), 'utf-8');

    const raw = input.split('').flatMap(v => Tokens[v as TokenKeys]);
    // console.log(`Stream: ${input} ${raw.join('')}`);

    return new Stream(raw);
  }

  parse() {
    return parsePacket(this);
  }

  highlight(from: number, to: number) {
    return (
      this.raw.slice(0, from).join('') +
      chalk.cyan(this.raw.slice(from, to).join('')) +
      this.raw.slice(to).join('') +
      ` (from=${from}, to=${to})`
    );
  }

  read(count: number) {
    if (this.cursor + count > this.raw.length) throw new Error(`Out of Bounds`);
    const bits = this.raw.slice(this.cursor, this.cursor + count);
    this.cursor += count;
    return bits;
  }

  readNumber(count: number) {
    const bits = this.read(count);
    // console.log(`bits (${this.cursor}): ${bits.join(',')}`);
    return this.decode(bits);
  }

  /** Advance cursor to last hexadecimal */
  closeCursor() {
    let prevCursor = this.cursor;
    const offset = this.cursor % 4;
    if (offset !== 0) this.cursor += 4 - offset;
    console.log(`(stream.closeCursor) offset=${offset}, prev: ${prevCursor}, now: ${this.cursor}`); // prettier-ignore
  }

  decode(bits: number[]) {
    return bits.reduce(
      (dec, value, i) => dec + Math.pow(2, bits.length - i - 1) * value,
      0
    );
  }
}

export const Tokens = {
  '0': [0, 0, 0, 0],
  '1': [0, 0, 0, 1],
  '2': [0, 0, 1, 0],
  '3': [0, 0, 1, 1],
  '4': [0, 1, 0, 0],
  '5': [0, 1, 0, 1],
  '6': [0, 1, 1, 0],
  '7': [0, 1, 1, 1],
  '8': [1, 0, 0, 0],
  '9': [1, 0, 0, 1],
  A: [1, 0, 1, 0],
  B: [1, 0, 1, 1],
  C: [1, 1, 0, 0],
  D: [1, 1, 0, 1],
  E: [1, 1, 1, 0],
  F: [1, 1, 1, 1]
} as const;
type TokenKeys = keyof typeof Tokens;
