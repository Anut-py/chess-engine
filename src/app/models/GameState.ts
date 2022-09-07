import BoardState from "./BoardState";
import { Move } from "./Move";
import Piece, { Color } from "./Piece";

export default interface GameState {
  currentMove: Color;
  selectedPiece?: Piece;
  boardStates: BoardState[];
  moves: Move[];
  keys: string[][];
}
