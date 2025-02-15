import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateFriendlyName } from "@/lib/friendly-words";
import { type Player } from "@/lib/types";
import { Users, RefreshCcw } from "lucide-react";

interface PlayerInfoProps {
  playerId: string;
  players: Player[];
  onUpdatePlayer: (name: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ["😊", "🎮", "🎲", "🎯", "🎪", "🃏", "🎨", "🎭"];

export default function PlayerInfo({
  playerId,
  players,
  onUpdatePlayer,
}: PlayerInfoProps) {
  const [name, setName] = useState(() => generateFriendlyName());
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdatePlayer(name.trim(), emoji);
      setIsEditing(false);
    }
  };

  const generateNewName = () => {
    setName(generateFriendlyName());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-bold lowercase">players</h2>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="enter your name"
                className="lowercase"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={generateNewName}
                className="shrink-0"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="lowercase">choose emoji</Label>
              <div className="flex gap-2 mt-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      emoji === e ? "bg-primary text-primary-foreground" : "bg-accent"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 lowercase">
                save
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 lowercase">
                cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                <span>{p.emoji}</span>
                <span className="lowercase">{p.name}</span>
                {p.id === playerId && (
                  <>
                    <span className="text-sm lowercase">(you)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="ml-auto lowercase"
                    >
                      edit
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}