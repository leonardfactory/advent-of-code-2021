pub fn count_winner_universes(start1: usize, start2: usize) -> usize {
    turn((Player::new(start1), Player::new(start2)), 0)
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Player {
    score: usize,
    pos: usize,
}

impl Player {
    fn new(start: usize) -> Self {
        Self {
            score: 0,
            pos: start - 1,
        }
    }
    fn advance(&self, amount: usize) -> Self {
        let next_pos = (self.pos + amount) % 10;
        Self {
            score: self.score + next_pos + 1,
            pos: next_pos,
        }
    }
}

pub type Game = (Player, Player);

// dice x 3 = 3..=9
// 3: (1,1,1) = 1
// 4: (1,2,1) (2,1,1) (1,1,2)  = 3
// 5: (1,1,3) * 3 + (1,2,2) * 3 = 6
// 6: (2,2,2) * 1 + (1,2,3) * 6 = 4
// 7: (2,2,3) * 3 + (1,3,3) * 3 = 6
// 8: (2,3,3) * 3 = 3
// 9: (3,3,3)= 1
// pos1 = (pos0 + dice) % 10
pub fn turn(game: Game, iter: usize) -> usize {
    match (game.0.score, game.1.score) {
        (s1, _) if s1 >= 21 => return 1,
        (_, s2) if s2 >= 21 => return 0,
        _ => {}
    }

    match iter % 2 {
        1 => {
            turn((game.0, game.1.advance(3)), iter + 1)
                + turn((game.0, game.1.advance(4)), iter + 1) * 3
                + turn((game.0, game.1.advance(5)), iter + 1) * 6
                + turn((game.0, game.1.advance(6)), iter + 1) * 7
                + turn((game.0, game.1.advance(7)), iter + 1) * 6
                + turn((game.0, game.1.advance(8)), iter + 1) * 3
                + turn((game.0, game.1.advance(9)), iter + 1)
        }
        0 => {
            turn((game.0.advance(3), game.1), iter + 1)
                + turn((game.0.advance(4), game.1), iter + 1) * 3
                + turn((game.0.advance(5), game.1), iter + 1) * 6
                + turn((game.0.advance(6), game.1), iter + 1) * 7
                + turn((game.0.advance(7), game.1), iter + 1) * 6
                + turn((game.0.advance(8), game.1), iter + 1) * 3
                + turn((game.0.advance(9), game.1), iter + 1)
        }
        _ => panic!("Nope"),
    }
}

#[cfg(test)]
pub mod tests {
    use crate::part2::*;

    #[test]
    fn example() {
        assert_eq!(count_winner_universes(4, 8), 444356092776315);
    }
}
