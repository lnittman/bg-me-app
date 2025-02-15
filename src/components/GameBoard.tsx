'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type GameState, type Player } from '@/lib/types';

interface GameBoardProps {
  gameState: GameState;
  currentPlayer: Player;
  onMove: (from: number, to: number) => void;
}

export function GameBoard({ gameState, currentPlayer, onMove }: GameBoardProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const isPlayerTurn = gameState.turn === 'white' 
    ? currentPlayer.id === gameState.players?.[0]?.id 
    : currentPlayer.id === gameState.players?.[1]?.id;

  const handlePointClick = (pointIndex: number) => {
    if (!isPlayerTurn || gameState.winner) return;

    if (selectedPoint === null) {
      // Select a point if it has pieces of the current player's color
      if (gameState.board[pointIndex] > 0 && gameState.turn === 'white' ||
          gameState.board[pointIndex] < 0 && gameState.turn === 'black') {
        setSelectedPoint(pointIndex);
      }
    } else {
      // Attempt to move from selected point to clicked point
      onMove(selectedPoint, pointIndex);
      setSelectedPoint(null);
    }
  };

  return (
    <div className="relative aspect-[2/1] bg-wood-pattern rounded-lg shadow-xl overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 gap-0">
        {gameState.board.map((count, index) => (
          <div
            key={index}
            className={cn(
              "relative h-full",
              "cursor-pointer hover:bg-white/10 transition-colors",
              selectedPoint === index && "bg-white/20",
              index === 6 && "border-r-4 border-wood-dark",
              index === 18 && "border-r-4 border-wood-dark"
            )}
            onClick={() => handlePointClick(index)}
          >
            <AnimatePresence>
              {Array.from({ length: Math.abs(count) }).map((_, pieceIndex) => (
                <motion.div
                  key={pieceIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2",
                    "w-[80%] aspect-square rounded-full",
                    "shadow-md border-2",
                    count > 0 
                      ? "bg-white border-gray-200" 
                      : "bg-black border-gray-800",
                    index < 12 
                      ? "bottom-[5%]" 
                      : "top-[5%]"
                  )}
                  style={{
                    bottom: index < 12 ? `${(pieceIndex * 15) + 5}%` : undefined,
                    top: index >= 12 ? `${(pieceIndex * 15) + 5}%` : undefined,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
