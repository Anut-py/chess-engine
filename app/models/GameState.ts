import Piece, { Color } from './Piece';

export default interface GameState {
  currentMove: Color;
  selectedPiece: Piece
}
