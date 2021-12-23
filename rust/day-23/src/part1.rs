use itertools::Itertools;
use lazy_static::lazy_static;
use memoize::memoize;
use std::{
    collections::{HashSet, VecDeque},
    io::stdin,
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

    pub fn targets(&self) -> (usize, usize) {
        match *self {
            Amphipod::Amber => (11, 12),
            Amphipod::Bronze => (13, 14),
            Amphipod::Copper => (15, 16),
            Amphipod::Desert => (17, 18),
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
            (4, 13),
            (13, 14),
            (6, 15),
            (15, 16),
            (8, 17),
            (17, 18),
        ]);
        edges
    };
}

pub enum Position {
    Hallway,
    Room(Amphipod, bool),
}

impl Position {
    pub fn get(idx: usize) -> Self {
        match idx {
            i if i <= 10 => Position::Hallway,
            i if i <= 12 => Position::Room(Amphipod::Amber, i % 2 == 0),
            i if i <= 14 => Position::Room(Amphipod::Bronze, i % 2 == 0),
            i if i <= 16 => Position::Room(Amphipod::Copper, i % 2 == 0),
            i if i <= 18 => Position::Room(Amphipod::Desert, i % 2 == 0),
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
            nodes: vec![None; 11 + 4 * 2],
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
            _ => panic!("can_move_to: caso non gestito"),
        }
    }

    pub fn target_moves(&self, idx: usize) -> Option<Vec<(usize, usize)>> {
        let amphipod = self.nodes[idx].unwrap();
        match Position::get(idx) {
            Position::Hallway => {
                let targets = amphipod.targets();
                if let Some(energy) = self.can_move_to(idx, targets.1) {
                    return Some(vec![(targets.1, energy)]);
                } else if let Some(energy) = self.can_move_to(idx, targets.0) {
                    if self.nodes[targets.1] == Some(amphipod) {
                        return Some(vec![(targets.0, energy)]);
                    }
                }
                None
            }
            Position::Room(slot, deep) => {
                if slot == amphipod && (deep || self.nodes[idx + 1] == Some(amphipod)) {
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
            && self.nodes[13] == Some(Amphipod::Bronze)
            && self.nodes[14] == Some(Amphipod::Bronze)
            && self.nodes[15] == Some(Amphipod::Copper)
            && self.nodes[16] == Some(Amphipod::Copper)
            && self.nodes[17] == Some(Amphipod::Desert)
            && self.nodes[18] == Some(Amphipod::Desert)
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
        println!(
            "###{}#{}#{}#{}###",
            debug_amphipod(self.nodes[11]),
            debug_amphipod(self.nodes[13]),
            debug_amphipod(self.nodes[15]),
            debug_amphipod(self.nodes[17])
        );
        println!(
            "  #{}#{}#{}#{}#  ",
            debug_amphipod(self.nodes[12]),
            debug_amphipod(self.nodes[14]),
            debug_amphipod(self.nodes[16]),
            debug_amphipod(self.nodes[18])
        );
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
        .take(2)
        .enumerate()
        .flat_map(|(i, line)| {
            line.replace('#', " ")
                .trim()
                .split(' ')
                .enumerate()
                .map(|(j, c)| {
                    (
                        11 + j * 2 + i % 2,
                        Amphipod::parse(c.chars().next().unwrap()),
                    )
                })
                .collect_vec()
        })
        .collect_vec();

    println!("map amphipods: {:?}", amphipods);

    for (idx, amphipod) in amphipods {
        map.nodes[idx] = Some(amphipod);
    }
    map
}

#[memoize]
pub fn solve_amphipods_map(map: Map) -> Option<usize> {
    if map.is_ordered() {
        return Some(map.energy);
    }

    let available_moves: Vec<_> = map
        .nodes
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
        .collect();

    available_moves
        .iter()
        .filter_map(|&(from, to, steps)| {
            let next_map = map.moves(from, to, steps);
            // println!(
            //     "\ntrying with (en={}): from={} ({}) to={}",
            //     map.energy,
            //     from,
            //     debug_amphipod(map.nodes[from]),
            //     to
            // );
            // next_map.print();
            solve_amphipods_map(next_map)
        })
        .min()
}

pub fn minimum_amphipods_energy(input: &str) -> usize {
    let map = parse_map(input);
    let energy = solve_amphipods_map(map);
    energy.unwrap()
}

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn test_parsing() {
        let map = parse_map(include_str!("../test.txt"));
        assert_eq!(map.nodes[11], Some(Amphipod::Bronze));
        assert_eq!(map.nodes[17], Some(Amphipod::Desert));
    }

    #[test]
    fn test_example() {
        assert_eq!(minimum_amphipods_energy(include_str!("../test.txt")), 12521);
    }
}
