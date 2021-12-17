import fs from 'fs';
import { parseInput } from '@utils/command';
import { Stream } from './Stream';
import { inspect } from 'util';
import { isLiteral, Packet, PacketType } from './Packet';
import { sum } from 'lodash';

function sumPacketsVersion(packet: Packet): number {
  return isLiteral(packet)
    ? packet.version
    : packet.version + sum(packet.packets.map(p => sumPacketsVersion(p)));
}

function run() {
  const stream = Stream.fromInput();
  const packet = stream.parse();
  console.log(`Sum of versions: ${sumPacketsVersion(packet)}`);
  // console.log(`Packets:`, inspect(packets, { colors: true, depth: 3 }));
}

if (!module.parent) {
  run();
}
