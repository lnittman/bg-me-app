'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/game'
import { type Player } from '@/types/schema'
import { joinRoomAction } from '@/app/room/actions'
import { useTransition } from 'react'

export function JoinRoom({ roomId }: { roomId: string }) {
  const [name, setName] = useState('')
  const router = useRouter()
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      const { player } = await joinRoomAction(roomId, name.trim(), '🎲')
      setCurrentPlayer(player as Player)
      router.push(`/room/${roomId}`)
    })
  }

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
