import images from '../../images';
import Position, { getPosition, isPosition } from './Position';

export const Pieces = {
  KING: {
    points: Infinity,
    prefix: 'K',
    img: 'k',
  },
  QUEEN: {
    points: 9,
    prefix: 'Q',
    img: 'q',
  },
  ROOK: {
    points: 5,
    prefix: 'R',
    img: 'r',
  },
  BISHOP: {
    points: 3,
    prefix: 'B',
    img: 'b',
  },
  KNIGHT: {
    points: 3,
    prefix: 'N',
    img: 'n',
  },
  PAWN: {
    points: 1,
    prefix: '',
    img: 'p',
  },
} as const;
export type PieceType = typeof Pieces;
export type AnyPiece = PieceType[keyof PieceType];
export type Color = 'WHITE' | 'BLACK';

export function initialPieces(): Piece[] {
  const toReturn: Piece[] = [];
  for (let i = 1; i <= 8; i++) {
    toReturn.push({
      type: 'PAWN',
      color: 'WHITE',
      position: getPosition(i, 2),
    });
    toReturn.push({
      type: 'PAWN',
      color: 'BLACK',
      position: getPosition(i, 7),
    });
  }

  const doublePieces: Array<keyof PieceType> = ['ROOK', 'BISHOP', 'KNIGHT'];
  for (let i = 0; i < 3; i++) {
    toReturn.push({
      type: doublePieces[i],
      color: 'WHITE',
      position: getPosition(1 + i, 1),
    });
    toReturn.push({
      type: doublePieces[i],
      color: 'WHITE',
      position: getPosition(8 - i, 1),
    });
    toReturn.push({
      type: doublePieces[i],
      color: 'BLACK',
      position: getPosition(1 + i, 8),
    });
    toReturn.push({
      type: doublePieces[i],
      color: 'BLACK',
      position: getPosition(8 - i, 8),
    });
  }

  const singlePieces: Array<keyof PieceType> = ['QUEEN', 'KING'];
  for (let i = 0; i < 2; i++) {
    toReturn.push({
      type: singlePieces[i],
      color: 'WHITE',
      position: getPosition(4 + i, 1),
    });
    toReturn.push({
      type: singlePieces[i],
      color: 'BLACK',
      position: getPosition(4 + i, 8),
    });
  }
  return toReturn;
}

export function isColor(color: string): color is Color {
  return color === 'WHITE' || color === 'BLACK';
}

export function isPiece(piece: any): piece is Piece {
  return (
    piece !== null &&
    piece !== undefined &&
    typeof piece === 'object' &&
    piece.type in Pieces &&
    isColor(piece.color) &&
    isPosition(piece.position)
  );
}

export function getPieceId(piece: Piece): keyof typeof images {
  return (Pieces[piece.type].img +
    (piece.color === 'WHITE' ? 'l' : 'd')) as any;
}

export default interface Piece {
  type: keyof PieceType;
  color: Color;
  position: Position;
}
