use std::collections::HashMap;

use itertools::{iproduct, Itertools};

pub fn part1() {}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Action {
    On,
    Off,
}

impl Action {
    fn parse(token: &str) -> Self {
        match token {
            "on" => Self::On,
            "off" => Self::Off,
            _ => panic!("unknown action"),
        }
    }

    pub fn switch(&self) -> Self {
        match self {
            Action::On => Action::Off,
            Action::Off => Action::On,
        }
    }

    pub fn to_bool(&self) -> bool {
        match self {
            Action::On => true,
            Action::Off => false,
        }
    }
}

pub fn count_on_cubes(input: &str) -> usize {
    let reactor = initialize_reactor(input);
    reactor.iter().filter(|&(_, v)| *v).count()
}

pub fn initialize_reactor(input: &str) -> Grid {
    let cuboids = parse_cuboids(input);
    let mut grid = Grid::new();
    for cuboid in cuboids {
        if !is_cuboid_in_initialization_space(&cuboid) {
            continue;
        }

        let action = cuboid.action.to_bool();
        for (x, y, z) in iproduct!(
            cuboid.x.0..=cuboid.x.1,
            cuboid.y.0..=cuboid.y.1,
            cuboid.z.0..=cuboid.z.1
        ) {
            let entry = grid.entry(Pos::new(x, y, z)).or_insert(false);
            *entry = action;
        }
    }
    grid
}

pub fn is_cuboid_in_initialization_space(cuboid: &Cuboid) -> bool {
    is_minmax_in_initialization_space(cuboid.x)
        && is_minmax_in_initialization_space(cuboid.y)
        && is_minmax_in_initialization_space(cuboid.z)
}

fn is_minmax_in_initialization_space(minmax: (i32, i32)) -> bool {
    minmax.0 <= 50 && minmax.1 >= -50
}

pub fn parse_cuboids(input: &str) -> Vec<Cuboid> {
    input
        .split('\n')
        .map(|line| {
            let (action, coords) = line.split(' ').collect_tuple().unwrap();
            let (cx, cy, cz) = coords
                .split(',')
                .map(|coord| {
                    coord[2..]
                        .split("..")
                        .map(|minmax| minmax.parse::<i32>().unwrap())
                        .sorted()
                        .collect_tuple()
                        .unwrap()
                })
                .collect_tuple()
                .unwrap();

            Cuboid {
                action: Action::parse(action),
                x: cx,
                y: cy,
                z: cz,
            }
        })
        .collect()
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Cuboid {
    pub action: Action,
    pub x: (i32, i32),
    pub y: (i32, i32),
    pub z: (i32, i32),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Pos {
    x: i32,
    y: i32,
    z: i32,
}

impl Pos {
    pub fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }
}

pub type Grid = HashMap<Pos, bool>;

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn test_example() {
        assert_eq!(count_on_cubes(include_str!("../test.txt")), 590784);
    }
}
