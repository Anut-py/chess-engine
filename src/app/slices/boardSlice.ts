import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BoardState, {
    CastleState,
    movePiece as movePiece1,
} from "../models/BoardState";
import { isMove, Move } from "../models/Move";
import { initialPieces } from "../models/Piece";

const initialState: BoardState = {
    castle: {
        white: CastleState.BOTH,
        black: CastleState.BOTH,
    },
    pieces: initialPieces(),
};

export const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        movePieceOnBoard: (state: BoardState, action: PayloadAction<Move>) => {
            const move = action.payload;
            if (isMove(move)) {
                const newState = movePiece1(state, move);
                state.castle = newState.castle;
                state.pieces = newState.pieces;
                state.emPassant = newState.emPassant;
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

export const { movePieceOnBoard, resetBoard } = boardSlice.actions;
export const boardInitialState = initialState;

export default boardSlice.reducer;
