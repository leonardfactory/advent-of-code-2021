export class StringIterator {
  cursor = 1;
  constructor(public raw: string) {}

  next() {
    return this.raw[this.cursor++];
  }
}
