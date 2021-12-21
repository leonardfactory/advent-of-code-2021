use day_20::{part1::count_after_two_steps, part2::count_after_fifty_steps};

fn main() {
    let input = include_str!("../input.txt");
    println!("Enhanced 2s: {}", count_after_two_steps(input));
    println!("Enhanced 50s: {}", count_after_fifty_steps(input));
}
