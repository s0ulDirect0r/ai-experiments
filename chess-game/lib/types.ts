export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
export type Color = 'white' | 'black'

export interface Piece {
  type: PieceType
  color: Color
  hasMoved?: boolean
}

export interface Position {
  row: number
  col: number
}

export interface Move {
  from: Position
  to: Position
  capturedPiece?: Piece
  isEnPassant?: boolean
  isCastling?: boolean
  promotionPiece?: PieceType
}

export type Board = (Piece | null)[][]

export interface GameState {
  board: Board
  currentPlayer: Color
  selectedSquare: Position | null
  possibleMoves: Position[]
  moveHistory: Move[]
  capturedPieces: Piece[]
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
}
