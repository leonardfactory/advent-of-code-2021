use itertools::Itertools;

use crate::part1::*;

pub fn largest_distance(input: &str) -> i32 {
    let scanners = parse(input);
    let solution = solve(&scanners);
    solution
        .iter()
        .cartesian_product(solution.iter())
        .map(|(a, b)| a.pos.subtract(&b.pos))
        .map(|p| p.magnitude())
        .max()
        .unwrap()
}
