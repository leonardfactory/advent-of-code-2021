import { parseInput } from '@utils/command';
import { Program } from '@utils/intcode/Program';
import fs from 'fs';

const program = Program.load(__dirname + '/' + parseInput(), []);
program.run();
console.log(
  `Output: `,
  program.io
    .readOutputs()
    .map(c => String.fromCharCode(c))
    .join('')
);
