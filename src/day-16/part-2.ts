import fs from 'fs';
import { sum } from 'lodash';
import { Packet, PacketType } from './Packet';
import { Stream } from './Stream';

export function evaluate(packet: Packet): number {
  if (packet.type === PacketType.Literal) return packet.value;

  const values = packet.packets.map(evaluate);

  switch (packet.type) {
    case PacketType.Sum:
      return sum(values);
    case PacketType.Prod:
      return values.reduce((product, value) => product * value, 1);
    case PacketType.Min:
      return Math.min(...values);
    case PacketType.Max:
      return Math.max(...values);
    case PacketType.Gt:
      return values[0] > values[1] ? 1 : 0;
    case PacketType.Lt:
      return values[0] < values[1] ? 1 : 0;
    case PacketType.Eq:
      return values[0] === values[1] ? 1 : 0;
  }
}

function run() {
  const stream = Stream.fromInput();
  const packet = stream.parse();
  console.log(`Value: ${evaluate(packet)}`);
  // console.log(`Packets:`, inspect(packets, { colors: true, depth: 3 }));
}

if (!module.parent) {
  run();
}
