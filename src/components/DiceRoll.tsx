'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DiceRollProps {
  dice: number[];
  canRoll: boolean;
  onRoll: () => void;
}

export function DiceRoll({ dice, canRoll, onRoll }: DiceRollProps) {
  return (
    <div className="flex items-center justify-center space-x-8">
      <AnimatePresence mode="wait">
        {dice.map((value, index) => (
          <motion.div
            key={`${index}-${value}`}
            initial={{ rotate: 0, scale: 0 }}
            animate={{ 
              rotate: [0, 360, 720, 1080, 0],
              scale: [0, 1.2, 0.8, 1.1, 1],
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className={cn(
              "w-16 h-16 bg-white rounded-xl shadow-lg",
              "flex items-center justify-center",
              "border-2 border-gray-200"
            )}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2">
              {/* Dice dots based on value */}
              {[...Array(9)].map((_, dotIndex) => {
                const showDot = {
                  1: [4],
                  2: [2, 6],
                  3: [2, 4, 6],
                  4: [0, 2, 6, 8],
                  5: [0, 2, 4, 6, 8],
                  6: [0, 2, 3, 5, 6, 8],
                }[value]?.includes(dotIndex);

                return (
                  <div
                    key={dotIndex}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      showDot ? "bg-black" : "bg-transparent"
                    )}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        onClick={onRoll}
        disabled={!canRoll}
        size="lg"
        variant="secondary"
        className="ml-4"
      >
        Roll Dice
      </Button>
    </div>
  );
}
