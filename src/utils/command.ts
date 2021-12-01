export function parseInput() {
  if (process.argv[2] === '--test') return 'test.txt';
  return 'input.txt';
}
