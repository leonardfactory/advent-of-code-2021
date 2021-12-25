use core::panic;
use std::cmp;
use std::io;

use crate::part1::Instruction::*;
use crate::part1::Value::*;
use assert_matches::assert_matches;
use itertools::Itertools;

pub fn part1() {}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Value {
    Variable(usize),
    Integer(i32),
}

pub const W: usize = 0;
pub const X: usize = 1;
pub const Y: usize = 2;
pub const Z: usize = 3;

impl Value {
    fn parse(s: &str) -> Self {
        match s {
            "w" => Variable(W),
            "x" => Variable(X),
            "y" => Variable(Y),
            "z" => Variable(Z),
            _ => Integer(s.parse().unwrap()),
        }
    }

    fn parse_as_var(s: &str) -> usize {
        Self::parse(s).as_var()
    }

    fn as_var(&self) -> usize {
        match *self {
            Variable(i) => i,
            _ => panic!("tried force casting but it is an integer"),
        }
    }
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Instruction {
    Inp(usize),
    Add(usize, Value),
    Mul(usize, Value),
    Div(usize, Value),
    Mod(usize, Value),
    Eql(usize, Value),
}

impl Instruction {
    pub fn parse(s: &str) -> Self {
        match s.trim().split(' ').collect_vec()[..] {
            ["inp", v] => Inp(Value::parse_as_var(v)),
            ["add", v, a] => Add(Value::parse_as_var(v), Value::parse(a)),
            ["mul", v, a] => Mul(Value::parse_as_var(v), Value::parse(a)),
            ["div", v, a] => Div(Value::parse_as_var(v), Value::parse(a)),
            ["mod", v, a] => Mod(Value::parse_as_var(v), Value::parse(a)),
            ["eql", v, a] => Eql(Value::parse_as_var(v), Value::parse(a)),
            _ => panic!("unknown instr: {}", s),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Memory {
    input_cursor: usize,
    input: Vec<i32>,
    pub vars: [i32; 4],
}

impl Memory {
    pub fn eval(&self, value: Value) -> i32 {
        match value {
            Variable(i) => self.vars[i],
            Integer(v) => v,
        }
    }

    pub fn get_var(&self, i: usize) -> i32 {
        self.vars[i]
    }
}

pub struct Program {
    instructions: Vec<Instruction>,
}

impl Program {
    pub fn load(input: &str) -> Self {
        Self {
            instructions: input.split('\n').map(Instruction::parse).collect_vec(),
        }
    }

    fn exec(&self, memory: &mut Memory, instruction: &Instruction) {
        match *instruction {
            Inp(i) => {
                memory.vars[i] = memory.input[memory.input_cursor];
                memory.input_cursor += 1;
            }
            Add(i, v) => memory.vars[i] += memory.eval(v),
            Mul(i, v) => memory.vars[i] *= memory.eval(v),
            Div(i, v) => memory.vars[i] /= memory.eval(v), // ensure the value is truncated rightly?
            Mod(i, v) => memory.vars[i] = memory.vars[i].rem_euclid(memory.eval(v)),
            Eql(i, v) => memory.vars[i] = (memory.vars[i] == memory.eval(v)) as i32,
        }
    }

    pub fn run(&self, input: &[i32]) -> Memory {
        let mut memory = Memory {
            input_cursor: 0,
            input: input.iter().copied().collect(),
            vars: [0_i32; 4],
        };

        for instruction in &self.instructions {
            if let Inp(_) = instruction {
                println!(
                    "mem> {:?}, inp={:?}, chars={:?}",
                    memory.vars,
                    memory.input.iter().skip(memory.input_cursor).collect_vec(),
                    memory
                        .vars
                        .map(|c| char::from_u32(c as u32 + 'a' as u32).unwrap())
                );
            }
            self.exec(&mut memory, instruction);
        }

        memory
    }

    const INP_CHUNK_SIZE: usize = 18;

    pub fn run_heuristic(&self, from: &Memory, input: i32, iter: usize) -> Option<i64> {
        let mut is_input_processed = false;
        let mut memory = from.clone();
        memory.input.push(input);

        println!(
            "curr={}, mem={:?}, stack={:?}",
            input,
            memory.vars,
            memory.input.iter().skip(memory.input_cursor).collect_vec(),
        );

        let current_instructions = self
            .instructions
            .iter()
            .skip(iter * Program::INP_CHUNK_SIZE)
            .take(Program::INP_CHUNK_SIZE)
            .collect_vec();

        let has_division_modulo = current_instructions.get(4) == Some(&&Div(3, Integer(26)));
        if has_division_modulo {
            let modulo_x_term = match &current_instructions.get(5).unwrap() {
                Add(_, Integer(n)) => *n,
                _ => panic!("what"),
            };
            let desired_input = memory.get_var(Z) % 26 + modulo_x_term;
            if input != desired_input {
                println!(
                    "skipping {} -> desired is {} (iter={})",
                    input, desired_input, iter
                );
                return None;
            }
        }

        for (cursor, instruction) in self
            .instructions
            .iter()
            .skip(iter * Program::INP_CHUNK_SIZE)
            .enumerate()
        {
            if cursor == 0 {
                assert_matches!(instruction, Inp(_));
            }
            // 4,5,7,8,9,11,13
            match instruction {
                Inp(_) if is_input_processed => {
                    for next in 1..=9 {
                        if let Some(max) = self.run_heuristic(&memory, next, iter + 1) {
                            return Some(max);
                        }
                    }
                    return None;
                }
                Inp(_) => is_input_processed = true,
                _ => {}
            }

            self.exec(&mut memory, instruction)
        }

        // let current = memory
        //     .input
        //     .iter()
        //     .map(|&x| char::from_digit(x as u32, 10).unwrap())
        //     .collect::<String>()
        //     .parse::<i64>()
        //     .unwrap();

        // println!("tested: {}, valid: {}", current, memory.get_var(Z) == 0);
        if memory.get_var(Z) == 0 {
            Some(
                memory
                    .input
                    .iter()
                    .map(|&x| char::from_digit(x as u32, 10).unwrap())
                    .collect::<String>()
                    .parse()
                    .unwrap(),
            )
        } else {
            None
        }
    }
}

pub fn encode_model_number(n: i64) -> Vec<i32> {
    n.to_string()
        .chars()
        .map(|x| x.to_digit(10).unwrap() as i32)
        .collect_vec()
}

pub fn monad_bounds(program: &Program, min: i64, max: i64) -> i64 {
    if max - min < 10_000_000 {
        // println!("too small (min={} max={})", min, max);
        return -1;
    }

    let middle = min + (max - min) / 2;
    let middle_z = program.run(&encode_model_number(middle)).get_var(Z);
    println!("v={}, z={}", middle, middle_z);
    if middle_z == 0 {
        println!("bound={}", middle);
        return middle;
    }

    cmp::max(
        monad_bounds(program, min, middle),
        monad_bounds(program, middle, max),
    )
}

pub fn monad_get_highest_valid(input: &str) -> i64 {
    let program = Program::load(input);
    let memory = Memory {
        input_cursor: 0,
        input: vec![],
        vars: [0_i32; 4],
    };
    for initial in 1..=9 {
        if let Some(max) = program.run_heuristic(&memory, initial, 0) {
            return max;
        }
    }
    panic!("nooope")
}

pub fn monad_is_valid() {}

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn test_parsing() {
        assert_eq!(Instruction::parse("inp z"), Instruction::Inp(3));
        assert_eq!(
            Instruction::parse("mod w 10"),
            Instruction::Mod(0, Integer(10))
        );
    }

    #[test]
    fn test_simple_program() {
        let program = Program::load(
            "inp z
            inp x
            mul z 3
            eql z x",
        );
        assert_eq!(program.run(&[3, 9]).get_var(Z), 1);
        assert_eq!(program.run(&[5, 8]).get_var(Z), 0);
        assert_eq!(program.run(&[1, 4]).get_var(Z), 0);
        assert_eq!(program.run(&[1, 3]).get_var(Z), 1);
    }

    #[test]
    fn test_example() {
        let program = Program::load(
            "inp w
            add z w
            mod z 2
            div w 2
            add y w
            mod y 2
            div w 2
            add x w
            mod x 2
            div w 2
            mod w 2",
        );
        assert_eq!(program.run(&[12]).vars, [1, 1, 0, 0]);
        assert_eq!(program.run(&[13]).vars, [1, 1, 0, 1]);
    }
}
