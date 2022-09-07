import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findPiece, findPieceIndex, movePiece } from "../models/BoardState";
import GameState from "../models/GameState";
import { isMove, Move } from "../models/Move";
import { initialKeys, toggleColor } from "../models/Piece";
import { getPosition } from "../models/Position";
import { boardInitialState } from "./boardSlice";

const initialState: GameState = {
  currentMove: "WHITE",
  boardStates: [boardInitialState],
  moves: [],
  keys: [initialKeys()],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    movePieceInGame: (state: GameState, action: PayloadAction<Move>) => {
      const move = action.payload;
      if (isMove(move)) {
        const previousState = state.boardStates[state.boardStates.length - 1];

        state.boardStates.push(movePiece(previousState, move));
        state.moves.push(move);
        state.currentMove = toggleColor(state.currentMove);
        state.selectedPiece = undefined;

        if (move.capture) {
          const emPassantRank =
            move.piece.color === "WHITE"
              ? move.finalPosition.rank - 1
              : move.finalPosition.rank + 1;
          const captured = move.emPassant
            ? getPosition(move.finalPosition.file, emPassantRank)
            : move.finalPosition;

          state.keys.push(
            state.keys[state.keys.length]
              .slice() // Copy previous keys
              .splice(
                findPieceIndex(previousState, captured.file, captured.rank), // Index of captured piece
                1
              ) // Remove key of captured piece
          );
        } else {
          state.keys.push(state.keys[state.keys.length - 1].slice());
        }
      }
    },
    resetGame: (
      state: GameState,
      action: PayloadAction<GameState | undefined>
    ) => {
      const payload = action.payload ?? initialState;
      state.boardStates = payload.boardStates;
      state.moves = payload.moves;
      state.currentMove = payload.currentMove;
      state.selectedPiece = payload.selectedPiece;
    },
  },
});

export const { movePieceInGame, resetGame } = gameSlice.actions;
export const gameInitialState = initialState;

export default gameSlice.reducer;
