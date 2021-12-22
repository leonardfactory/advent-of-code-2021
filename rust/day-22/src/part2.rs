use std::cmp::{max, min};

use itertools::Itertools;
use num::abs;

use crate::part1::{parse_cuboids, Action, Cuboid};

pub fn reboot_reactor(input: &str) -> i64 {
    let cuboids = parse_cuboids(input);
    let mut reactor: Vec<Cuboid> = Vec::new();
    for cuboid in cuboids {
        reactor = cuboid.reduce(&reactor);
    }

    reactor
        .iter()
        .fold(0_i64, |total, cuboid| match cuboid.action {
            Action::On => total + cuboid.size(),
            Action::Off => total - cuboid.size(),
        })
}

fn range_length(range: (i32, i32)) -> i64 {
    abs(range.1 - range.0) as i64 + 1
}

impl Cuboid {
    fn size(&self) -> i64 {
        range_length(self.x) * range_length(self.y) * range_length(self.z)
    }

    fn reduce(&self, cuboids: &[Cuboid]) -> Vec<Cuboid> {
        let mut result: Vec<_> = cuboids.iter().copied().collect_vec();
        let mut intersections = cuboids
            .iter()
            .filter_map(|c| self.intersect(c))
            .collect_vec();
        result.append(&mut intersections);

        if self.action == Action::On {
            result.push(*self);
        }
        result
    }

    fn intersect(&self, cuboid: &Cuboid) -> Option<Cuboid> {
        if !cuboid.does_intersect(self) {
            return None;
        }

        Some(self.intersecting_range(cuboid))
    }

    fn intersecting_range(&self, cuboid: &Cuboid) -> Cuboid {
        Cuboid {
            action: cuboid.action.switch(),
            x: (max(self.x.0, cuboid.x.0), min(self.x.1, cuboid.x.1)),
            y: (max(self.y.0, cuboid.y.0), min(self.y.1, cuboid.y.1)),
            z: (max(self.z.0, cuboid.z.0), min(self.z.1, cuboid.z.1)),
        }
    }

    fn does_intersect(&self, cuboid: &Cuboid) -> bool {
        range_intersects(self.x, cuboid.x)
            && range_intersects(self.y, cuboid.y)
            && range_intersects(self.z, cuboid.z)
    }
}

fn range_intersects(range1: (i32, i32), range2: (i32, i32)) -> bool {
    range1.0 <= range2.1 && range1.1 >= range2.0
}

#[cfg(test)]
pub mod tests {
    use crate::part2::*;

    #[test]
    fn test_example() {
        assert_eq!(
            reboot_reactor(include_str!("../test2.txt")),
            2758514936282235
        );
    }
}
