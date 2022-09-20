import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { isOccupied } from "./models/BoardState";
import { Move } from "./models/Move";
import { BoardFile, BoardRank, fileToNum } from "./models/Position";
import { movePieceOnBoard } from "./slices/boardSlice";
import { movePieceInGame } from "./slices/gameSlice";

export interface SquareProps {
    file: BoardFile;
    rank: BoardRank;
    moves: Move[];
}

export default function Square(props: SquareProps) {
    const board = useAppSelector((state) => state.board);
    const dispatch = useAppDispatch();
    const blackSquare = (fileToNum(props.file) + props.rank) % 2 === 0;
    const clickable = props.moves.length > 0;
    const occupied = isOccupied(board, props.file, props.rank);

    return (
        <div
            className={`board__square ${
                blackSquare ? "board__square--black" : ""
            } ${clickable ? "board__square--clickable" : ""} ${
                clickable && occupied ? "board__square--capturable" : ""
            }`}
        >
            {clickable ? (
                <div
                    className="board__square-overlay"
                    onClick={() => {
                        if (clickable) {
                            dispatch(movePieceInGame(props.moves[0]));
                            dispatch(movePieceOnBoard(props.moves[0]));
                        }
                    }}
                >
                    <div
                        className={!occupied ? "board__square-marker" : ""}
                    ></div>
                </div>
            ) : null}
        </div>
    );
}
