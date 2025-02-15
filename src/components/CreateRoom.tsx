'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game';
import { type Player } from '@/types/schema';
import PlayerEditForm from '@/components/game/PlayerEditForm';

export function CreateRoom() {
  const router = useRouter();
  const setCurrentPlayer = useGameStore(state => state.setCurrentPlayer);

  const handleSubmit = async (name: string, emoji: string) => {
    const player: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      emoji,
      joinedAt: Date.now(),
      isReady: false,
      color: 'white',
    };

    setCurrentPlayer(player);
    router.push(`/room/${Math.random().toString(36).substring(2, 9)}`);
  };

  return (
    <div className="w-full max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center lowercase">create a room</h1>
      <PlayerEditForm 
        onSubmit={handleSubmit}
        showCancel={false}
        submitLabel="create room"
      />
    </div>
  );
}
