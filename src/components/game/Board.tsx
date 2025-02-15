import { useState } from "react";
import { type GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { getPlayerBoard } from "@/lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";

interface BoardProps {
  gameState: GameState;
  onMove: (from: number, to: number) => void;
  onRollDice: () => void;
  currentPlayer: string;
  isMyTurn: boolean;
  isSpectator: boolean;
}

export default function Board({ gameState, onMove, onRollDice, currentPlayer, isMyTurn, isSpectator }: BoardProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const handlePointClick = (index: number) => {
    if (!isMyTurn || isSpectator) return;
    if (selectedPoint === null) {
      if (gameState.board[index] !== 0) {
        setSelectedPoint(index);
      }
    } else {
      onMove(selectedPoint, index);
      setSelectedPoint(null);
    }
  };

  const playerBoard = getPlayerBoard(gameState.board, currentPlayer === "white");

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      {/* Board Container */}
      <div className="relative flex-1 min-h-0 bg-gradient-to-b from-card/50 to-card rounded-lg border shadow-sm overflow-hidden">
        {/* Center Bar */}
        <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-accent/20" />
        
        {/* Points Grid - Now split into quadrants */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top Half */}
          <div className="flex-1 flex">
            {/* Top Left Quadrant (points 12-17) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(12, 18).map((count, i) => (
                <Point 
                  key={i} 
                  index={i + 12}
                  count={count}
                  isTop={true}
                  isLeft={true}
                  selected={selectedPoint === i + 12}
                  onClick={() => handlePointClick(i + 12)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
            {/* Top Right Quadrant (points 6-11) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(6, 12).map((count, i) => (
                <Point 
                  key={i} 
                  index={i + 6}
                  count={count}
                  isTop={true}
                  isLeft={false}
                  selected={selectedPoint === i + 6}
                  onClick={() => handlePointClick(i + 6)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
          </div>

          {/* Bottom Half */}
          <div className="flex-1 flex">
            {/* Bottom Left Quadrant (points 18-23) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(18, 24).reverse().map((count, i) => (
                <Point 
                  key={i} 
                  index={23 - i}
                  count={count}
                  isTop={false}
                  isLeft={true}
                  selected={selectedPoint === 23 - i}
                  onClick={() => handlePointClick(23 - i)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
            {/* Bottom Right Quadrant (points 0-5) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(0, 6).reverse().map((count, i) => (
                <Point 
                  key={i} 
                  index={5 - i}
                  count={count}
                  isTop={false}
                  isLeft={false}
                  selected={selectedPoint === 5 - i}
                  onClick={() => handlePointClick(5 - i)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls - Updated positioning and animations */}
      <div className="flex justify-center items-center gap-4 h-12">
        <AnimatePresence mode="wait">
          {isMyTurn && !isSpectator && !gameState.moveInProgress && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={onRollDice}
                className="lowercase"
                size="sm"
              >
                roll
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          {gameState.dice.map((die, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl font-medium"
            >
              {die}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// New Point component for better organization
function Point({
  index,
  count,
  isTop,
  isLeft,
  selected,
  onClick,
  isMyTurn,
  isSpectator,
}: {
  index: number;
  count: number;
  isTop: boolean;
  isLeft: boolean;
  selected: boolean;
  onClick: () => void;
  isMyTurn: boolean;
  isSpectator: boolean;
}) {
  const isEven = index % 2 === 0;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-full transition-colors",
        selected && "ring-1 ring-primary ring-inset",
        isMyTurn && !isSpectator && "cursor-pointer hover:bg-accent/5",
        "group"
      )}
    >
      {/* Triangle with rounded corners */}
      <div 
        className={cn(
          "absolute inset-x-0",
          isTop ? "top-0 h-[95%]" : "bottom-0 h-[95%]",
          isEven ? "bg-muted/70" : "bg-muted/30",
          "transition-colors group-hover:brightness-110",
          "rounded-lg before:absolute before:inset-0 before:rounded-lg",
          isTop 
            ? "before:origin-top before:[clip-path:polygon(0_0,100%_0,50%_100%)]"
            : "before:origin-bottom before:[clip-path:polygon(50%_0,0_100%,100%_100%)]",
          "overflow-hidden"
        )}
      >
        <div 
          className={cn(
            "absolute inset-0 rounded-lg",
            isEven ? "bg-muted/70" : "bg-muted/30"
          )}
        />
      </div>

      {/* Pieces Stack */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2",
        isTop ? "top-[5%]" : "bottom-[5%]",
        "w-[50%] flex flex-col items-center",
        isTop ? "gap-[0.75%]" : "gap-[0.75%] flex-col-reverse"
      )}>
        {Array.from({ length: Math.abs(count) }).map((_, j) => (
          <div
            key={j}
            className={cn(
              "w-full aspect-square rounded-full border transition-all",
              count > 0 
                ? "bg-background border-foreground shadow-[inset_0_1px_theme(colors.muted.DEFAULT)]" 
                : "bg-foreground border-background shadow-[inset_0_1px_rgba(255,255,255,0.1)]",
              selected && "ring-1 ring-primary ring-offset-1"
            )}
          />
        ))}
      </div>
    </div>
  );
}