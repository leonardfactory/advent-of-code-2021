export function parseInput() {
  if (process.argv[2] === '--test') return 'test.txt';
  if (process.argv[2] === '--test2') return 'test-2.txt';
  if (process.argv[2] === '--input2') return 'input-2.txt';
  return 'input.txt';
}
