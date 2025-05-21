'use server'

import { nanoid } from 'nanoid'
import { createRoom, addPlayerToRoom, getRoomWithRelations } from '@/lib/db'
import { ratelimit } from '@/lib/ratelimit'
import { INITIAL_BOARD } from '@/lib/gameLogic'

export async function createRoomAction(name: string, emoji: string) {
  const { success } = await ratelimit.room.limit()
  if (!success) {
    throw new Error('Too many rooms created')
  }

  const roomId = nanoid(10)
  const playerId = nanoid(10)

  await createRoom({
    id: roomId,
    creatorId: playerId,
    players: [
      {
        id: playerId,
        name,
        emoji,
        isSpectator: false,
      },
    ],
  })

  // Store initial game configuration in the database if needed

  return { roomId, player: { id: playerId, name, emoji, joinedAt: Date.now() } }
}

export async function joinRoomAction(
  roomId: string,
  name: string,
  emoji: string,
  isSpectator: boolean = false
) {
  const { success } = await ratelimit.room.limit()
  if (!success) {
    throw new Error('Too many requests')
  }

  const room = await getRoomWithRelations(roomId)
  if (!room) {
    throw new Error('Room not found')
  }

  if (!isSpectator && room.players.length >= 2) {
    throw new Error('Room is full')
  }

  const playerId = nanoid(10)

  await addPlayerToRoom(roomId, {
    id: playerId,
    roomId,
    name,
    emoji,
    isSpectator,
  })

  const player = { id: playerId, name, emoji, joinedAt: Date.now() }

  // Room state will be updated in the database via addPlayerToRoom

  return { roomId, player }
}

