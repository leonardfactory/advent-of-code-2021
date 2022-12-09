use day_24::part1::{encode_model_number, monad_get_highest_valid, Memory, Program};
use itertools::Itertools;

fn shift_encode(items: &[u8], key: u8) -> String {
    items
        .iter()
        .map(|&c| (((c as u8) - b'A' + key) % 26 + b'A') as char)
        .collect::<String>()
}

fn try_encodings(memory: Memory) {
    for i in 0_u8..=25_u8 {
        println!(
            "i={}, encoded: {}",
            i,
            shift_encode(
                &memory
                    .history
                    .iter()
                    .chunks(18)
                    .into_iter()
                    .map(|chunk| chunk.into_iter().nth(17).unwrap())
                    .map(|v| (v[3] % 26) as u8)
                    .collect_vec(),
                i
            )
        );
    }
}

fn main() {
    let input = include_str!("../input.txt");
    let program = Program::load(input);

    // let tests2: Vec<String> = vec![];
    // for i in 2..=9 {}
    // for test in tests {
    //     println!(
    //         "{}: {:?}",
    //         test,
    //         program.run(&encode_model_number(test)).vars
    //     );
    // }
    // println!(
    //     "Bounds: {}",
    //     monad_bounds(&Program::load(input), 11111111111111, 99999999999999)
    // );
    let min = program.run(&encode_model_number(11118151637112));
    try_encodings(min);
    let max = program.run(&encode_model_number(74929995999389));
    try_encodings(max);
    // println!("Max model no: {}", monad_get_highest_valid(input));
}
