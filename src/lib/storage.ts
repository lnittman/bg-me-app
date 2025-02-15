import { kv } from '@vercel/kv';
import { db } from './db';
import { type InsertablePlayer } from './db';
import { type Room, type Player, type Message, type GameState } from '@/types/schema';

const rooms = new Map<string, Room>();

export async function createRoom(player: InsertablePlayer) {
  const [room] = await db
    .insertInto('rooms')
    .values({
      game_state: JSON.stringify({
        board: Array(24).fill(0),
        dice: [],
        turn: 'white',
        moveInProgress: false,
        winner: null,
      }),
      status: 'waiting',
    })
    .returning(['id', 'game_state', 'status', 'created_at', 'updated_at'])
    .execute();

  const [createdPlayer] = await db
    .insertInto('players')
    .values({
      ...player,
      room_id: room.id,
      color: 'white',
      is_host: true,
    })
    .returning(['id', 'name', 'emoji', 'room_id', 'color', 'is_host', 'is_ready'])
    .execute();

  const playerWithJoinedAt: Player = {
    id: createdPlayer.id,
    name: createdPlayer.name,
    emoji: createdPlayer.emoji,
    color: createdPlayer.color as 'white' | 'black',
    joinedAt: Date.now(),
    isReady: createdPlayer.is_ready,
  };

  const roomState = {
    ...room,
    players: [playerWithJoinedAt],
    spectators: [],
    messages: [],
  };

  // Cache room state in KV for faster access
  await kv.set(`room:${room.id}`, roomState);

  return roomState;
}

export async function getRoom(id: string): Promise<Room | null> {
  return rooms.get(id) || null;
}

export async function updateRoom(id: string, gameState: GameState): Promise<Room | null> {
  const room = await getRoom(id);
  if (!room) return null;
  
  room.gameState = gameState;
  room.updatedAt = Date.now();
  rooms.set(id, room);
  return room;
}

export async function addMessage(roomId: string, message: Message): Promise<Room | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.messages.push(message);
  room.updatedAt = Date.now();
  rooms.set(roomId, room);
  return room;
}

export async function joinRoom(roomId: string, player: InsertablePlayer) {
  const room = await getRoom(roomId);
  if (!room) throw new Error('Room not found');

  // Determine if player should be white, black, or spectator
  let color: 'white' | 'black' | undefined = undefined;
  const players = room.players || [];
  if (players.length === 0) color = 'white';
  else if (players.length === 1) color = 'black';

  const [createdPlayer] = await db
    .insertInto('players')
    .values({
      ...player,
      room_id: roomId,
      color,
      is_host: false,
    })
    .returning(['id', 'name', 'emoji', 'room_id', 'color', 'is_host', 'is_ready'])
    .execute();

  const playerWithJoinedAt: Player = {
    id: createdPlayer.id,
    name: createdPlayer.name,
    emoji: createdPlayer.emoji,
    color: createdPlayer.color as 'white' | 'black' | undefined,
    joinedAt: Date.now(),
    isReady: createdPlayer.is_ready,
  };

  // Update cache
  if (color) {
    room.players = room.players || [];
    room.players.push(playerWithJoinedAt);
  } else {
    room.spectators = room.spectators || [];
    room.spectators.push(playerWithJoinedAt);
  }
  await kv.set(`room:${roomId}`, room);

  return room;
}

export async function addPlayer(
  roomId: string,
  player: Player,
  asSpectator = false
): Promise<Room | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  if (!asSpectator) {
    if (room.players.length >= 2) {
      return null;
    }
    room.players.push(player);
  } else {
    room.spectators.push(player);
  }

  room.updatedAt = Date.now();
  rooms.set(roomId, room);
  return room;
}

export async function removePlayer(roomId: string, playerId: string): Promise<Room | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.players = room.players.filter(p => p.id !== playerId);
  room.spectators = room.spectators.filter(p => p.id !== playerId);
  room.updatedAt = Date.now();
  rooms.set(roomId, room);
  return room;
}

export async function setPlayerReady(
  roomId: string,
  playerId: string,
  isReady: boolean
): Promise<Room | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.readyStates[playerId] = isReady;
  room.updatedAt = Date.now();
  rooms.set(roomId, room);
  return room;
}

export async function startGame(roomId: string): Promise<Room | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.status = 'playing';
  room.updatedAt = Date.now();
  rooms.set(roomId, room);
  return room;
} 