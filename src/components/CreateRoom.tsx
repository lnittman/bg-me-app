'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/lib/api';
import useGameStore from '@/store/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiPicker } from '@/components/EmojiPicker';

export function CreateRoom() {
  const router = useRouter();
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('😊');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const player = { id: crypto.randomUUID(), name, emoji };
      setCurrentPlayer(player);
      const room = await createRoom(player);
      router.push(`/room/${room.id}`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          minLength={2}
          maxLength={20}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Choose Emoji
        </label>
        <EmojiPicker
          selected={emoji}
          onSelect={setEmoji}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating...' : 'Create Room'}
      </Button>
    </form>
  );
}
