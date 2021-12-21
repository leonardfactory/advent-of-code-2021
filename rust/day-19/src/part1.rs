use std::{
    collections::{HashMap, HashSet},
    hash::Hash,
};

use itertools::Itertools;

pub fn parse(input: &str) -> Vec<Scanner> {
    input.split("\n\n").map(Scanner::parse).collect()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Pos(i32, i32, i32);

impl Pos {
    pub fn parse(input: &str) -> Self {
        input
            .split(',')
            .map(|c| c.parse().unwrap())
            .collect_tuple()
            .map(|(x, y, z)| Self(x, y, z))
            .unwrap()
    }

    pub fn rotate(&self, rotate: Rotate) -> Self {
        match rotate {
            Rotate::X(_) => Self(
                self.0,
                self.1 * rotate.cos() + self.2 * -rotate.sin(),
                self.1 * rotate.sin() + self.2 * rotate.cos(),
            ),
            Rotate::Y(_) => Self(
                self.0 * rotate.cos() + self.2 * rotate.sin(),
                self.1,
                self.0 * -rotate.sin() + self.2 * rotate.cos(),
            ),
            Rotate::Z(_) => Self(
                self.0 * rotate.cos() + self.1 * -rotate.sin(),
                self.0 * rotate.sin() + self.1 * rotate.cos(),
                self.2,
            ),
        }
    }

    pub fn subtract(&self, b: &Self) -> Self {
        Self(self.0 - b.0, self.1 - b.1, self.2 - b.2)
    }

    pub fn add(&self, b: &Self) -> Self {
        Self(self.0 + b.0, self.1 + b.1, self.2 + b.2)
    }

    pub fn is_zero(&self) -> bool {
        self.0 == 0 && self.1 == 0 && self.2 == 0
    }

    pub fn inverse(&self) -> Self {
        Self(-self.0, -self.1, -self.2)
    }

    pub fn magnitude(&self) -> i32 {
        self.0.abs() + self.1.abs() + self.2.abs()
    }
}

pub struct Scanner {
    pub index: usize,
    pub transforms: Vec<Vec<Pos>>,
}

#[derive(Debug, Clone, Copy)]
pub enum Rotate {
    X(usize),
    Y(usize),
    Z(usize),
}

impl Rotate {
    pub fn angle(&self) -> usize {
        match &self {
            Self::X(angle) | Self::Y(angle) | Self::Z(angle) => *angle,
        }
    }
    pub fn cos(&self) -> i32 {
        match self.angle() {
            0 => 1,
            90 => 0,
            180 => -1,
            270 => 0,
            _ => panic!("Unknown angle!"),
        }
    }

    pub fn sin(&self) -> i32 {
        match self.angle() {
            0 => 0,
            90 => 1,
            180 => 0,
            270 => -1,
            _ => panic!("Unknown angle!"),
        }
    }
}

const TRANSFORMS: [[Rotate; 2]; 24] = [
    [Rotate::Y(0), Rotate::X(0)],
    [Rotate::Y(0), Rotate::X(90)],
    [Rotate::Y(0), Rotate::X(180)],
    [Rotate::Y(0), Rotate::X(270)],
    [Rotate::Y(180), Rotate::X(0)],
    [Rotate::Y(180), Rotate::X(90)],
    [Rotate::Y(180), Rotate::X(180)],
    [Rotate::Y(180), Rotate::X(270)],
    [Rotate::Y(90), Rotate::Z(0)],
    [Rotate::Y(90), Rotate::Z(90)],
    [Rotate::Y(90), Rotate::Z(180)],
    [Rotate::Y(90), Rotate::Z(270)],
    [Rotate::Y(270), Rotate::Z(0)],
    [Rotate::Y(270), Rotate::Z(90)],
    [Rotate::Y(270), Rotate::Z(180)],
    [Rotate::Y(270), Rotate::Z(270)],
    [Rotate::Z(90), Rotate::Y(0)],
    [Rotate::Z(90), Rotate::Y(90)],
    [Rotate::Z(90), Rotate::Y(180)],
    [Rotate::Z(90), Rotate::Y(270)],
    [Rotate::Z(270), Rotate::Y(0)],
    [Rotate::Z(270), Rotate::Y(90)],
    [Rotate::Z(270), Rotate::Y(180)],
    [Rotate::Z(270), Rotate::Y(270)],
];

impl Scanner {
    pub fn parse(input: &str) -> Self {
        let mut lines = input.split('\n');
        let index = lines
            .next()
            .unwrap()
            .chars()
            .filter(|&x| ('0'..='9').contains(&x))
            .collect::<String>()
            .parse()
            .unwrap();

        let beacons: Vec<Pos> = lines.map(Pos::parse).collect();
        let transforms = Scanner::compute_transforms(&beacons);
        Self { index, transforms }
    }

    pub fn compute_transforms(beacons: &[Pos]) -> Vec<Vec<Pos>> {
        TRANSFORMS
            .iter()
            .map(|transform| {
                beacons
                    .iter()
                    .map(|pos| transform.iter().fold(*pos, |p, &r| p.rotate(r)))
                    .collect()
            })
            .collect()
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Assignment {
    pub scanner: usize,
    pub transform: usize,
    pub pos: Pos,
}

pub type Solution = Vec<Assignment>;

/// Finds delta between scanner A and scanner B analyzing their points.
/// It returns the first "delta" (a - b) having more than 12 points
fn scanner_match(a: &[Pos], b: &[Pos]) -> Option<Pos> {
    let mut delta_store: HashMap<Pos, usize> = HashMap::new();
    for pa in a {
        for pb in b {
            let delta = pa.subtract(pb);
            *delta_store.entry(delta).or_insert(0) += 1;
        }
    }

    delta_store
        .iter()
        .find(|&(_delta, points)| *points >= 12)
        .map(|x| *x.0)
}

/// Recursively finding solution
pub fn solve(scanners: &[Scanner]) -> Solution {
    let mut solutions = vec![];

    partial_solve(
        scanners,
        &mut solutions,
        scanners
            .iter()
            .map(|x| x.index)
            .filter(|&x| x != 0)
            .collect(),
        vec![Assignment {
            pos: Pos(0, 0, 0),
            transform: 0,
            scanner: 0,
        }],
    );

    match solutions.first() {
        Some(solution) => solution.to_vec(),
        None => panic!("No solution found :("),
    }
}

pub fn partial_solve(
    scanners: &[Scanner],
    solutions: &mut Vec<Solution>,
    availables: Vec<usize>,
    solution: Solution,
) {
    if availables.is_empty() {
        solutions.push(solution);
        return;
    }

    for (i, available) in availables.iter().enumerate() {
        for (j, transform) in scanners[*available].transforms.iter().enumerate() {
            for found in &solution {
                let matched = scanner_match(
                    &scanners[found.scanner].transforms[found.transform],
                    transform,
                );

                if let Some(delta) = matched {
                    let mut next_availables = availables.clone();
                    next_availables.swap_remove(i);
                    let mut next_solution = solution.clone();
                    next_solution.push(Assignment {
                        scanner: *available,
                        transform: j,
                        pos: found.pos.add(&delta),
                    });
                    partial_solve(scanners, solutions, next_availables, next_solution);
                    return;
                }
            }
        }
    }
}

pub fn count_beacons(input: &str) -> usize {
    let scanners = parse(input);
    let solution = solve(&scanners);
    let mut beacons: HashSet<Pos> = HashSet::new();
    solution.iter().for_each(|&assignment| {
        scanners[assignment.scanner].transforms[assignment.transform]
            .iter()
            .for_each(|beacon| {
                beacons.insert(assignment.pos.add(beacon));
            })
    });
    beacons.len()
}
