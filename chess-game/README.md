# Chess Game

A fully functional chess game built with Next.js, React, and TypeScript.

## Features

- Full chess piece movement validation (pawns, rooks, knights, bishops, queens, kings)
- Turn-based gameplay (white vs black)
- Check and checkmate detection
- Stalemate detection
- Legal move highlighting
- Captured pieces tracking
- New game functionality
- Beautiful UI with gradient background

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. Click on a piece to select it (you can only select pieces of the current player's color)
2. Valid moves will be highlighted in green
3. Click on a highlighted square to move the piece
4. The game will automatically detect check, checkmate, and stalemate
5. Captured pieces are displayed at the bottom
6. Click "New Game" to reset the board

## Project Structure

```
chess-game/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── ChessGame.tsx    # Main game component
│   └── Square.tsx       # Chess board square component
└── lib/
    ├── types.ts         # TypeScript type definitions
    ├── initialBoard.ts  # Initial board setup
    ├── moveValidation.ts # Move validation logic
    ├── gameState.ts     # Game state helpers
    └── pieceSymbols.ts  # Chess piece Unicode symbols
```

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- CSS (Tailwind-style utility classes)
