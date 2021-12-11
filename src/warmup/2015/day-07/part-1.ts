import fs from 'fs';
import { parseInput } from '@utils/command';

export function parse() {
  const input = fs
    .readFileSync(__dirname + '/' + parseInput(), 'utf-8')
    .split('\n')
    .map(parseInstruction);

  return input;
}

function parseInstruction(raw: string) {
  const [command, target] = raw.split(' -> ');
  return {
    ...parseCommand(command),
    target,
    cached: null as number | null,
    raw
  };
}

function parseCommand(raw: string) {
  const binary = raw.match(/^(\w+) (AND|OR) (\w+)$/);
  if (binary) {
    return {
      op: binary[2] as 'AND' | 'OR',
      left: binary[1],
      right: binary[3]
    };
  }

  const shift = raw.match(/^(\w+) (LSHIFT|RSHIFT) (\d+)$/);
  if (shift) {
    return {
      op: shift[2] as 'LSHIFT' | 'RSHIFT',
      wire: shift[1],
      value: parseInt(shift[3], 10)
    };
  }

  const not = raw.match(/^NOT (\w+)$/);
  if (not) {
    return {
      op: 'NOT' as const,
      wire: not[1]
    };
  }

  const wire = raw.match(/^([a-z]+)$/);
  if (wire) {
    return {
      op: 'REDIR' as const,
      wire: wire[1]
    };
  }

  return {
    op: 'SET' as const,
    value: parseInt(raw.trim(), 10)
  };
}

export type Input = ReturnType<typeof parse>;
export type Command = Input[0];
export type Circuit = Map<string, Command>;

export function emulate(input: Input) {
  let circuit: Circuit = new Map();
  for (const command of input) {
    circuit.set(command.target, command);
  }

  return valueAt(circuit, 'a');
}

function valueAt(circuit: Circuit, node: string): number {
  if (/^\d+$/.test(node)) return parseInt(node, 10);

  const command = circuit.get(node)!;
  if (command.cached) return command.cached;
  switch (command.op) {
    case 'AND': {
      command.cached =
        valueAt(circuit, command.left) & valueAt(circuit, command.right);
      break;
    }

    case 'OR': {
      command.cached =
        valueAt(circuit, command.left) | valueAt(circuit, command.right);
      break;
    }

    case 'NOT': {
      command.cached = Math.pow(2, 16) - valueAt(circuit, command.wire) - 1;
      break;
    }

    case 'SET': {
      command.cached = command.value;
      break;
    }

    case 'REDIR': {
      command.cached = valueAt(circuit, command.wire);
      break;
    }

    case 'RSHIFT': {
      command.cached = valueAt(circuit, command.wire) >> command.value;
      break;
    }

    case 'LSHIFT': {
      command.cached = valueAt(circuit, command.wire) << command.value;
      break;
    }
  }
  console.log(`${command.raw} : ${command.cached}`);
  return command.cached;
}

function run() {
  const input = parse();
  const value = emulate(input);

  console.log(`Value at A: ${value}`);
}

if (!module.parent) {
  run();
}
