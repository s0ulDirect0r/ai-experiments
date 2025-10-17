import { Piece } from '@/lib/types'
import { getPieceSymbol } from '@/lib/pieceSymbols'

interface SquareProps {
  piece: Piece | null
  isLight: boolean
  isSelected: boolean
  isPossibleMove: boolean
  onClick: () => void
}

export default function Square({ piece, isLight, isSelected, isPossibleMove, onClick }: SquareProps) {
  const baseColor = isLight ? 'bg-amber-100' : 'bg-amber-700'
  const selectedColor = isSelected ? 'ring-4 ring-blue-500' : ''
  const possibleMoveColor = isPossibleMove ? 'ring-4 ring-green-400' : ''

  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center cursor-pointer
        ${baseColor} ${selectedColor} ${possibleMoveColor}
        hover:opacity-80 transition-all relative
      `}
      onClick={onClick}
    >
      {piece && (
        <span className="text-5xl select-none">
          {getPieceSymbol(piece.type, piece.color)}
        </span>
      )}
      {isPossibleMove && !piece && (
        <div className="w-4 h-4 bg-green-500 rounded-full opacity-50"></div>
      )}
    </div>
  )
}
