import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { BoardFile, BoardRank, fileToNum } from "./models/Position";

export interface SquareProps {
  file: BoardFile;
  rank: BoardRank;
}

export default function Square(props: SquareProps) {
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const blackSquare = (fileToNum(props.file) + props.rank) % 2 === 1;

  return (
    <>
      <div
        className={
          blackSquare ? "board__square board__square--black" : "board__square"
        }
      ></div>
    </>
  );
}
