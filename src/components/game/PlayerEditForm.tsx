import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateFriendlyName } from "@/lib/friendly-words";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Data as EmojiMartData } from '@emoji-mart/data';

// Curated list of emojis we want to use
const EMOJI_OPTIONS = [
  // Games & Activities
  "🎲", "🎮", "🎯", "🎪", "🎨", "🎭", "🎰", "🕹️", "🃏", "🎱", "🎳", "🎸", "🎺", "🎹", 
  // Animals
  "🦊", "🐸", "🦉", "🦁", "🐯", "🐼", "🐨", "🦄", "🦋", "🐢", "🐙", "🦖", "🦕", "🦜",
  // Fantasy & Magic
  "🌟", "✨", "🔮", "⭐", "🌙", "🌈", "🦚", "🕊️", "🎠", "🚀", "💫", "🌠",
  // Food & Drinks
  "🍕", "🌮", "🍦", "🍪", "🧁", "🍎", "🥤", "🧋", "🫖", "☕", "🍜", "🥪",
  // Nature & Weather
  "🌺", "🌸", "🍀", "🌴", "🌵", "❄️", "🌊", "🔥", "⚡", "🌞", "🌈", "🍄",
  // Objects & Symbols
  "💎", "🎨", "🎭", "🎪", "🎯", "🎱", "🎳", "🧩", "🎵", "🎶", "🎷", "🥁"
].filter((value, index, self) => self.indexOf(value) === index);

interface PlayerEditFormProps {
  initialName?: string;
  initialEmoji?: string;
  onSubmit: (name: string, emoji: string) => void;
  onCancel?: () => void;
  showCancel?: boolean;
  submitLabel?: string;
}

export default function PlayerEditForm({
  initialName = generateFriendlyName(),
  initialEmoji = EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)],
  onSubmit,
  onCancel,
  showCancel = true,
  submitLabel = "continue to game",
}: PlayerEditFormProps) {
  const [name, setName] = useState(initialName);
  const [emoji, setEmoji] = useState(initialEmoji);

  // Scroll selected emoji into view on mount
  useEffect(() => {
    const selectedButton = document.querySelector(`[data-emoji="${emoji}"]`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, [emoji]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), emoji);
    }
  };

  const generateNewName = () => {
    setName(generateFriendlyName());
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium lowercase">your name</Label>
          <div className="flex gap-2">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="enter your name"
              className="lowercase flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generateNewName}
            >
              <ReloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emoji" className="lowercase">choose emoji</Label>
          <ScrollArea className="h-[240px] rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-6 gap-4">
                {EMOJI_OPTIONS.map((e) => (
                  <Button
                    key={e}
                    type="button"
                    variant={emoji === e ? "default" : "outline"}
                    className="h-12 w-12 p-0 text-xl flex items-center justify-center"
                    onClick={() => setEmoji(e)}
                    data-emoji={e}
                  >
                    {e}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <Button type="submit" className="w-full lowercase">
            {submitLabel}
          </Button>
          {showCancel && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full lowercase"
            >
              cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 