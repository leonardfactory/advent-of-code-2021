use std::collections::HashMap;

use itertools::Itertools;
use num::pow;

pub fn parse(input: &str) -> (Vec<usize>, Image) {
    let (algorithm, source) = input.split("\n\n").collect_tuple().unwrap();
    (parse_algorithm(algorithm), Image::parse(source))
}

pub fn parse_pixel(input: char) -> usize {
    match input {
        '#' => 1,
        '.' => 0,
        _ => panic!("whooops {}", input),
    }
}

pub fn parse_algorithm(input: &str) -> Vec<usize> {
    input.chars().map(parse_pixel).collect()
}

pub fn iter_algorithm_pixel(algorithm: &[usize], iter: usize) -> usize {
    if (iter + 1) % 2 == 0 {
        algorithm[0]
    } else {
        algorithm[511]
    }
}

pub struct Image {
    pub pixels: HashMap<(i32, i32), usize>,
}

const AROUND_BITS: [(i32, i32); 9] = [
    (-1, -1),
    (0, -1),
    (1, -1),
    (-1, 0),
    (0, 0),
    (1, 0),
    (-1, 1),
    (0, 1),
    (1, 1),
];

#[derive(Copy, Clone)]
struct Bounds {
    x_min: i32,
    x_max: i32,
    y_min: i32,
    y_max: i32,
}

impl Image {
    pub fn parse(input: &str) -> Self {
        let pixels: HashMap<(i32, i32), usize> = input
            .split('\n')
            .enumerate()
            .flat_map(move |(y, line)| {
                line.chars()
                    .enumerate()
                    .map(move |(x, c)| ((x as i32, y as i32), parse_pixel(c)))
            })
            .collect();

        let mut image = Self { pixels };
        image.compact(0);
        image
    }

    pub fn sample(&self, x: i32, y: i32, if_null: usize) -> usize {
        let bits = AROUND_BITS
            .iter()
            .map(|(dx, dy)| {
                self.pixels
                    .get(&(x + dx, y + dy))
                    .or(Some(&if_null))
                    .unwrap()
            })
            .rev()
            .enumerate()
            .fold(0, |value, (i, bit)| value + bit * pow(2, i));

        // println!("bits at ({},{}) = {:b}", x, y, bits);
        bits
    }

    fn bounds(&self) -> Bounds {
        let keys: Vec<_> = self.pixels.iter().map(|(&key, _)| key).collect();
        Bounds {
            x_min: keys.iter().map(|&(x, _)| x).min().unwrap() - 2,
            x_max: keys.iter().map(|&(x, _)| x).max().unwrap() + 2,
            y_min: keys.iter().map(|&(_, y)| y).min().unwrap() - 2,
            y_max: keys.iter().map(|&(_, y)| y).max().unwrap() + 2,
        }
    }

    pub fn compact(&mut self, if_null: usize) {
        let bounds = self.bounds();
        for x in bounds.x_min..=bounds.x_max {
            for y in bounds.y_min..=bounds.y_max {
                if self.pixels.get(&(x, y)).is_none() {
                    self.pixels.insert((x, y), if_null);
                }
            }
        }
    }

    pub fn print(&self) {
        let bounds = self.bounds();
        for y in bounds.y_min..=bounds.y_max {
            for x in bounds.x_min..=bounds.x_max {
                let char = match self.pixels.get(&(x, y)) {
                    Some(n) if *n == 1 => '#',
                    Some(n) if *n == 0 => '.',
                    Some(_) => panic!("whhat"),
                    None => 'O',
                };
                print!("{}", char);
            }
            println!();
        }
    }

    pub fn enhance(&self, algorithm: &[usize], iter: usize) -> Self {
        let pixels: HashMap<(i32, i32), usize> = self
            .pixels
            .iter()
            .map(|(&(x, y), _pixel)| {
                (
                    (x, y),
                    algorithm[self.sample(x, y, iter_algorithm_pixel(algorithm, iter + 1))],
                )
            })
            .collect();

        Self { pixels }
    }
}

pub fn count_after_two_steps(input: &str) -> usize {
    let (algorithm, mut image) = parse(input);
    image.print();
    for i in 1..=2 {
        println!("\nEnahncement n.{}", i);
        image = image.enhance(&algorithm, i);
        image.compact(iter_algorithm_pixel(&algorithm, i));
        image.print();
    }
    image.pixels.iter().filter(|(_, &pixel)| pixel == 1).count()
}

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn example_input() {
        assert_eq!(count_after_two_steps(include_str!("../test.txt")), 35);
    }
}
