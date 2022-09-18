import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import Board from "./Board";
import { findPiece, isInCheck } from "./models/BoardState";
import { getPosition } from "./models/Position";
import { movePieceOnBoard } from "./slices/boardSlice";
import "./style.scss";

export default function App() {
    const board = useAppSelector((state) => state.board);
    const dispatch = useAppDispatch();

    return (
        <>
            <button
                onClick={() =>
                    dispatch(
                        movePieceOnBoard({
                            piece: findPiece(board, "a", 2) ?? {
                                type: "PAWN",
                                color: "WHITE",
                                position: getPosition("a", 2),
                            },
                            finalPosition: getPosition("a", 4),
                            capture: false,
                            emPassant: false,
                        })
                    )
                }
            >
                Move piece
            </button>
            <p>White in check: {isInCheck(board, "WHITE").toString()}</p>
            <p>Black in check: {isInCheck(board, "BLACK").toString()}</p>
            <Board />
        </>
    );
}
