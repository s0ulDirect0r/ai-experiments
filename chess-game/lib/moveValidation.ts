import { Board, Position, Piece, Color, Move } from './types'

export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8
}

export const getPieceAt = (board: Board, pos: Position): Piece | null => {
  if (!isValidPosition(pos)) return null
  return board[pos.row][pos.col]
}

export const isPathClear = (board: Board, from: Position, to: Position): boolean => {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col
  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff)
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff)

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      return false
    }
    currentRow += rowStep
    currentCol += colStep
  }

  return true
}

const getPawnMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  const moves: Position[] = []
  const direction = piece.color === 'white' ? -1 : 1
  const startRow = piece.color === 'white' ? 6 : 1

  // Move forward one square
  const oneForward: Position = { row: from.row + direction, col: from.col }
  if (isValidPosition(oneForward) && !getPieceAt(board, oneForward)) {
    moves.push(oneForward)

    // Move forward two squares from starting position
    if (from.row === startRow) {
      const twoForward: Position = { row: from.row + 2 * direction, col: from.col }
      if (!getPieceAt(board, twoForward)) {
        moves.push(twoForward)
      }
    }
  }

  // Capture diagonally
  const capturePositions: Position[] = [
    { row: from.row + direction, col: from.col - 1 },
    { row: from.row + direction, col: from.col + 1 }
  ]

  for (const pos of capturePositions) {
    if (isValidPosition(pos)) {
      const targetPiece = getPieceAt(board, pos)
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(pos)
      }
    }
  }

  return moves
}

const getRookMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  const moves: Position[] = []
  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 }
  ]

  for (const dir of directions) {
    let currentRow = from.row + dir.row
    let currentCol = from.col + dir.col

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const targetPiece = board[currentRow][currentCol]

      if (targetPiece === null) {
        moves.push({ row: currentRow, col: currentCol })
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ row: currentRow, col: currentCol })
        }
        break
      }

      currentRow += dir.row
      currentCol += dir.col
    }
  }

  return moves
}

const getKnightMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  const moves: Position[] = []
  const knightOffsets = [
    { row: 2, col: 1 }, { row: 2, col: -1 },
    { row: -2, col: 1 }, { row: -2, col: -1 },
    { row: 1, col: 2 }, { row: 1, col: -2 },
    { row: -1, col: 2 }, { row: -1, col: -2 }
  ]

  for (const offset of knightOffsets) {
    const pos: Position = { row: from.row + offset.row, col: from.col + offset.col }
    if (isValidPosition(pos)) {
      const targetPiece = getPieceAt(board, pos)
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(pos)
      }
    }
  }

  return moves
}

const getBishopMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  const moves: Position[] = []
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 }
  ]

  for (const dir of directions) {
    let currentRow = from.row + dir.row
    let currentCol = from.col + dir.col

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const targetPiece = board[currentRow][currentCol]

      if (targetPiece === null) {
        moves.push({ row: currentRow, col: currentCol })
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ row: currentRow, col: currentCol })
        }
        break
      }

      currentRow += dir.row
      currentCol += dir.col
    }
  }

  return moves
}

const getQueenMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  return [...getRookMoves(board, from, piece), ...getBishopMoves(board, from, piece)]
}

const getKingMoves = (board: Board, from: Position, piece: Piece): Position[] => {
  const moves: Position[] = []
  const directions = [
    { row: 1, col: 0 }, { row: -1, col: 0 },
    { row: 0, col: 1 }, { row: 0, col: -1 },
    { row: 1, col: 1 }, { row: 1, col: -1 },
    { row: -1, col: 1 }, { row: -1, col: -1 }
  ]

  for (const dir of directions) {
    const pos: Position = { row: from.row + dir.row, col: from.col + dir.col }
    if (isValidPosition(pos)) {
      const targetPiece = getPieceAt(board, pos)
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(pos)
      }
    }
  }

  return moves
}

export const getPossibleMoves = (board: Board, from: Position): Position[] => {
  const piece = getPieceAt(board, from)
  if (!piece) return []

  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, from, piece)
    case 'rook':
      return getRookMoves(board, from, piece)
    case 'knight':
      return getKnightMoves(board, from, piece)
    case 'bishop':
      return getBishopMoves(board, from, piece)
    case 'queen':
      return getQueenMoves(board, from, piece)
    case 'king':
      return getKingMoves(board, from, piece)
    default:
      return []
  }
}

export const findKing = (board: Board, color: Color): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

export const isSquareUnderAttack = (board: Board, pos: Position, byColor: Color): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === byColor) {
        const moves = getPossibleMoves(board, { row, col })
        if (moves.some(move => move.row === pos.row && move.col === pos.col)) {
          return true
        }
      }
    }
  }
  return false
}

export const isInCheck = (board: Board, color: Color): boolean => {
  const kingPos = findKing(board, color)
  if (!kingPos) return false

  const opponentColor: Color = color === 'white' ? 'black' : 'white'
  return isSquareUnderAttack(board, kingPos, opponentColor)
}

export const makeMove = (board: Board, move: Move): Board => {
  const newBoard = board.map(row => [...row])
  const piece = newBoard[move.from.row][move.from.col]

  if (piece) {
    piece.hasMoved = true
    newBoard[move.to.row][move.to.col] = piece
    newBoard[move.from.row][move.from.col] = null
  }

  return newBoard
}

export const isMoveLegal = (board: Board, move: Move, playerColor: Color): boolean => {
  const testBoard = makeMove(board, move)
  return !isInCheck(testBoard, playerColor)
}

export const getLegalMoves = (board: Board, from: Position, playerColor: Color): Position[] => {
  const possibleMoves = getPossibleMoves(board, from)
  return possibleMoves.filter(to => {
    const move: Move = { from, to }
    return isMoveLegal(board, move, playerColor)
  })
}
