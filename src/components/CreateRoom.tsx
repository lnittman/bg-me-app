'use client';

import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game'
import { type Player } from '@/types/schema'
import PlayerEditForm from '@/components/game/PlayerEditForm'
import { createRoomAction } from '@/app/room/actions'
import { useTransition } from 'react'

export function CreateRoom() {
  const router = useRouter()
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (name: string, emoji: string) => {
    startTransition(async () => {
      const { roomId, player } = await createRoomAction(name, emoji)
      setCurrentPlayer(player as Player)
      router.push(`/room/${roomId}`)
    })
  }

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
