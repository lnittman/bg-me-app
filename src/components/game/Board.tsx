import { useAtom } from "jotai";
import { type GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { getPlayerBoard } from "@/lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";
import Point from "./Point";
import { selectedPointAtom } from "@/store/ui";

interface BoardProps {
  gameState: GameState;
  onMove: (from: number, to: number) => void;
  onRollDice: () => void;
  currentPlayer: string;
  isMyTurn: boolean;
  isSpectator: boolean;
}

export default function Board({ gameState, onMove, onRollDice, currentPlayer, isMyTurn, isSpectator }: BoardProps) {
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom);

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
              {playerBoard.slice(12, 18).map((count: number, i: number) => (
                <Point 
                  key={i} 
                  index={i + 12}
                  count={count}
                  isTop={true}
                  selected={selectedPoint === i + 12}
                  onClick={() => handlePointClick(i + 12)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
            {/* Top Right Quadrant (points 6-11) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(6, 12).map((count: number, i: number) => (
                <Point 
                  key={i} 
                  index={i + 6}
                  count={count}
                  isTop={true}
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
              {playerBoard.slice(18, 24).reverse().map((count: number, i: number) => (
                <Point 
                  key={i} 
                  index={23 - i}
                  count={count}
                  isTop={false}
                  selected={selectedPoint === 23 - i}
                  onClick={() => handlePointClick(23 - i)}
                  isMyTurn={isMyTurn}
                  isSpectator={isSpectator}
                />
              ))}
            </div>
            {/* Bottom Right Quadrant (points 0-5) */}
            <div className="flex-1 grid grid-cols-6 gap-px p-4">
              {playerBoard.slice(0, 6).reverse().map((count: number, i: number) => (
                <Point 
                  key={i} 
                  index={5 - i}
                  count={count}
                  isTop={false}
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
          {gameState.dice.map((die: number, i: number) => (
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
