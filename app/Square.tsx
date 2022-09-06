import * as React from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPieceId } from './models/Piece';
import { BoardFile, BoardRank, fileToNum } from './models/Position';
import { findPiece } from './models/BoardState';

export interface SquareProps {
  file: BoardFile;
  rank: BoardRank;
}

export default function Square(props: SquareProps) {
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const blackSquare = (fileToNum(props.file) + props.rank) % 2 === 1;
  const [image, setImage] = React.useState('');

  const piece = findPiece(board, props.file, props.rank - 1);

  useEffect(() => {
    if (piece !== undefined) {
      setImage(require(`../public/images/Chess_${getPieceId(piece)}t45.svg`));
    }
  }, [piece]);

  return (
    <>
      <div
        className={
          blackSquare ? 'board__square board__square--black' : 'board__square'
        }
      >
        {image !== '' && <img src={image} />}
      </div>
    </>
  );
}
