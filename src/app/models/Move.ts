import { CastleType } from "./BoardState";
import Piece, { Color, isColor, isPiece, PieceType } from "./Piece";
import Position, { isPosition } from "./Position";

export interface BasicMove {
    piece: Piece;
    finalPosition: Position;
    capture: boolean;
    emPassant: boolean;
    promote?: keyof PieceType;
}

export interface CastleMove {
    color: Color;
    type: CastleType;
}

export function isBasicMove(move: any): move is BasicMove {
    return (
        move !== null &&
        move !== undefined &&
        typeof move === "object" &&
        isPiece(move.piece) &&
        isPosition(move.finalPosition) &&
        typeof move.capture === "boolean" &&
        typeof move.emPassant === "boolean"
    );
}

export function isCastleMove(move: any): move is CastleMove {
    return (
        move !== null &&
        move !== undefined &&
        typeof move === "object" &&
        isColor(move.color) &&
        (move.castleType === CastleType.KINGSIDE ||
            move.castleType === CastleType.QUEENSIDE)
    );
}

export function isMove(move: any): move is Move {
    return isBasicMove(move) || isCastleMove(move);
}

type Not<T> = {
    [Key in keyof T]?: never;
};
export type Move =
    | (Not<BasicMove> & CastleMove)
    | (Not<CastleMove> & BasicMove);
