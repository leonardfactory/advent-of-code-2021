use day_22::{part1::count_on_cubes, part2::reboot_reactor};

fn main() {
    let input = include_str!("../input.txt");
    println!("On cubes: {}", count_on_cubes(input));
    println!("Rebooted cubes: {}", reboot_reactor(input));
}
