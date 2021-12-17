type OnInputCallback = () => void;

/**
 * Gestisce un IO in memoria
 */
export class IO {
  public outputs: number[] = [];
  public inputRequest = 0;
  public latestReadOutput = 0;

  constructor(public inputs: number[] = [], public onInput: OnInputCallback) {}

  readInput() {
    if (this.inputs.length > 0) {
      return this.inputs.shift();
    }
    this.inputRequest++;
    return undefined;
  }

  sendInput(input: number) {
    this.inputRequest--;
    this.inputs.push(input);
    return this.onInput();
  }

  sendOutput(output: number) {
    // console.log('Sending output', output);
    this.outputs.push(output);
  }

  latestOutput() {
    return this.outputs[this.outputs.length - 1];
  }

  readOutputs() {
    const outputs = this.outputs.slice(
      this.latestReadOutput,
      this.outputs.length
    );
    this.latestReadOutput = this.outputs.length;
    return outputs;
  }
}
