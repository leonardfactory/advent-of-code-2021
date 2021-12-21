use day_19::{part1::count_beacons, part2::largest_distance};

fn main() {
    println!(
        "Count Beacons: {}",
        count_beacons(include_str!("../input.txt"))
    );
    println!(
        "Max Distance: {}",
        largest_distance(include_str!("../input.txt"))
    );
}
