use itertools::Itertools;
use lazy_static::lazy_static;
use memoize::memoize;
use std::{
    collections::{HashSet, VecDeque},
    f64::MIN,
    hash::Hash,
    sync::Mutex,
};

pub fn part1() {}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Amphipod {
    Amber,
    Bronze,
    Copper,
    Desert,
}

impl Amphipod {
    pub fn parse(c: char) -> Self {
        match c {
            'A' => Amphipod::Amber,
            'B' => Amphipod::Bronze,
            'C' => Amphipod::Copper,
            'D' => Amphipod::Desert,
            _ => panic!("Unknown amphipod: {}", c),
        }
    }

    pub fn energy(&self) -> usize {
        match *self {
            Amphipod::Amber => 1,
            Amphipod::Bronze => 10,
            Amphipod::Copper => 100,
            Amphipod::Desert => 1000,
        }
    }

    pub fn targets(&self) -> [usize; 4] {
        match *self {
            Amphipod::Amber => [11, 12, 13, 14],
            Amphipod::Bronze => [15, 16, 17, 18],
            Amphipod::Copper => [19, 20, 21, 22],
            Amphipod::Desert => [23, 24, 25, 26],
        }
    }

    pub fn to_char(&self) -> char {
        match *self {
            Amphipod::Amber => 'A',
            Amphipod::Bronze => 'B',
            Amphipod::Copper => 'C',
            Amphipod::Desert => 'D',
        }
    }

    pub fn target_hallway(&self) -> usize {
        match *self {
            Amphipod::Amber => 2,
            Amphipod::Bronze => 4,
            Amphipod::Copper => 6,
            Amphipod::Desert => 8,
        }
    }
}

#[derive(Clone, Hash, PartialEq, Eq)]
pub struct Map {
    nodes: Vec<Option<Amphipod>>,
    energy: usize,
}

lazy_static! {
    static ref EDGES: Vec<(usize, usize)> = {
        let mut edges = (0..10).map(|x| (x, x + 1)).collect_vec();
        edges.append(&mut vec![
            (2, 11),
            (11, 12),
            (12, 13),
            (13, 14),
            (4, 15),
            (15, 16),
            (16, 17),
            (17, 18),
            (6, 19),
            (19, 20),
            (20, 21),
            (21, 22),
            (8, 23),
            (23, 24),
            (24, 25),
            (25, 26),
        ]);
        edges
    };
}

pub enum Position {
    Hallway,
    Room(Amphipod, usize),
}

impl Position {
    pub fn get(idx: usize) -> Self {
        match idx {
            i if i <= 10 => Position::Hallway,
            i if i <= 14 => Position::Room(Amphipod::Amber, 14),
            i if i <= 18 => Position::Room(Amphipod::Bronze, 18),
            i if i <= 22 => Position::Room(Amphipod::Copper, 22),
            i if i <= 26 => Position::Room(Amphipod::Desert, 26),
            _ => panic!("Unknown position"),
        }
    }
}

pub fn outgoing_nodes(idx: usize) -> impl Iterator<Item = usize> {
    EDGES.iter().filter_map(move |&(n1, n2)| match idx {
        _ if idx == n1 => Some(n2),
        _ if idx == n2 => Some(n1),
        _ => None,
    })
}

impl Map {
    pub fn new() -> Self {
        Self {
            nodes: vec![None; 11 + 4 * 4],
            energy: 0,
        }
    }

    pub fn can_move_to(&self, from: usize, to: usize) -> Option<usize> {
        let amphipod = self.nodes[from].unwrap();
        match (from, to) {
            (_, _) if to == 2 || to == 4 || to == 6 || to == 8 => None,
            (_, _) => {
                let mut stack: VecDeque<_> = outgoing_nodes(from).map(|n| (n, 1)).collect();

                let mut visited: HashSet<usize> = HashSet::new();
                while let Some((ni, steps)) = stack.pop_front() {
                    let node = self.nodes[ni];
                    visited.insert(ni);
                    if node.is_some() {
                        continue;
                    }
                    if ni == to {
                        return Some(steps * amphipod.energy());
                    }

                    for outgoing_idx in
                        outgoing_nodes(ni).filter(|next_index| !visited.contains(next_index))
                    {
                        stack.push_back((outgoing_idx, steps + 1));
                    }
                }
                None
            }
        }
    }

    pub fn target_moves(&self, idx: usize) -> Option<Vec<(usize, usize)>> {
        let amphipod = self.nodes[idx].unwrap();
        match Position::get(idx) {
            Position::Hallway => {
                let mut targets = amphipod.targets();
                targets.reverse();
                for target in targets {
                    if let Some(energy) = self.can_move_to(idx, target) {
                        return Some(vec![(target, energy)]);
                    } else if self.nodes[target] != Some(amphipod) {
                        return None;
                    }
                }
                None
            }
            Position::Room(slot, deep) => {
                if (idx..=deep).all(|di| self.nodes[di] == Some(slot)) {
                    return None;
                }

                Some(
                    (0..11)
                        .filter_map(|target| {
                            self.can_move_to(idx, target).map(|energy| (target, energy))
                        })
                        .collect_vec(),
                )
            }
        }
    }

    pub fn moves(&self, from: usize, to: usize, energy: usize) -> Self {
        let mut nodes = self.nodes.clone();
        assert!(nodes[from].is_some());
        nodes.swap(from, to);
        Self {
            nodes,
            energy: self.energy + energy,
        }
    }

