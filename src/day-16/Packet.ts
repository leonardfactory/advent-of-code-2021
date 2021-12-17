import { Stream } from './Stream';

export enum PacketType {
  Literal = 4,
  Sum = 0,
  Prod = 1,
  Min = 2,
  Max = 3,
  Gt = 5,
  Lt = 6,
  Eq = 7
}

export type LiteralPacket = {
  version: number;
  type: PacketType.Literal;
  value: number;
};

export enum OperatorLengthType {
  Bits = 0,
  SubPackets = 1
}

export type OperatorPacket = {
  version: number;
  type: Exclude<PacketType, PacketType.Literal>;
  lengthType: OperatorLengthType;
  length: number;
  packets: Packet[];
};

export type Packet = LiteralPacket | OperatorPacket;

export function parsePacket(stream: Stream): Packet {
  const version = stream.readNumber(3);
  const type = stream.readNumber(3) as PacketType;
  switch (type) {
    // Literal value
    case PacketType.Literal: {
      return {
        version,
        type: PacketType.Literal,
        value: parseLiteral(stream)
      };
    }

    // Operator
    default: {
      return {
        version,
        type,
        ...parseOperator(stream)
      };
    }
  }
}

export function isLiteral(packet: Packet): packet is LiteralPacket {
  return packet.type === PacketType.Literal;
}

function parseLiteral(stream: Stream) {
  let start = stream.cursor;
  let valueBits = [] as number[];
  let bits: number[];
  let stopParsing = false;
  while (!stopParsing) {
    bits = stream.read(5);
    if (bits[0] === 0) stopParsing = true;
    valueBits.push(...bits.slice(1));
  }
  // console.log(`next cursor is: ${stream.cursor}, value is: ${valueBits.join('')}, parsed bits:\n ${stream.highlight(start, stream.cursor)}`); // prettier-ignore
  return stream.decode(valueBits);
}

function parseOperator(stream: Stream) {
  let start = stream.cursor;
  const lengthType = stream.readNumber(1) as OperatorLengthType;
  const length = stream.readNumber(
    lengthType === OperatorLengthType.Bits ? 15 : 11
  );
  // console.log(`Length is at:\n${stream.highlight(start, stream.cursor)}`);
  const packets: Packet[] = [];
  switch (lengthType) {
    case OperatorLengthType.Bits: {
      let end = stream.cursor + length - 1;
      while (stream.cursor < end) {
        packets.push(parsePacket(stream));
      }
      break;
    }

    case OperatorLengthType.SubPackets: {
      for (let i = 0; i < length; i++) {
        packets.push(parsePacket(stream));
      }
      break;
    }
  }

  return { lengthType, length, packets };
}
