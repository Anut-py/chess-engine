import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import Figurine from "./Figurine";
import { legalMoves } from "./models/BoardState";
import { BoardFile, BoardRank, FileToNum, numToFile } from "./models/Position";
import Square from "./Square";

export default function Board() {
  const board = useAppSelector((state) => state.board);
  const game = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const squares: ReturnType<typeof Square>[][] = [];

  for (let i = 1; i <= 8; i++) {
    let row = [];
    for (let j = 1; j <= 8; j++) {
      row.push(
        <Square
          file={numToFile(j as FileToNum<BoardFile>)}
          rank={i as BoardRank}
          key={j.toString()}
        />
      );
    }
    squares.push(row);
  }

  return (
    <>
      <div className="board">
        {squares.map((row, idx) => (
          <div key={idx.toString()} className="board__row">
            {row}
          </div>
        ))}
        {board.pieces.map((piece, idx) => (
          <Figurine
            key={game.keys[game.keys.length - 1][idx]}
            piece={piece}
          ></Figurine>
        ))}
      </div>
      {legalMoves(board, "WHITE").map((move, i) => (
        <p key={i}>{JSON.stringify(move)}</p>
      ))}
    </>
  );
}
