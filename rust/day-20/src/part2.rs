use crate::part1::*;

pub fn count_after_fifty_steps(input: &str) -> usize {
    let (algorithm, mut image) = parse(input);
    for i in 1..=50 {
        println!("\nEnahncement n.{}", i);
        image = image.enhance(&algorithm, i);
        image.compact(iter_algorithm_pixel(&algorithm, i));
    }
    image.print();
    image.pixels.iter().filter(|(_, &pixel)| pixel == 1).count()
}
