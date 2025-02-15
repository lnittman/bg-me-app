'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/game';
import { type Player } from '@/types/schema';

export function JoinRoom() {
  const [name, setName] = useState('');
  const router = useRouter();
  const setCurrentPlayer = useGameStore(state => state.setCurrentPlayer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const player: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      emoji: '🎲',
      joinedAt: Date.now(),
      isReady: false,
      color: 'black',
    };

    setCurrentPlayer(player);
    router.push(`/room/${Math.random().toString(36).substring(2, 9)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      <Button type="submit">Join Room</Button>
    </form>
  );
}
