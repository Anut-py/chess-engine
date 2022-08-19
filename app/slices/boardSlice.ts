import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BoardState, { CastleState, CastleType } from '../models/BoardState';
import { isBasicMove, isCastleMove, isMove, Move } from '../models/Move';
import { initialPieces } from '../models/Piece';
import { getPosition } from '../models/Position';

const initialState: BoardState = {
  castle: {
    white: CastleState.BOTH,
    black: CastleState.BOTH,
  },
  pieces: initialPieces(),
} as const;

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    movePiece: (state: BoardState, action: PayloadAction<Move>) => {
      const move = action.payload;
      if (isMove(move)) {
        if (isCastleMove(move)) {
          const king = state.pieces.find(
            (p) => p.color === move.color && p.type === 'KING'
          );
          if (move.type === CastleType.KINGSIDE) {
            const rook = state.pieces.find(
              (p) =>
                p.color === move.color &&
                p.type === 'ROOK' &&
                p.position.file === 'h'
            );
            if (king !== undefined && rook !== undefined) {
              king.position = getPosition('g', king.position.rank);
              rook.position = getPosition('f', rook.position.rank);
            }
          } else if (move.type === CastleType.QUEENSIDE) {
            const rook = state.pieces.find(
              (p) =>
                p.color === move.color &&
                p.type === 'ROOK' &&
                p.position.file === 'a'
            );
            if (king !== undefined && rook !== undefined) {
              king.position = getPosition('c', king.position.rank);
              rook.position = getPosition('d', rook.position.rank);
            }
          }
        } else if (isBasicMove(move)) {
          const piece = state.pieces.find(
            (p) => p.position.name === move.piece.position.name
          );
          if (piece !== undefined) {
            piece.position = move.finalPosition;
            if (move.capture) {
              const captureEmPassantRank =
                move.piece.color === 'WHITE'
                  ? move.finalPosition.rank - 1
                  : move.finalPosition.rank + 1;
              const posToRemove = move.emPassant
                ? getPosition(move.finalPosition.file, captureEmPassantRank)
                : move.finalPosition;

              const removalIdx = state.pieces.findIndex(
                (p) => p.position.name === posToRemove.name
              );
              state.pieces.splice(removalIdx, 1);
            }
          }
        }
      }
    },
    resetBoard: (
      state: BoardState,
      action: PayloadAction<BoardState | undefined>
    ) => {
      const payload = action.payload ?? initialState;
      state.castle = payload.castle;
      state.pieces = payload.pieces;
      state.emPassant = payload.emPassant;
    },
  },
});

export const { movePiece } = boardSlice.actions;

export default boardSlice.reducer;
