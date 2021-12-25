use std::{cmp, collections::HashSet};

pub fn sea_cucumbers_steps(input: &str) -> usize {
    let mut map = Map::parse(input);
    let mut steps = 0;
    loop {
        steps += 1;
        map = map.step();
        println!("\nstep: {}, moves={}", steps, map.moves_count);
        // map.print();
        if map.moves_count == 0 {
            return steps;
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Tile {
    East,
    South,
    Void,
}

impl Tile {
    pub fn parse(c: char) -> Self {
        match c {
            '>' => Self::East,
            'v' => Self::South,
            '.' => Self::Void,
            _ => panic!("unknown"),
        }
    }
}

pub type Herd = HashSet<(usize, usize)>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Map {
    easts: Herd,
    souths: Herd,
    width: usize,
    height: usize,
    moves_count: usize,
}

impl Map {
    pub fn parse(input: &str) -> Self {
        let mut width = 0_usize;
        let mut height = 0_usize;
        let mut easts: Herd = Herd::new();
        let mut souths: Herd = Herd::new();

        input.split('\n').enumerate().for_each(|(y, line)| {
            line.chars()
                .map(Tile::parse)
                .enumerate()
                .for_each(|(x, tile)| {
                    width = cmp::max(x + 1, width);
                    height = cmp::max(y + 1, height);
                    match tile {
                        Tile::East => easts.insert((x, y)),
                        Tile::South => souths.insert((x, y)),
                        _ => false,
                    };
                })
        });

        Self {
            easts,
            souths,
            width,
            height,
            moves_count: 0,
        }
    }

    pub fn step(&self) -> Map {
        let mut next_easts = self.easts.clone();
        let mut moves_count = 0_usize;

        for &(x, y) in &self.easts {
            let next_x = (x + 1) % self.width;
            if !self.easts.contains(&(next_x, y)) && !self.souths.contains(&(next_x, y)) {
                next_easts.remove(&(x, y));
                next_easts.insert((next_x, y));
                moves_count += 1;
            }
        }

        let mut next_souths = self.souths.clone();
        for &(x, y) in &self.souths {
            let next_y = (y + 1) % self.height;
            if !next_easts.contains(&(x, next_y)) && !self.souths.contains(&(x, next_y)) {
                next_souths.remove(&(x, y));
                next_souths.insert((x, next_y));
                moves_count += 1;
            }
        }

        Self {
            easts: next_easts,
            souths: next_souths,
            width: self.width,
            height: self.height,
            moves_count,
        }
    }

    pub fn print(&self) {
        for y in 0..self.height {
            for x in 0..self.width {
                print!(
                    "{}",
                    match (x, y) {
                        (_, _) if self.easts.contains(&(x, y)) => ">",
                        (_, _) if self.souths.contains(&(x, y)) => "v",
                        _ => ".",
                    }
                );
            }
            println!();
        }
    }
}

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn test_example() {
        assert_eq!(sea_cucumbers_steps(include_str!("../test.txt")), 58);
    }
}
