import { Board } from '@/lib/types'
import { isCheckmate, isStalemate, hasLegalMoves } from '@/lib/gameState'
import { createInitialBoard } from '@/lib/initialBoard'

describe('Game State', () => {
  describe('Checkmate Detection', () => {
    test('detects back rank mate', () => {
      // Classic back rank mate scenario
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][6] = { type: 'king', color: 'white', hasMoved: true }
      board[6][5] = { type: 'pawn', color: 'white', hasMoved: true }
      board[6][6] = { type: 'pawn', color: 'white', hasMoved: true }
      board[6][7] = { type: 'pawn', color: 'white', hasMoved: true }
      board[7][0] = { type: 'rook', color: 'black', hasMoved: true }

      expect(isCheckmate(board, 'white')).toBe(true)
    })

    test('detects simple checkmate scenario', () => {
      // King in corner, queen delivers mate with king support
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[0][0] = { type: 'king', color: 'black', hasMoved: true }
      board[1][1] = { type: 'king', color: 'white', hasMoved: true }
      board[0][2] = { type: 'queen', color: 'white', hasMoved: true }

      // King at 0,0 is checked by queen at 0,2
      // Cannot escape: 0,1 controlled by queen, 1,0 controlled by queen, 1,1 has white king
      expect(isCheckmate(board, 'black')).toBe(true)
    })

    test('initial position is not checkmate', () => {
      const board = createInitialBoard()

      expect(isCheckmate(board, 'white')).toBe(false)
      expect(isCheckmate(board, 'black')).toBe(false)
    })
  })

  describe('Stalemate Detection', () => {
    test('detects stalemate', () => {
      // Simple stalemate scenario
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][0] = { type: 'king', color: 'white', hasMoved: true }
      board[5][1] = { type: 'king', color: 'black', hasMoved: true }
      board[6][2] = { type: 'queen', color: 'black', hasMoved: true }

      expect(isStalemate(board, 'white')).toBe(true)
    })

    test('initial position is not stalemate', () => {
      const board = createInitialBoard()

      expect(isStalemate(board, 'white')).toBe(false)
      expect(isStalemate(board, 'black')).toBe(false)
    })
  })

  describe('Legal Moves Availability', () => {
    test('initial position has legal moves', () => {
      const board = createInitialBoard()

      expect(hasLegalMoves(board, 'white')).toBe(true)
      expect(hasLegalMoves(board, 'black')).toBe(true)
    })

    test('checkmate position has no legal moves', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][6] = { type: 'king', color: 'white', hasMoved: true }
      board[6][5] = { type: 'pawn', color: 'white', hasMoved: true }
      board[6][6] = { type: 'pawn', color: 'white', hasMoved: true }
      board[6][7] = { type: 'pawn', color: 'white', hasMoved: true }
      board[7][0] = { type: 'rook', color: 'black', hasMoved: true }

      expect(hasLegalMoves(board, 'white')).toBe(false)
    })
  })

  describe('Game Scenarios', () => {
    test('queen delivers checkmate on back rank', () => {
      // Queen checkmate on back rank
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))

      board[0][4] = { type: 'king', color: 'black', hasMoved: true }
      board[1][3] = { type: 'pawn', color: 'black', hasMoved: false }
      board[1][4] = { type: 'pawn', color: 'black', hasMoved: false }
      board[1][5] = { type: 'pawn', color: 'black', hasMoved: false }
      board[0][0] = { type: 'queen', color: 'white', hasMoved: true }

      expect(isCheckmate(board, 'black')).toBe(true)
    })

    test('can escape check by blocking', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][4] = { type: 'king', color: 'white', hasMoved: false }
      board[0][4] = { type: 'rook', color: 'black', hasMoved: false }
      board[5][4] = { type: 'bishop', color: 'white', hasMoved: false }

      // Not checkmate because bishop can block
      expect(isCheckmate(board, 'white')).toBe(false)
      expect(hasLegalMoves(board, 'white')).toBe(true)
    })

    test('can escape check by capturing', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][4] = { type: 'king', color: 'white', hasMoved: false }
      board[6][4] = { type: 'rook', color: 'black', hasMoved: false }

      // King can capture the rook
      expect(isCheckmate(board, 'white')).toBe(false)
      expect(hasLegalMoves(board, 'white')).toBe(true)
    })

    test('can escape check by moving king', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][4] = { type: 'king', color: 'white', hasMoved: false }
      board[0][4] = { type: 'rook', color: 'black', hasMoved: false }

      // King can move to escape check
      expect(isCheckmate(board, 'white')).toBe(false)
      expect(hasLegalMoves(board, 'white')).toBe(true)
    })
  })
})
