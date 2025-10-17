import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChessGame from '@/components/ChessGame'
import '@testing-library/jest-dom'

describe('ChessGame Integration Tests', () => {
  test('renders chess board with initial setup', () => {
    render(<ChessGame />)

    expect(screen.getByText('Chess Game')).toBeInTheDocument()
    expect(screen.getByText("White's turn")).toBeInTheDocument()
  })

  test('allows white to make first move', () => {
    render(<ChessGame />)

    // Get all squares
    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // Click white pawn at e2 (row 6, col 4) - index 52
    fireEvent.click(squares[52])

    // After selecting, should be able to move
    // The square should be highlighted
    expect(squares[52].className).toContain('ring-4')
  })

  test('only allows current player to move pieces', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // Try to click black pawn at e7 (row 1, col 4) - index 12
    // Should not select because it's white's turn
    fireEvent.click(squares[12])

    // Black piece should not be selected
    expect(screen.getByText("White's turn")).toBeInTheDocument()
  })

  test('completes a full move sequence', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // White moves pawn from e2 to e4
    fireEvent.click(squares[52]) // e2
    fireEvent.click(squares[36]) // e4

    // Turn should switch to black
    waitFor(() => {
      expect(screen.getByText("Black's turn")).toBeInTheDocument()
    })
  })

  test('prevents illegal moves', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // Try to move white king (impossible on first move)
    fireEvent.click(squares[60]) // King at e1

    // Try to move to random square (should not work)
    fireEvent.click(squares[50])

    // Should still be white's turn
    expect(screen.getByText("White's turn")).toBeInTheDocument()
  })

  test('new game button resets the board', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // Make a move
    fireEvent.click(squares[52]) // e2
    fireEvent.click(squares[36]) // e4

    // Click new game
    const newGameButton = screen.getByText('New Game')
    fireEvent.click(newGameButton)

    // Should be white's turn again
    expect(screen.getByText("White's turn")).toBeInTheDocument()
  })

  test('tracks captured pieces', () => {
    render(<ChessGame />)

    expect(screen.getByText('White Captured:')).toBeInTheDocument()
    expect(screen.getByText('Black Captured:')).toBeInTheDocument()
  })

  test('knight can move from starting position', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // Click white knight at b1 (row 7, col 1) - index 57
    fireEvent.click(squares[57])

    // Should show possible moves
    // Knight should be selected (has ring)
    expect(squares[57].className).toContain('ring')
  })

  test('displays game title', () => {
    render(<ChessGame />)

    const title = screen.getByText('Chess Game')
    expect(title).toBeInTheDocument()
  })

  test('board has 64 squares', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    expect(squares.length).toBe(64)
  })

  test('alternates square colors correctly', () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // First square (0,0) should be light (even sum)
    expect(squares[0].className).toContain('bg-amber-100')

    // Second square (0,1) should be dark (odd sum)
    expect(squares[1].className).toContain('bg-amber-700')
  })
})

describe('Chess Game Move Sequences', () => {
  test('opening: e4 e5 sequence', async () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // White: e2 to e4
    fireEvent.click(squares[52]) // e2 (row 6, col 4)
    fireEvent.click(squares[36]) // e4 (row 4, col 4)

    await waitFor(() => {
      expect(screen.getByText("Black's turn")).toBeInTheDocument()
    })

    // Black: e7 to e5
    fireEvent.click(squares[12]) // e7 (row 1, col 4)
    fireEvent.click(squares[28]) // e5 (row 3, col 4)

    await waitFor(() => {
      expect(screen.getByText("White's turn")).toBeInTheDocument()
    })
  })

  test('knight development', async () => {
    render(<ChessGame />)

    const squares = screen.getAllByRole('generic').filter(el =>
      el.className.includes('w-16 h-16')
    )

    // White: Nf3 (knight from g1 to f3)
    fireEvent.click(squares[62]) // g1 (row 7, col 6)
    fireEvent.click(squares[45]) // f3 (row 5, col 5)

    await waitFor(() => {
      expect(screen.getByText("Black's turn")).toBeInTheDocument()
    })
  })
})
