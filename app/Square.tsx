import * as React from 'react';
import images from '../images';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPieceId } from './models/Piece';
import { BoardFile, BoardRank, fileToNum } from './models/Position';

export interface SquareProps {
  file: BoardFile;
  rank: BoardRank;
}

export default function Square(props: SquareProps) {
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const blackSquare = (fileToNum(props.file) + props.rank) % 2 === 1;
  const [image, setImage] = React.useState('');

  const piece = board.pieces.find(
    (p) => p.position.name === props.file + props.rank
  );

  useEffect(() => {
    if (piece !== undefined) {
      setImage(images[getPieceId(piece)]);
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
