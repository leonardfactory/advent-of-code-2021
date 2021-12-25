use day_24::part1::{encode_model_number, monad_get_highest_valid, Program};

fn main() {
    let input = include_str!("../input.txt");
    let program = Program::load(input);

    // let chars = [
    //     'L', 'O', 'L', 'K', 'X', 'W', 'M', 'S', 'X', 'O', 'O', 'U', 'L', 'O',
    // ];
    // for i in 0_u8..25_u8 {
    //     println!(
    //         "{}: {}",
    //         i,
    //         chars
    //             .iter()
    //             .map(|&c| (((c as u8) - b'A' + i) % 26 + b'A') as char)
    //             .collect::<String>()
    //     )
    // }

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
    program.run(&encode_model_number(11118151637112));
    program.run(&encode_model_number(74929995999389));
    // println!("Max model no: {}", monad_get_highest_valid(input));
}
