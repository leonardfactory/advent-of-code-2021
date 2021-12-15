import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const tokens = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n\n');

  let width = 0;
  let height = 0;
  const dots = tokens[0].split('\n').map(raw => {
    const rawDot = raw.split(',');
    const dto = {
      x: parseInt(rawDot[0], 10),
      y: parseInt(rawDot[1], 10)
    };
    width = Math.max(width, dto.x);
    height = Math.max(height, dto.y);
    return dto;
  });
  width++;
  height++;

  const folds = tokens[1].split('\n').map(raw => {
    const [, , command] = raw.split(' ');
    const [axis, coord] = command.split('=');
    return {
      axis: axis as 'x' | 'y',
      coord: parseInt(coord, 10)
    };
  });

  return { dots, folds, width, height };
}

export type Input = ReturnType<typeof parse>;
export type Pos = Input['dots'][0];
export type Fold = Input['folds'][0];

export class Paper {
  map: string[][] = [];
  width!: number;
  height!: number;
  input!: Input;

  constructor(input?: Input) {
    if (input) {
      this.input = input;

      for (let y = 0; y < input.height; y++) {
        this.map[y] = [];
        this.map[y] = Array(input.width).fill('.');
      }

      this.width = input.width;
      this.height = input.height;

      for (const dot of input.dots) {
        this.map[dot.y][dot.x] = '#';
      }
    }
  }

  countDots() {
    let sum = 0;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.map[y][x] === '#') sum++;
      }
    }
    return sum;
  }

  print() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        process.stdout.write(this.map[y][x]);
      }
      process.stdout.write('\n');
    }
    process.stdout.write('\n');
  }

  fold(fold: Fold) {
    let next = new Paper();
    next.input = this.input;
    switch (fold.axis) {
      case 'x': {
        next.height = this.height;
        next.width = fold.coord;
        next.map = this.map.map(row => row.slice(0, fold.coord));

        for (let y = 0; y < this.height; y++) {
          for (let x = fold.coord + 1; x < this.width; x++) {
            let nx = fold.coord - (x - fold.coord);
            next.map[y][nx] =
              next.map[y][nx] === '#' || this.map[y][x] === '#' ? '#' : '.';
          }
        }

        return next;
      }
      case 'y': {
        next.height = fold.coord;
        next.width = this.width;
        next.map = this.map.slice(0, fold.coord).map(row => [...row]);

        for (let x = 0; x < this.width; x++) {
          for (let y = fold.coord + 1; y < this.height; y++) {
            let ny = fold.coord - (y - fold.coord);
            next.map[ny][x] =
              next.map[ny][x] === '#' || this.map[y][x] === '#' ? '#' : '.';
          }
        }

        return next;
      }
    }
  }
}

export function foldPaper(paper: Paper, fold: Fold) {}

function run() {
  const input = parse();
  let paper = new Paper(input);
  paper = paper.fold(input.folds[0]);

  console.log(`Visibles: ${paper.countDots()}`);
}

if (!module.parent) {
  run();
}
