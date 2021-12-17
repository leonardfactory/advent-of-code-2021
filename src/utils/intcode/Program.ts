import fs from 'fs';
import { IO } from './IO';

enum Commands {
  Add = 1,
  Multiply = 2,
  Input = 3,
  Output = 4,
  JumpIfTrue = 5,
  JumpIfFalse = 6,
  LessThan = 7,
  Equals = 8,
  SetRelative = 9,
  Stop = 99,
}

enum ParamModes {
  Address = '0',
  Immediate = '1',
  Relative = '2',
}

type Command = ReturnType<Program['command']>;

/**
 * Intcode Program. Contains runner and loader, plus IO integration.
 */
export class Program {
  static load(file: string, inputs: number[]) {
    const intcode = fs
      .readFileSync(file, 'utf8')
      .split(',')
      .map((c) => parseInt(c, 10));

    return new Program(intcode, inputs);
  }

  static test(file: string, inputs: number[]) {
    const tests = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map((test) => test.split(',').map((c) => parseInt(c, 10)))
      .map((test) => new Program(test, inputs));

    for (const test of tests) {
      console.log(`Test: ${test.run()} - ${test.io.outputs.join(',')}`);
    }
  }

  public readonly program: number[];
  public i = 0;
  public halt = false;
  public relativeBase = 0;
  public io: IO;
  public result: number | undefined;

  constructor(program: number[], inputs: number[]) {
    this.program = [...program];
    this.io = new IO(inputs, () => {
      // Ritorno del risultato parziale
      // console.log(`Restarting program with inputs `, this.io.inputs.join(','));
      const result = this.run();
      // console.log(`-> Restarting program with result `, result, '(prev -> ', this.result); // prettier-ignore
      this.result = result || this.result;
      return this.result;
    });
  }

  memory(address: number, value: number) {
    this.program[address] = value;
  }

  param(command: Command, paramIndex: number) {
    const mode = command.modes[paramIndex];
    const program = this.program;

    switch (mode) {
      case ParamModes.Immediate:
        return program[command.index + 1 + paramIndex];

      case ParamModes.Relative: {
        const offset = program[command.index + 1 + paramIndex];
        return program[this.relativeBase + offset];
      }

      case ParamModes.Address:
      default: {
        const address = program[command.index + 1 + paramIndex];
        if (!program[address]) program[address] = 0;
        return program[address];
      }
    }
  }

  paramOut(command: Command, paramIndex: number) {
    const mode = command.modes[paramIndex];
    const program = this.program;

    switch (mode) {
      case ParamModes.Relative: {
        const offset = program[command.index + 1 + paramIndex];
        return this.relativeBase + offset;
      }

      case ParamModes.Address:
      default: {
        const address = program[command.index + 1 + paramIndex];
        if (!program[address]) program[address] = 0;
        return address;
      }
    }
  }

  command(index: number) {
    const opcode = this.program[index];
    const digits = String(opcode);
    const modes = digits
      .substring(0, digits.length - 2)
      .split('')
      .reverse() as ParamModes[];
    const command = parseInt(digits.substr(digits.length - 2), 10) as Commands;

    return { command, modes, index };
  }

  run() {
    const { program, io } = this;

    let prev, command;
    while (this.i < program.length) {
      prev = command;

      if (program.some((p) => Number.isNaN(p))) {
        console.error(`Program crashed at`, prev, program.join(','));
        throw new Error('Crash program');
      }

      command = this.command(this.i);

      // console.log(`Opcode ${program[this.i]}`, command, program.join(','));
      switch (command.command) {
        // Somma
        case Commands.Add: {
          const [param1, param2, target] = [
            this.param(command, 0),
            this.param(command, 1),
            this.paramOut(command, 2),
          ];
          program[target] = param1 + param2;
          // console.log(`i[${i}] program: ${program.join(',')}`);
          this.i += 4;
          break;
        }

        // Moltiplicazione
        case Commands.Multiply: {
          const [param1, param2, target] = [
            this.param(command, 0),
            this.param(command, 1),
            this.paramOut(command, 2),
          ];
          program[target] = param1 * param2;
          this.i += 4;
          break;
        }

        // Input
        case Commands.Input: {
          const [target] = [
            // where to store inputted value
            this.paramOut(command, 0),
          ];
          const input = this.io.readInput();
          if (input == null) {
            return this.io.latestOutput();
          }
          program[target] = input;
          this.i += 2;
          break;
        }

        // Output
        case Commands.Output: {
          const [param1] = [
            // Value to output
            this.param(command, 0),
          ];
          // console.log('Output is', param1);
          this.io.sendOutput(param1);
          this.i += 2;
          break;
        }

        // Jump if true
        case Commands.JumpIfTrue: {
          const [param1, param2] = [
            this.param(command, 0),
            this.param(command, 1),
          ];
          if (param1 !== 0) {
            this.i = param2;
            break;
          }

          this.i += 3;
          break;
        }

        // Jump if false
        case Commands.JumpIfFalse: {
          const [param1, param2] = [
            this.param(command, 0),
            this.param(command, 1),
          ];
          if (param1 === 0) {
            this.i = param2;
            break;
          }

          this.i += 3;
          break;
        }

        // Less than
        case Commands.LessThan: {
          const [param1, param2, target] = [
            this.param(command, 0),
            this.param(command, 1),
            this.paramOut(command, 2),
          ];
          program[target] = param1 < param2 ? 1 : 0;

          this.i += 4;
          break;
        }

        // Equals
        case Commands.Equals: {
          const [param1, param2, target] = [
            this.param(command, 0),
            this.param(command, 1),
            this.paramOut(command, 2),
          ];
          program[target] = param1 === param2 ? 1 : 0;

          this.i += 4;
          break;
        }

        // Set Relative base
        case Commands.SetRelative: {
          const [param1] = [this.param(command, 0)];
          this.relativeBase += param1;
          this.i += 2;
          break;
        }

        // End Program
        case Commands.Stop:
          const finalOutput = this.io.outputs[this.io.outputs.length - 1];
          const otherOutputs = this.io.outputs.slice(
            0,
            this.io.outputs.length - 1
          );
          // console.log('Outputs: ', io.outputs);
          for (const o of otherOutputs) {
            // if (o.output !== 0)
            //   console.error(`Error on output "${o.i}": ${o.output}`);
          }
          this.halt = true;
          return finalOutput;

        default:
          throw new Error(`Command "${command}" not recognized.`);
      }
    }
  }
}
