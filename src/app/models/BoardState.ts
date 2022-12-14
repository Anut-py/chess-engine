import { BasicMove, isBasicMove, isCastleMove, Move } from "./Move";
import Piece, { Color, toggleColor } from "./Piece";
import Position, {
    BoardRank,
    fileToNum,
    getPosition,
    isValidPosition,
    numToFile,
} from "./Position";

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
        starts: Position[];
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

function pawnMoves(
    state: BoardState,
    currentPlayer: Color,
    piece: Piece,
    moves: Move[]
) {
    function promote(move: BasicMove): Move[] {
        return move.finalPosition?.rank === (currentPlayer === "WHITE" ? 8 : 1)
            ? (["QUEEN", "ROOK", "BISHOP", "KNIGHT"] as const).map((p) => ({
                  ...move,
                  promote: p,
              }))
            : [move];
    }
    const firstMove =
        piece.position.rank === (currentPlayer === "WHITE" ? 2 : 7);
    const multiplier = currentPlayer === "WHITE" ? 1 : -1;
    if (
        !isOccupied(
            state,
            piece.position.file,
            piece.position.rank + multiplier
        )
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
        state.emPassant?.starts.some((p) => p.name === piece.position.name) &&
        state.emPassant?.color === currentPlayer
    ) {
        moves.push({
            emPassant: true,
            capture: true,
            finalPosition: state.emPassant.end,
            piece: piece,
        });
    }
}

