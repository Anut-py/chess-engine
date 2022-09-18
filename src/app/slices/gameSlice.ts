import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findPieceIndex, movePiece } from "../models/BoardState";
import GameState from "../models/GameState";
import { isMove, Move } from "../models/Move";
import { initialKeys, toggleColor } from "../models/Piece";
import Position, { getPosition } from "../models/Position";
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
                const previousState =
                    state.boardStates[state.boardStates.length - 1];

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

                    const copied = state.keys[state.keys.length - 1].slice(); // Copy previous keys

                    copied.splice(
                        findPieceIndex(
                            previousState,
                            captured.file,
                            captured.rank
                        ), // Index of captured piece
                        1
                    ); // Remove key of captured piece

                    state.keys.push(copied);
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
        selectPiece(
            state: GameState,
            action: PayloadAction<Position | undefined>
        ) {
            if (action.payload !== undefined) {
                const found = state.boardStates[
                    state.boardStates.length - 1
                ].pieces.find((p) => p.position.name === action.payload?.name);
                if (found !== undefined) state.selectedPiece = found;
            } else {
                state.selectedPiece = undefined;
            }
        },
    },
});

export const { movePieceInGame, resetGame, selectPiece } = gameSlice.actions;
export const gameInitialState = initialState;

export default gameSlice.reducer;
