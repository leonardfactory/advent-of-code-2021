use day_24::part1::monad_get_highest_valid;

fn main() {
    let input = include_str!("../input.txt");
    println!("Max model no: {}", monad_get_highest_valid(input));
}
