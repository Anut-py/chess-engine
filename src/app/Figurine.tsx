import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import Piece, { getPieceId } from "./models/Piece";
import { selectPiece } from "./slices/gameSlice";

export interface FigurineProps {
    piece: Piece;
    canMove: boolean;
}

export default function Figurine(props: FigurineProps) {
    const game = useAppSelector((state) => state.game);
    const dispatch = useAppDispatch();

    return (
        <img
            src={
                process.env.PUBLIC_URL +
                `/images/Chess_${getPieceId(props.piece)}t45.svg`
            }
            onClick={() => {
                if (props.canMove) {
                    dispatch(selectPiece(props.piece.position));
                }
                if (
                    game.selectedPiece?.position.name ===
                    props.piece.position.name
                ) {
                    dispatch(selectPiece(undefined));
                }
            }}
            className={`board__piece board__piece--${
                props.piece.position.name
            } ${props.canMove ? "board__piece--clickable" : ""} ${
                game.selectedPiece?.position.name === props.piece.position.name
                    ? "board__piece--selected"
                    : ""
            }`}
        />
    );
}
