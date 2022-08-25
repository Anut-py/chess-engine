import { Move } from './Move';
import Piece, { Color } from './Piece';
import Position, { BoardFile, BoardRank, getPosition } from './Position';

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

export function isOccupied(state: BoardState, file: string, rank: number) {
  return state.pieces.some(
    (p) => p.position.file === file && p.position.rank === rank + 1
  );
}

export function findPiece(state: BoardState, file: string, rank: number) {
  return state.pieces.find(
    (p) => p.position.file === file && p.position.rank === rank + 1
  );
}

export function legalMoves(state: BoardState, currentPlayer: Color): Move[] {
  const moves: Move[] = [];
  for (let piece of state.pieces.filter((p) => p.color === currentPlayer)) {
    if (piece.type === 'PAWN') {
      const firstMove =
        piece.position.rank === (currentPlayer === 'WHITE' ? 2 : 8);
      if (!isOccupied(state, piece.position.file, piece.position.rank)) {
        moves.push({
          piece,
          finalPosition: getPosition(
            piece.position.file,
            piece.position.rank + (currentPlayer === 'WHITE' ? 1 : -1)
          ),
          capture: false,
          emPassant: false,
        });

        if (firstMove) {
          moves.push({
            piece,
            finalPosition: getPosition(
              piece.position.file,
              piece.position.rank + (currentPlayer === 'WHITE' ? 2 : -2)
            ),
            capture: false,
            emPassant: false,
          });
        }
      }
    }
  }
  return moves;
}
