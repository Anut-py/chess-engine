import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { BoardFile, BoardRank, FileToNum, numToFile } from './models/Position';
import { movePiece } from './slices/boardSlice';
import Square from './Square';

export default function Board() {
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const squares: ReturnType<typeof Square>[][] = [];

  for (let i = 1; i <= 8; i++) {
    let row = [];
    for (let j = 1; j <= 8; j++) {
      row.push(
        Square({
          file: numToFile(j as FileToNum<BoardFile>),
          rank: i as BoardRank,
        })
      );
    }
    squares.push(row);
  }

  return (
    <div className="board">
      {squares.map((row) => (
        <div className="board__row">{row}</div>
      ))}
    </div>
  );
}
