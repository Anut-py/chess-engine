import Piece from './Piece';
import Position from './Position';

export enum CastleState {
  KINGSIDE,
  QUEENSIDE,
  BOTH,
}
export enum CastleType {
  KINGSIDE,
  QUEENSIDE,
}
export default interface BoardState {
  castle: {
    white?: CastleState;
    black?: CastleState;
  };
  emPassant?: {
    start: Position;
    end: Position;
    capture: Position;
  };
  pieces: Piece[];
}
