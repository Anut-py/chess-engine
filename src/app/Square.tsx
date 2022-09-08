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
  move?: Move;
}

export default function Square(props: SquareProps) {
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const blackSquare = (fileToNum(props.file) + props.rank) % 2 === 0;
  const clickable = props.move !== undefined;
  const occupied = isOccupied(board, props.file, props.rank);

  return (
    <div
      className={`board__square ${blackSquare ? "board__square--black" : ""} ${
        clickable ? "board__square--clickable" : ""
      } ${clickable && occupied ? "board__square--capturable" : ""}`}
    >
      {props.move !== undefined ? (
        <div
          className="board__square-overlay"
          onClick={() => {
            if (props.move !== undefined) {
              dispatch(movePieceInGame(props.move));
              dispatch(movePieceOnBoard(props.move));
            }
          }}
        >
          <div className={!occupied ? "board__square-marker" : ""}></div>
        </div>
      ) : null}
    </div>
  );
}
