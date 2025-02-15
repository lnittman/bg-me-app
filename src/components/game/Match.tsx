import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2Icon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Player } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface MatchProps {
  roomId: string;
  players: Player[];
  onJoinAsPlayer: () => void;
  canJoinAsPlayer: boolean;
  onStartGame: () => void;
  currentUserId: string;
  onPlayerReady: (playerId: string, isReady: boolean) => void;
  readyStates: Record<string, boolean>;
}

export default function Match({ 
  roomId,
  players,
  onJoinAsPlayer,
  canJoinAsPlayer,
  onStartGame,
  currentUserId,
  onPlayerReady,
  readyStates,
}: MatchProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const { toast } = useToast();

  const roomUrl = `${window.location.origin}/game/${roomId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      toast({
        title: "link copied",
        description: "share it with your friends to play together",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "couldn't copy link",
        description: "please try copying manually",
      });
    }
  };

  const handleReady = (playerId: string) => {
    onPlayerReady(playerId, !readyStates[playerId]);
  };

  // Update countdown effect to use passed in readyStates
  useEffect(() => {
    if (players.length === 2 && 
        players.every(p => readyStates[p.id]) && 
        countdown === null) {
      setCountdown(5);
    }
  }, [readyStates, players, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      onStartGame();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onStartGame]);

  return (
    <Card variant="bordered" className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold lowercase">match</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyLink}
          className="flex items-center gap-2"
        >
          <Link2Icon className="h-4 w-4" />
          <span className="text-sm">copy link</span>
        </Button>
      </CardHeader>

      <div className="flex-1 min-h-0 p-4 relative">
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="grid grid-cols-2 gap-4 h-full"
            layout
            animate={countdown !== null ? { opacity: 0.5 } : {}}
          >
            {[0, 1].map((slot) => {
              const player = players[slot];
              const isCurrentUser = player?.id === currentUserId;
              const isReady = player && readyStates[player.id];

              return (
                <motion.div
                  key={slot}
                  layout
                  className="relative rounded-lg border bg-card p-4 flex flex-col h-full"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {player ? (
                        <motion.div
                          key="player"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center gap-4"
                        >
                          <span className="text-4xl">{player.emoji}</span>
                          <span className="text-sm lowercase">{player.name}</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {canJoinAsPlayer && (
                            <Button
                              onClick={onJoinAsPlayer}
                              disabled={!canJoinAsPlayer}
                              variant="outline"
                              className="lowercase"
                            >
                              join as player
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {player && (
                    <AnimatePresence mode="wait">
                      {isCurrentUser ? (
                        <motion.div
                          key="ready-button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full mt-4"
                        >
                          <Button
                            variant={isReady ? "default" : "outline"}
                            onClick={() => handleReady(player.id)}
                            className="w-full lowercase"
                          >
                            {isReady ? "ready!" : "ready?"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready-status"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full mt-4"
                        >
                          <div className={cn(
                            "w-full text-center py-2 rounded-md text-sm",
                            isReady ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          )}>
                            {isReady ? "ready!" : "waiting..."}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-6xl font-bold">{countdown}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
} 