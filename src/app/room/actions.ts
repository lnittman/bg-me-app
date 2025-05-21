'use server'

import { nanoid } from 'nanoid'
import { createRoom, addPlayerToRoom } from '@/lib/db'
import { cache, config, blob } from '@/lib/vercel'
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

  const roomData = {
    id: roomId,
    creatorId: playerId,
    players: [{ id: playerId, name, emoji }],
    spectators: [],
    messages: [],
    gameState: null,
    readyStates: {},
  }

  await cache.setRoom(roomId, roomData)
  await config.set(`game:${roomId}:config`, {
    initialBoard: INITIAL_BOARD,
    createdAt: Date.now(),
    maxPlayers: 2,
    timeLimit: 30 * 60,
  })
  await blob.put(
    `games/${roomId}/metadata.json`,
    JSON.stringify({
      createdAt: new Date().toISOString(),
      creatorId: playerId,
      status: 'waiting',
    }),
    { access: 'public' }
  )
  await cache.setPlayerSession(playerId, {
    roomId,
    name,
    emoji,
    isSpectator: false,
    joinedAt: new Date().toISOString(),
  })

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

  const room = await cache.getRoom(roomId)
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

  const updatedRoom = {
    ...room,
    players: isSpectator ? room.players : [...room.players, player],
    spectators: isSpectator ? [...room.spectators, player] : room.spectators,
    updatedAt: new Date().toISOString(),
  }

  await cache.setRoom(roomId, updatedRoom)
  await cache.setPlayerSession(playerId, {
    roomId,
    name,
    emoji,
    isSpectator,
    joinedAt: new Date().toISOString(),
  })

  return { roomId, player }
}
