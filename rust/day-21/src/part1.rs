pub fn losing_per_turns_score(start1: usize, start2: usize) -> usize {
    let (loser, rolls) = play(start1, start2);
    loser * rolls
}

pub struct Game {
    player1: Player,
    player2: Player,
}

impl Game {
    pub fn new(start1: usize, start2: usize) -> Self {
        Self {
            player1: Player {
                score: 0,
                pos: start1 - 1,
            },
            player2: Player {
                score: 0,
                pos: start2 - 1,
            },
        }
    }

    pub fn advance(&mut self, player: usize, amount: usize) {
        match player {
            0 => {
                self.player1.pos = (self.player1.pos + amount) % 10;
                self.player1.score += self.player1.pos + 1;
            }
            1 => {
                self.player2.pos = (self.player2.pos + amount) % 10;
                self.player2.score += self.player2.pos + 1;
            }
            _ => panic!("Unknown player"),
        }
    }

    pub fn turn_result(&self) -> Turn {
        match (self.player1.score, self.player2.score) {
            (s1, s2) if s1 >= 1000 => Turn::Finish(s2),
            (s1, s2) if s2 >= 1000 => Turn::Finish(s1),
            _ => Turn::Continue,
        }
    }
}

pub enum Turn {
    Continue,
    Finish(usize), // loser score
}

pub struct Player {
    score: usize,
    pos: usize,
}

pub fn launch_dice(turn: usize) -> usize {
    let result = (turn * 3 + 1) % 100;
    3 * result + 3
}

pub fn play(start1: usize, start2: usize) -> (usize, usize) {
    let mut game = Game::new(start1, start2);
    let mut turn = 0_usize;
    loop {
        // print!(
        //     "turn={}, player1={}, player2={}",
        //     turn, game.player1.score, game.player2.score
        // );
        let player = turn % 2;
        let dice = launch_dice(turn);
        game.advance(player, dice);
        match game.turn_result() {
            Turn::Continue => {}
            Turn::Finish(loser) => return (loser, (turn + 1) * 3),
        }

        turn += 1;
    }
}

#[cfg(test)]
pub mod tests {
    use crate::part1::*;

    #[test]
    fn example() {
        assert_eq!(losing_per_turns_score(4, 8), 739785);
    }
}
