import * as React from "react";
import Piece, { getPieceId } from "./models/Piece";

export interface FigurineProps {
  piece: Piece;
}

export default function Figurine(props: FigurineProps) {
  return (
    <img
      src={
        process.env.PUBLIC_URL +
        `/images/Chess_${getPieceId(props.piece)}t45.svg`
      }
      className={`board__piece board__piece--${props.piece.position.name}`}
    />
  );
}
