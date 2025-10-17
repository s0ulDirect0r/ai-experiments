import { Board, Position, Piece } from '@/lib/types'
import {
  getPossibleMoves,
  isInCheck,
  findKing,
  makeMove,
  getLegalMoves
} from '@/lib/moveValidation'
import { createInitialBoard } from '@/lib/initialBoard'

describe('Move Validation', () => {
  describe('Pawn Movement', () => {
    test('white pawn can move forward one square', () => {
      const board = createInitialBoard()
      const moves = getPossibleMoves(board, { row: 6, col: 4 })

      expect(moves).toContainEqual({ row: 5, col: 4 })
    })

    test('white pawn can move forward two squares from starting position', () => {
      const board = createInitialBoard()
      const moves = getPossibleMoves(board, { row: 6, col: 4 })

      expect(moves).toContainEqual({ row: 4, col: 4 })
      expect(moves.length).toBe(2)
    })

    test('pawn cannot move forward if blocked', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[6][4] = { type: 'pawn', color: 'white', hasMoved: false }
      board[5][4] = { type: 'pawn', color: 'black', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 6, col: 4 })

      expect(moves.length).toBe(0)
    })

    test('pawn can capture diagonally', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[6][4] = { type: 'pawn', color: 'white', hasMoved: false }
      board[5][3] = { type: 'pawn', color: 'black', hasMoved: false }
      board[5][5] = { type: 'pawn', color: 'black', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 6, col: 4 })

      expect(moves).toContainEqual({ row: 5, col: 3 })
      expect(moves).toContainEqual({ row: 5, col: 5 })
    })
  })

  describe('Rook Movement', () => {
    test('rook can move horizontally and vertically', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'rook', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      // Should have 14 moves total (7 horizontal + 7 vertical)
      expect(moves.length).toBe(14)
      expect(moves).toContainEqual({ row: 4, col: 0 })
      expect(moves).toContainEqual({ row: 4, col: 7 })
      expect(moves).toContainEqual({ row: 0, col: 4 })
      expect(moves).toContainEqual({ row: 7, col: 4 })
    })

    test('rook cannot jump over pieces', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'rook', color: 'white', hasMoved: false }
      board[4][6] = { type: 'pawn', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      expect(moves).not.toContainEqual({ row: 4, col: 7 })
      expect(moves).toContainEqual({ row: 4, col: 5 })
    })
  })

  describe('Knight Movement', () => {
    test('knight moves in L-shape', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'knight', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      expect(moves.length).toBe(8)
      expect(moves).toContainEqual({ row: 6, col: 5 })
      expect(moves).toContainEqual({ row: 6, col: 3 })
      expect(moves).toContainEqual({ row: 2, col: 5 })
      expect(moves).toContainEqual({ row: 2, col: 3 })
    })

    test('knight can jump over pieces', () => {
      const board = createInitialBoard()
      const moves = getPossibleMoves(board, { row: 7, col: 1 })

      // Knight should be able to move even with pawns in front
      expect(moves.length).toBeGreaterThan(0)
      expect(moves).toContainEqual({ row: 5, col: 0 })
      expect(moves).toContainEqual({ row: 5, col: 2 })
    })
  })

  describe('Bishop Movement', () => {
    test('bishop moves diagonally', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'bishop', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      expect(moves.length).toBe(13)
      expect(moves).toContainEqual({ row: 0, col: 0 })
      expect(moves).toContainEqual({ row: 7, col: 7 })
      expect(moves).toContainEqual({ row: 1, col: 7 })
      expect(moves).toContainEqual({ row: 7, col: 1 })
    })
  })

  describe('Queen Movement', () => {
    test('queen moves like rook and bishop combined', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'queen', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      // 14 (rook moves) + 13 (bishop moves) = 27
      expect(moves.length).toBe(27)
    })
  })

  describe('King Movement', () => {
    test('king moves one square in any direction', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[4][4] = { type: 'king', color: 'white', hasMoved: false }

      const moves = getPossibleMoves(board, { row: 4, col: 4 })

      expect(moves.length).toBe(8)
      expect(moves).toContainEqual({ row: 3, col: 3 })
      expect(moves).toContainEqual({ row: 3, col: 4 })
      expect(moves).toContainEqual({ row: 3, col: 5 })
      expect(moves).toContainEqual({ row: 5, col: 5 })
    })
  })

  describe('Check Detection', () => {
    test('detects when king is in check', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][4] = { type: 'king', color: 'white', hasMoved: false }
      board[0][4] = { type: 'rook', color: 'black', hasMoved: false }

      expect(isInCheck(board, 'white')).toBe(true)
    })

    test('detects when king is not in check', () => {
      const board = createInitialBoard()

      expect(isInCheck(board, 'white')).toBe(false)
      expect(isInCheck(board, 'black')).toBe(false)
    })

    test('king cannot move into check', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[7][4] = { type: 'king', color: 'white', hasMoved: false }
      board[5][3] = { type: 'rook', color: 'black', hasMoved: false }

      const legalMoves = getLegalMoves(board, { row: 7, col: 4 }, 'white')

      // King shouldn't be able to move to squares attacked by rook
      expect(legalMoves).not.toContainEqual({ row: 6, col: 3 })
    })
  })

  describe('Move Execution', () => {
    test('makeMove updates board correctly', () => {
      const board = createInitialBoard()
      const from: Position = { row: 6, col: 4 }
      const to: Position = { row: 4, col: 4 }

      const newBoard = makeMove(board, { from, to })

      expect(newBoard[6][4]).toBeNull()
      expect(newBoard[4][4]).toEqual({ type: 'pawn', color: 'white', hasMoved: true })
    })

    test('makeMove captures pieces', () => {
      const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))
      board[6][4] = { type: 'pawn', color: 'white', hasMoved: false }
      board[5][5] = { type: 'pawn', color: 'black', hasMoved: false }

      const from: Position = { row: 6, col: 4 }
      const to: Position = { row: 5, col: 5 }

      const newBoard = makeMove(board, { from, to })

      expect(newBoard[6][4]).toBeNull()
      expect(newBoard[5][5]?.color).toBe('white')
    })
  })

  describe('Find King', () => {
    test('finds white king position', () => {
      const board = createInitialBoard()
      const kingPos = findKing(board, 'white')

      expect(kingPos).toEqual({ row: 7, col: 4 })
    })

    test('finds black king position', () => {
      const board = createInitialBoard()
      const kingPos = findKing(board, 'black')

      expect(kingPos).toEqual({ row: 0, col: 4 })
    })
  })
})
