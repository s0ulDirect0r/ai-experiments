'use client'

import { useState, useEffect } from 'react'
import Square from './Square'
import { Board, Position, Piece, Color, Move } from '@/lib/types'
import { createInitialBoard } from '@/lib/initialBoard'
import { getLegalMoves, isInCheck, makeMove, getPieceAt } from '@/lib/moveValidation'
import { isCheckmate, isStalemate } from '@/lib/gameState'

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Color>('white')
  const [gameStatus, setGameStatus] = useState<string>('')
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({
    white: [],
    black: []
  })

  useEffect(() => {
    checkGameStatus()
  }, [board, currentPlayer])

  const checkGameStatus = () => {
    if (isCheckmate(board, currentPlayer)) {
      const winner = currentPlayer === 'white' ? 'Black' : 'White'
      setGameStatus(`Checkmate! ${winner} wins!`)
    } else if (isStalemate(board, currentPlayer)) {
      setGameStatus('Stalemate! Game is a draw.')
    } else if (isInCheck(board, currentPlayer)) {
      setGameStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`)
    } else {
      setGameStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`)
    }
  }

  const handleSquareClick = (row: number, col: number) => {
    const clickedPiece = board[row][col]

    // If a square is already selected
    if (selectedSquare) {
      const isValidMove = possibleMoves.some(
        move => move.row === row && move.col === col
      )

      if (isValidMove) {
        // Make the move
        const move: Move = {
          from: selectedSquare,
          to: { row, col }
        }

        const capturedPiece = getPieceAt(board, { row, col })
        if (capturedPiece) {
          const opponentColor = currentPlayer === 'white' ? 'black' : 'white'
          setCapturedPieces(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], capturedPiece]
          }))
        }

        const newBoard = makeMove(board, move)
        setBoard(newBoard)
        setSelectedSquare(null)
        setPossibleMoves([])
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')
      } else if (clickedPiece && clickedPiece.color === currentPlayer) {
        // Select a different piece of the same color
        setSelectedSquare({ row, col })
        setPossibleMoves(getLegalMoves(board, { row, col }, currentPlayer))
      } else {
        // Deselect
        setSelectedSquare(null)
        setPossibleMoves([])
      }
    } else {
      // No square selected yet
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        setSelectedSquare({ row, col })
        setPossibleMoves(getLegalMoves(board, { row, col }, currentPlayer))
      }
    }
  }

  const resetGame = () => {
    setBoard(createInitialBoard())
    setSelectedSquare(null)
    setPossibleMoves([])
    setCurrentPlayer('white')
    setGameStatus('')
    setCapturedPieces({ white: [], black: [] })
  }

  const isPossibleMove = (row: number, col: number): boolean => {
    return possibleMoves.some(move => move.row === row && move.col === col)
  }

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare !== null && selectedSquare.row === row && selectedSquare.col === col
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">Chess Game</h1>

      <div className="bg-white p-4 rounded-lg shadow-2xl">
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold">
            {gameStatus}
          </p>
        </div>

        <div className="grid grid-cols-8 border-4 border-gray-800">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  isLight={isLightSquare}
                  isSelected={isSelected(rowIndex, colIndex)}
                  isPossibleMove={isPossibleMove(rowIndex, colIndex)}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              )
            })
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="flex gap-8 text-white">
        <div className="bg-white bg-opacity-20 p-4 rounded-lg">
          <h3 className="font-bold mb-2">White Captured:</h3>
          <div className="flex flex-wrap gap-1">
            {capturedPieces.white.map((piece, idx) => (
              <span key={idx} className="text-2xl">
                {piece.type.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Black Captured:</h3>
          <div className="flex flex-wrap gap-1">
            {capturedPieces.black.map((piece, idx) => (
              <span key={idx} className="text-2xl">
                {piece.type.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
