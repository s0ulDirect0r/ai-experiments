import { PieceType, Color } from './types'

export const getPieceSymbol = (type: PieceType, color: Color): string => {
  const pieces: Record<Color, Record<PieceType, string>> = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  }

  return pieces[color][type]
}
