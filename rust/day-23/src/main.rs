use day_23::{part1::minimum_amphipods_energy, part2::minimum_amphipods_energy_four};

fn main() {
    let input = include_str!("../input.txt");
    let input2 = include_str!("../input2.txt");
    println!("Minimum energy: {}", minimum_amphipods_energy(input));
    println!(
        "Minimum energy (four): {}",
        minimum_amphipods_energy_four(input2)
    );
}