function bishopMoves(
    state: BoardState,
    currentPlayer: Color,
    piece: Piece,
    moves: Move[]
) {
    function trace(direction: number, position: Position) {
        let finalPosition = position;

        if ((direction & 2) === 2) {
            if (finalPosition.rank === 8) return;
            finalPosition = getPosition(
                finalPosition.file,
                finalPosition.rank + 1
            );
        } else {
            if (finalPosition.rank === 1) return;
            finalPosition = getPosition(
                finalPosition.file,
                finalPosition.rank - 1
            );
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

    for (let i = 0; i < 4; i++) trace(i, piece.position);
}

function knightMoves(
    state: BoardState,
    currentPlayer: Color,
    piece: Piece,
    moves: Move[]
) {
    function process(direction: number) {
        let file = fileToNum(piece.position.file);
        let rank = piece.position.rank;
        const firstDouble = (direction & 4) === 4;

        if ((direction & 2) === 2) {
            rank += firstDouble ? 2 : 1;
        } else {
            rank -= firstDouble ? 2 : 1;
        }

        if ((direction & 1) === 1) {
            file += firstDouble ? 1 : 2;
        } else {
            file -= firstDouble ? 1 : 2;
        }

        if (isValidPosition(file, rank)) {
            const fileLetter = numToFile(file as any);
            if (
                isOccupied(state, fileLetter, rank) &&
                findPiece(state, fileLetter, rank)?.color !== currentPlayer
            ) {
                moves.push({
                    piece: piece,
                    finalPosition: getPosition(file, rank),
                    emPassant: false,
                    capture: true,
                });
            } else if (!isOccupied(state, fileLetter, rank)) {
                moves.push({
                    piece: piece,
                    finalPosition: getPosition(file, rank),
                    emPassant: false,
                    capture: false,
                });
            }
        }
    }

    for (let i = 0; i < 8; i++) process(i);
}

function rookMoves(
    state: BoardState,
    currentPlayer: Color,
    piece: Piece,
    moves: Move[]
) {
    function trace(direction: number, position: Position) {
        let file = fileToNum(position.file);
        let rank = position.rank;

        if (direction == 0) file++;
        if (direction == 1) file--;
        if (direction == 2) rank++;
        if (direction == 3) rank--;

        if (isValidPosition(file, rank)) {
            const found = findPiece(state, numToFile(file as any), rank);
            const finalPosition = getPosition(file, rank);

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
    }

    for (let i = 0; i < 4; i++) trace(i, piece.position);
}

function kingMoves(
    state: BoardState,
    currentPlayer: Color,
    piece: Piece,
    moves: Move[]
) {
    function process(direction: number) {
        let file = fileToNum(piece.position.file);
        let rank = piece.position.rank;
        const dirNum = direction & 3;

        if ((direction & 4) === 4) {
            if (dirNum == 0) file++;
            if (dirNum == 1) file--;
            if (dirNum == 2) rank++;
            if (dirNum == 3) rank--;
        } else {
            if ((direction & 1) === 1) file++;
            else file--;

            if ((direction & 2) === 2) rank++;
            else rank--;
        }

        if (isValidPosition(file, rank)) {
            const fileLetter = numToFile(file as any);
            const finalPosition = getPosition(file, rank);
            if (
                isOccupied(state, fileLetter, rank) &&
                findPiece(state, fileLetter, rank)?.color !== currentPlayer
            ) {
                moves.push({
                    capture: true,
                    emPassant: false,
                    piece: piece,
                    finalPosition: finalPosition,
                });
            } else if (!isOccupied(state, fileLetter, rank)) {
                moves.push({
                    capture: false,
                    emPassant: false,
                    piece: piece,
                    finalPosition: finalPosition,
                });
            }
        }
    }

    for (let i = 0; i < 8; i++) process(i);
}

function isCastleIllegal(
    state: BoardState,
    currentPlayer: Color,
    positions: Position[],
    king: Piece
) {
    return positions.some(
        (pos) =>
            isOccupied(state, pos.file, pos.rank) ||
            isInCheck(
                movePiece(state, {
                    piece: king,
                    capture: false,
                    emPassant: false,
                    finalPosition: pos,
                }),
                currentPlayer
            )
    );
}

function castleLogic(
    state: BoardState,
    currentPlayer: Color,
    col: "white" | "black",
    rank: BoardRank,
    king: Piece,
    moves: Move[]
) {
    if (
        state.castle[col] === CastleState.BOTH ||
        state.castle[col] === CastleState.KINGSIDE
    ) {
        if (
            !isCastleIllegal(
                state,
                currentPlayer,
                [getPosition("f", rank), getPosition("g", rank)],
                king
            )
        )
            moves.push({ color: currentPlayer, type: CastleType.KINGSIDE });
    }

    if (
        state.castle[col] === CastleState.BOTH ||
        state.castle[col] === CastleState.QUEENSIDE
    ) {
        if (
            !isCastleIllegal(
                state,
                currentPlayer,
                [getPosition("d", rank), getPosition("c", rank)],
                king
            ) &&
            !isOccupied(state, "b", rank)
        )
            moves.push({
                color: currentPlayer,
                type: CastleType.QUEENSIDE,
            });
    }
}

function castleMoves(state: BoardState, currentPlayer: Color, moves: Move[]) {
    if (isInCheck(state, currentPlayer)) return;

    const col = currentPlayer === "WHITE" ? "white" : "black";
    const rank = currentPlayer === "WHITE" ? 1 : 8;
    const king = state.pieces.find(
        (p) => p.type === "KING" && p.color === currentPlayer
    );
    if (king !== undefined) {
        castleLogic(state, currentPlayer, col, rank, king, moves);
    }
}

export function allowedMoves(
    state: BoardState,
    currentPlayer: Color,
    checkForCheck = false
): Move[] {
    const moves: Move[] = [];
    for (let piece of state.pieces.filter((p) => p.color === currentPlayer)) {
        switch (piece.type) {
            case "PAWN":
                pawnMoves(state, currentPlayer, piece, moves);
                break;
            case "BISHOP":
                bishopMoves(state, currentPlayer, piece, moves);
                break;
            case "KNIGHT":
                knightMoves(state, currentPlayer, piece, moves);
                break;
            case "ROOK":
                rookMoves(state, currentPlayer, piece, moves);
                break;
            case "QUEEN":
                rookMoves(state, currentPlayer, piece, moves);
                bishopMoves(state, currentPlayer, piece, moves);
                break;
            case "KING":
                kingMoves(state, currentPlayer, piece, moves);
                break;
        }
    }
    if (!checkForCheck) castleMoves(state, currentPlayer, moves);
    return moves;
}

export function isInCheck(state: BoardState, player: Color) {
    const moves = allowedMoves(state, toggleColor(player), true);
    const kingPosition = state.pieces.find(
        (p) => p.type === "KING" && p.color === player
    )?.position?.name;

    return moves.some(
        (move) =>
            isBasicMove(move) &&
            move.capture &&
            move.finalPosition.name === kingPosition
    );
}

export function legalMoves(state: BoardState, currentPlayer: Color) {
    return allowedMoves(state, currentPlayer).filter(
        (move) => !isInCheck(movePiece(state, move), currentPlayer)
    );
}

export function movePiece(originalState: BoardState, move: Move) {
    const state: BoardState = JSON.parse(JSON.stringify(originalState));
    const col = move.color === "WHITE" ? "white" : "black";

    state.emPassant = undefined;
    if (isCastleMove(move)) {
        const king = state.pieces.find(
            (p) => p.color === move.color && p.type === "KING"
        );
        if (move.type === CastleType.KINGSIDE) {
            const rook = state.pieces.find(
                (p) =>
                    p.color === move.color &&
                    p.type === "ROOK" &&
                    p.position.file === "h"
            );
            if (king !== undefined && rook !== undefined) {
                king.position = getPosition("g", king.position.rank);
                rook.position = getPosition("f", rook.position.rank);
            }
        } else if (move.type === CastleType.QUEENSIDE) {
            const rook = state.pieces.find(
                (p) =>
                    p.color === move.color &&
                    p.type === "ROOK" &&
                    p.position.file === "a"
            );
            if (king !== undefined && rook !== undefined) {
                king.position = getPosition("c", king.position.rank);
                rook.position = getPosition("d", rook.position.rank);
            }
        }
        state.castle[col] = undefined;
    } else if (isBasicMove(move)) {
        const piece = state.pieces.find(
            (p) => p.position.name === move.piece.position.name
        );
        if (piece !== undefined) {
            if (
                piece.type === "PAWN" &&
                Math.abs(move.finalPosition.rank - piece.position.rank) === 2
            ) {
                const positions = [];

                if (move.finalPosition.file !== "a") {
                    positions.push(
                        getPosition(
                            fileToNum(move.finalPosition.file) - 1,
                            move.finalPosition.rank
                        )
                    );
                }

                if (move.finalPosition.file !== "h") {
                    positions.push(
                        getPosition(
                            fileToNum(move.finalPosition.file) + 1,
                            move.finalPosition.rank
                        )
                    );
                }

                state.emPassant = {
                    capture: move.finalPosition,
                    color: toggleColor(piece.color),
                    starts: positions,
                    end: getPosition(
                        move.finalPosition.file,
                        move.finalPosition.rank +
                            (piece.color === "WHITE" ? -1 : 1)
                    ),
                };
            }
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
            if (piece.type === "KING") {
                state.castle[col] = undefined;
            }
            const firstRank = piece.color === "WHITE" ? 1 : 8;
            if (piece.position.rank === firstRank && piece.type === "ROOK") {
                if (
                    piece.position.file === "a" &&
                    (state.castle[col] === CastleState.QUEENSIDE ||
                        state.castle[col] === CastleState.BOTH)
                )
                    state.castle[col] =
                        state.castle[col] === CastleState.BOTH
                            ? CastleState.KINGSIDE
                            : undefined;
                else if (
                    piece.position.file === "h" &&
                    (state.castle[col] === CastleState.KINGSIDE ||
                        state.castle[col] === CastleState.BOTH)
                )
                    state.castle[col] =
                        state.castle[col] === CastleState.BOTH
                            ? CastleState.QUEENSIDE
                            : undefined;
            }
            piece.position = move.finalPosition;
            if (move.promote !== undefined) {
                piece.type = move.promote;
            }
        }
    }
    return state;
}
