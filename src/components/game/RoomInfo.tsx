import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Link2 } from "lucide-react";
import { toast } from "sonner";
import { type Player } from "@/types/schema";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MatchProps {
  roomId: string;
  players: Player[];
  onJoinAsPlayer: () => void;
  canJoinAsPlayer: boolean;
  onStartGame: () => void;
  canStart: boolean;
}

export default function Match({ 
  roomId,
  players,
  onJoinAsPlayer,
  canJoinAsPlayer,
  onStartGame,
  canStart,
}: MatchProps) {
  const roomUrl = `${window.location.origin}/game/${roomId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      toast("Link copied to clipboard", {
        description: "Share it with your friends to play together",
      });
    } catch {
      toast("Couldn't copy link", {
        description: "Please try copying manually",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-bold lowercase">match</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={copyLink}>
                <Link2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy match link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent className="flex-1 grid grid-cols-2 gap-4 p-6 relative">
        {/* Player slots */}
        {[0, 1].map((slot) => {
          const player = players[slot];
          return (
            <div 
              key={slot} 
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed",
                player ? "border-primary bg-primary/5" : "border-muted"
              )}
            >
              {player ? (
                <>
                  <div className="text-4xl mb-4">{player.emoji}</div>
                  <p className="text-lg font-medium lowercase">{player.name}</p>
                  <p className="text-sm text-muted-foreground lowercase">
                    {slot === 0 ? "white" : "black"}
                  </p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <Button
                    onClick={onJoinAsPlayer}
                    disabled={!canJoinAsPlayer}
                    variant="outline"
                    className="lowercase"
                  >
                    join as player
                  </Button>
                </>
              )}
            </div>
          );
        })}

        {/* Start button */}
        {canStart && (
          <div className="absolute bottom-6 right-6">
            <Button 
              onClick={onStartGame}
              size="sm"
              className="lowercase"
            >
              start
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}