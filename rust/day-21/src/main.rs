use day_21::{part1::losing_per_turns_score, part2::count_winner_universes};

fn main() {
    println!("Result: {}", losing_per_turns_score(6, 9));
    println!("Winner scores: {}", count_winner_universes(6, 9));
}
