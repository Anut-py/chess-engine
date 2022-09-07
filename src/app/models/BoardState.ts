import { isBasicMove, isCastleMove, Move, BasicMove } from "./Move";
import Piece, { Color, Pieces, PieceType } from "./Piece";
import Position, { fileToNum, getPosition, numToFile } from "./Position";

export enum CastleState {
  KINGSIDE,
  QUEENSIDE,
  BOTH,
}
export enum CastleType {
  KINGSIDE,
  QUEENSIDE,
}
export default interface BoardState {
  castle: {
    white?: CastleState;
    black?: CastleState;
  };
  emPassant?: {
    start: Position;
    end: Position;
    capture: Position;
    color: Color;
  };
  pieces: Piece[];
}

export function isOccupied(state: BoardState, file: string, rank: number) {
  return state.pieces.some(
    (p) => p.position.file === file && p.position.rank === rank
  );
}

export function findPiece(state: BoardState, file: string, rank: number) {
  return state.pieces.find(
    (p) => p.position.file === file && p.position.rank === rank
  );
}

export function findPieceIndex(state: BoardState, file: string, rank: number) {
  return state.pieces.findIndex(
    (p) => p.position.file === file && p.position.rank === rank
  );
}

function pawnLegalMoves(
  state: BoardState,
  currentPlayer: Color,
  piece: Piece,
  moves: Move[]
) {
  function promote(move: BasicMove): Move[] {
    return move.finalPosition?.rank === (currentPlayer === "WHITE" ? 8 : 1)
      ? (Object.keys(Pieces) as (keyof PieceType)[]).map((p) => ({
          ...move,
          promote: p,
        }))
      : [move];
  }
  const firstMove = piece.position.rank === (currentPlayer === "WHITE" ? 2 : 7);
  const multiplier = currentPlayer === "WHITE" ? 1 : -1;
  console.log(piece, state);
  if (
    !isOccupied(state, piece.position.file, piece.position.rank + multiplier)
  ) {
    moves.push(
      ...promote({
        piece,
        finalPosition: getPosition(
          piece.position.file,
          piece.position.rank + multiplier
        ),
        capture: false,
        emPassant: false,
      })
    );

    if (piece.position.file !== "a") {
      const leftFound = findPiece(
        state,
        numToFile((fileToNum(piece.position.file) - 1) as any),
        piece.position.rank + multiplier
      );

      if (leftFound !== undefined && leftFound.color !== currentPlayer) {
        moves.push(
          ...promote({
            capture: true,
            emPassant: false,
            finalPosition: leftFound.position,
            piece: piece,
          })
        );
      }
    }

    if (piece.position.file !== "h") {
      const rightFound = findPiece(
        state,
        numToFile((fileToNum(piece.position.file) + 1) as any),
        piece.position.rank + multiplier
      );

      if (rightFound !== undefined && rightFound.color !== currentPlayer) {
        moves.push(
          ...promote({
            capture: true,
            emPassant: false,
            finalPosition: rightFound.position,
            piece: piece,
          })
        );
      }
    }

    if (
      state.emPassant?.start.name === piece.position.name &&
      state.emPassant?.color === currentPlayer
    ) {
      moves.push({
        emPassant: true,
        capture: true,
        finalPosition: state.emPassant.end,
        piece: piece,
      });
    }

    if (
      firstMove &&
      !isOccupied(
        state,
        piece.position.file,
        piece.position.rank + multiplier * 2
      )
    ) {
      moves.push({
        piece,
        finalPosition: getPosition(
          piece.position.file,
          piece.position.rank + (currentPlayer === "WHITE" ? 2 : -2)
        ),
        capture: false,
        emPassant: false,
      });
    }
  }
}

function bishopLegalMoves(
  state: BoardState,
  currentPlayer: Color,
  piece: Piece,
  moves: Move[]
) {
  let pos: Position = piece.position;
  function trace(direction: number, position: Position) {
    let finalPosition = position;

    if ((direction & 2) === 2) {
      if (finalPosition.rank === 8) return;
      finalPosition = getPosition(finalPosition.file, finalPosition.rank + 1);
    } else {
      if (finalPosition.rank === 1) return;
      finalPosition = getPosition(finalPosition.file, finalPosition.rank - 1);
    }

    if ((direction & 1) === 1) {
      if (finalPosition.file === "h") return;
      finalPosition = getPosition(
        fileToNum(finalPosition.file) + 1,
        finalPosition.rank
      );
    } else {
      if (finalPosition.file === "a") return;
      finalPosition = getPosition(
        fileToNum(finalPosition.file) - 1,
        finalPosition.rank
      );
    }

    const found = findPiece(state, finalPosition.file, finalPosition.rank);

    if (found !== undefined && found.color !== currentPlayer) {
      moves.push({
        capture: true,
        emPassant: false,
        finalPosition: finalPosition,
        piece: piece,
      });
    } else if (found === undefined) {
      moves.push({
        capture: false,
        emPassant: false,
        finalPosition: finalPosition,
        piece: piece,
      });
      trace(direction, finalPosition);
    }
  }

  for (let i = 0; i < 4; i++) trace(i, pos);
}

export function legalMoves(state: BoardState, currentPlayer: Color): Move[] {
  const moves: Move[] = [];
  for (let piece of state.pieces.filter((p) => p.color === currentPlayer)) {
    if (piece.type === "PAWN") {
      pawnLegalMoves(state, currentPlayer, piece, moves);
    } else if (piece.type === "BISHOP") {
      bishopLegalMoves(state, currentPlayer, piece, moves);
    }
  }
  return moves;
}

export function movePiece(originalState: BoardState, move: Move) {
  const state: BoardState = JSON.parse(JSON.stringify(originalState));
  if (isCastleMove(move)) {
    const king = state.pieces.find(
      (p) => p.color === move.color && p.type === "KING"
    );
    if (move.type === CastleType.KINGSIDE) {
      const rook = state.pieces.find(
        (p) =>
          p.color === move.color && p.type === "ROOK" && p.position.file === "h"
      );
      if (king !== undefined && rook !== undefined) {
        king.position = getPosition("g", king.position.rank);
        rook.position = getPosition("f", rook.position.rank);
      }
    } else if (move.type === CastleType.QUEENSIDE) {
      const rook = state.pieces.find(
        (p) =>
          p.color === move.color && p.type === "ROOK" && p.position.file === "a"
      );
      if (king !== undefined && rook !== undefined) {
        king.position = getPosition("c", king.position.rank);
        rook.position = getPosition("d", rook.position.rank);
      }
    }
  } else if (isBasicMove(move)) {
    const piece = state.pieces.find(
      (p) => p.position.name === move.piece.position.name
    );
    if (piece !== undefined) {
      piece.position = move.finalPosition;
      if (move.capture) {
        const captureEmPassantRank =
          move.piece.color === "WHITE"
            ? move.finalPosition.rank - 1
            : move.finalPosition.rank + 1;
        const posToRemove = move.emPassant
          ? getPosition(move.finalPosition.file, captureEmPassantRank)
          : move.finalPosition;

        const removalIdx = state.pieces.findIndex(
          (p) => p.position.name === posToRemove.name
        );
        state.pieces.splice(removalIdx, 1);
      }
    }
  }
  return state;
}