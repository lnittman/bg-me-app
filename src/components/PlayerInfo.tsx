'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Player } from '@/lib/types';

interface PlayerInfoProps {
  players: Player[];
  spectators: Player[];
  readyStates: Record<string, boolean>;
  currentPlayer: Player;
  onReady: (isReady: boolean) => void;
}

export function PlayerInfo({
  players,
  spectators,
  readyStates,
  currentPlayer,
  onReady,
}: PlayerInfoProps) {
  const isPlayerInGame = players.some(p => p.id === currentPlayer.id);
  const isReady = readyStates[currentPlayer.id] || false;

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Players</h3>
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-2 rounded-lg bg-secondary"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{player.emoji}</span>
              <span className="font-medium">{player.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={index === 0 ? "default" : "secondary"}>
                {index === 0 ? "White" : "Black"}
              </Badge>
              {readyStates[player.id] && (
                <Badge variant="success">Ready</Badge>
              )}
            </div>
          </motion.div>
        ))}

        {isPlayerInGame && (
          <Button
            onClick={() => onReady(!isReady)}
            variant={isReady ? "secondary" : "default"}
            className="w-full"
          >
            {isReady ? "Not Ready" : "Ready"}
          </Button>
        )}
      </div>

      {spectators.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Spectators</h3>
          <div className="flex flex-wrap gap-2">
            {spectators.map((spectator) => (
              <Badge key={spectator.id} variant="outline">
                {spectator.emoji} {spectator.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