    pub fn is_ordered(&self) -> bool {
        self.nodes[11] == Some(Amphipod::Amber)
            && self.nodes[12] == Some(Amphipod::Amber)
            && self.nodes[13] == Some(Amphipod::Amber)
            && self.nodes[14] == Some(Amphipod::Amber)
            && self.nodes[15] == Some(Amphipod::Bronze)
            && self.nodes[16] == Some(Amphipod::Bronze)
            && self.nodes[17] == Some(Amphipod::Bronze)
            && self.nodes[18] == Some(Amphipod::Bronze)
            && self.nodes[19] == Some(Amphipod::Copper)
            && self.nodes[20] == Some(Amphipod::Copper)
            && self.nodes[21] == Some(Amphipod::Copper)
            && self.nodes[22] == Some(Amphipod::Copper)
            && self.nodes[23] == Some(Amphipod::Desert)
            && self.nodes[24] == Some(Amphipod::Desert)
            && self.nodes[25] == Some(Amphipod::Desert)
            && self.nodes[26] == Some(Amphipod::Desert)
    }

    pub fn print(&self) {
        println!(r"#############");
        println!(
            "#{}#",
            self.nodes[0..11]
                .iter()
                .map(|amphipod| debug_amphipod(*amphipod))
                .collect::<String>()
        );
        for i in 0..4 {
            println!(
                "  #{}#{}#{}#{}#  ",
                debug_amphipod(self.nodes[11 + i]),
                debug_amphipod(self.nodes[15 + i]),
                debug_amphipod(self.nodes[19 + i]),
                debug_amphipod(self.nodes[23 + i])
            );
        }
    }

    pub fn lower_bound(&self) -> usize {
        self.nodes
            .iter()
            .enumerate()
            .map(|(i, n)| match (n, Position::get(i)) {
                (None, _) => 0,
                (Some(amphipod), Position::Hallway) => match *amphipod {
                    Amphipod::Amber => (i as i32 - 2).abs() as usize + 1,
                    Amphipod::Bronze => ((i as i32 - 4).abs() as usize + 1) * 10,
                    Amphipod::Copper => ((i as i32 - 6).abs() as usize + 1) * 100,
                    Amphipod::Desert => ((i as i32 - 8).abs() as usize + 1) * 1000,
                },
                (Some(amphipod), Position::Room(slot, deep)) if slot == *amphipod => {
                    if (i..=deep).all(|di| self.nodes[di] == Some(slot)) {
                        0
                    } else {
                        ((i - (deep - 3)) + 4) * amphipod.energy()
                    }
                }
                (Some(amphipod), Position::Room(slot, deep)) => {
                    let from_hallway = amphipod.target_hallway();
                    let to_hallway = slot.target_hallway();
                    let hallway = (from_hallway as i32 - to_hallway as i32).abs() as usize;

                    amphipod.energy() * (hallway + 1 + (i - (deep - 3)))
                }
            } as usize)
            .sum::<usize>()
            + self.energy
    }
}

fn debug_amphipod(a: Option<Amphipod>) -> char {
    match a {
        Some(a) => a.to_char(),
        None => '.',
    }
}

impl Default for Map {
    fn default() -> Self {
        Self::new()
    }
}

pub fn parse_map(input: &str) -> Map {
    let mut map = Map::new();
    let amphipods = input
        .split('\n')
        .skip(2)
        .take(4)
        .enumerate()
        .flat_map(|(i, line)| {
            line.replace('#', " ")
                .trim()
                .split(' ')
                .enumerate()
                .map(|(j, c)| (11 + j * 4 + i, Amphipod::parse(c.chars().next().unwrap())))
                .collect_vec()
        })
        .collect_vec();

    println!("map amphipods: {:?}", amphipods);

    for (idx, amphipod) in amphipods {
        map.nodes[idx] = Some(amphipod);
    }
    map
}

fn map_available_moves(map: Map) -> Vec<Map> {
    map.nodes
        .iter()
        .enumerate()
        .flat_map(|(i, amphipod)| amphipod.as_ref().map(|a| (i, a)))
        .flat_map(|(i, _)| {
            map.target_moves(i)
                .unwrap_or_default()
                .iter()
                .map(|&(to, steps)| (i, to, steps))
                .collect::<Vec<(usize, usize, usize)>>()
        })
        .sorted_by(|a, b| Ord::cmp(&a.2, &b.2))
        .map(|(from, to, steps)| map.moves(from, to, steps))
        .collect_vec()
}

pub fn solve_amphipods_map(source_map: Map) -> Option<usize> {
    let mut energy: Option<usize> = None;
    let starting_moves = map_available_moves(source_map);
    let mut stack: VecDeque<_> = starting_moves.into_iter().collect();
    let mut processed: HashSet<Map> = HashSet::new();

    while let Some(map) = stack.pop_front() {
        match energy {
            Some(max) if map.energy > max || map.lower_bound() > max => continue,
            _ => (),
        }

        if map.is_ordered() {
            println!("\nLocal minimum energy: {}", map.energy);
            map.print();
            energy = Some(map.energy);
            continue;
        }

        for next_map in map_available_moves(map) {
            if processed.contains(&next_map) {
                continue;
            }
            if next_map.lower_bound() < energy.unwrap_or(usize::MAX) {
                processed.insert(next_map.clone());
                stack.push_front(next_map);
            }
        }
    }

    energy
}

pub fn minimum_amphipods_energy_four(input: &str) -> usize {
    let map = parse_map(input);
    let energy = solve_amphipods_map(map);
    energy.unwrap()
}

#[cfg(test)]
pub mod tests {
    use crate::part2::*;

    #[test]
    fn test_parsing() {
        let map = parse_map(include_str!("../test.txt"));
        assert_eq!(map.nodes[11], Some(Amphipod::Bronze));
        assert_eq!(map.nodes[17], Some(Amphipod::Desert));
    }

    // #[test]
    // fn test_example() {
    //     assert_eq!(minimum_amphipods_energy(include_str!("../test.txt")), 12521);
    // }
}
