import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import Figurine from "./Figurine";
import { allowedMoves, CastleType, legalMoves } from "./models/BoardState";
import { isCastleMove } from "./models/Move";
import { BoardFile, BoardRank, FileToNum, numToFile } from "./models/Position";
import Square from "./Square";

export default function Board() {
    const board = useAppSelector((state) => state.board);
    const game = useAppSelector((state) => state.game);
    const dispatch = useAppDispatch();
    const squares: ReturnType<typeof Square>[][] = [];
    const currentLegalMoves = legalMoves(board, game.currentMove);

    for (let i = 1; i <= 8; i++) {
        let row = [];
        for (let j = 1; j <= 8; j++) {
            row.push(
                <Square
                    key={j.toString()}
                    file={numToFile(j as FileToNum<BoardFile>)}
                    rank={i as BoardRank}
                    moves={currentLegalMoves.filter(
                        (move) =>
                            (move.piece?.position.name ===
                                game.selectedPiece?.position.name &&
                                move.finalPosition?.file ===
                                    numToFile(j as any) &&
                                move.finalPosition.rank === i) ||
                            (isCastleMove(move) &&
                                game.selectedPiece?.position.file === "e" &&
                                game.selectedPiece.position.rank ===
                                    (move.color === "WHITE" ? 1 : 8) &&
                                i === game.selectedPiece.position.rank &&
                                j ===
                                    (move.type === CastleType.KINGSIDE ? 7 : 3))
                    )}
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
                        canMove={currentLegalMoves.some(
                            (move) =>
                                move.piece?.position.name ===
                                    piece.position.name ||
                                (isCastleMove(move) &&
                                    piece.position.rank ===
                                        (move.color === "WHITE" ? 1 : 8) &&
                                    piece.position.file === "e")
                        )}
                    ></Figurine>
                ))}
            </div>
            {allowedMoves(board, "WHITE").map((move, i) => (
                <p key={i}>{JSON.stringify(move)}</p>
            ))}
        </>
    );
}
