'use client';

import { type GameState, type Player } from '@/types/schema';

interface GameBoardProps {
  gameState: GameState;
  currentPlayer: Player;
  onMove: (from: number, to: number) => void;
}

export function GameBoard({ gameState, currentPlayer, onMove }: GameBoardProps) {
  const isPlayerTurn = gameState.turn === currentPlayer.color;

  const handleMove = (from: number, to: number) => {
    if (!isPlayerTurn || gameState.moveInProgress) return;
    onMove(from, to);
  };

  return (
    <div className="relative aspect-square w-full max-w-3xl">
      {/* Board squares */}
      <div className="grid grid-cols-12 h-full">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className={`
              relative border border-border
              ${i % 2 === 0 ? 'bg-primary/10' : 'bg-primary/5'}
              ${isPlayerTurn && !gameState.moveInProgress ? 'cursor-pointer' : ''}
            `}
            onClick={() => handleMove(i, i)}
          >
            {gameState.board[i] !== 0 && (
              <div
                className={`
                  absolute inset-2 rounded-full
                  ${gameState.board[i] > 0 ? 'bg-white' : 'bg-black'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Dice */}
      <div className="absolute top-4 right-4 flex gap-2">
        {gameState.dice.map((die, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-lg"
          >
            {die}
          </div>
        ))}
      </div>

      {/* Game over */}
      {gameState.winner && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-2xl font-bold">
            {gameState.winner === currentPlayer.color ? 'You won!' : 'You lost!'}
          </div>
        </div>
      )}
    </div>
  );
}
