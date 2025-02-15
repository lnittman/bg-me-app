import { kv } from '@vercel/kv';
import { db } from './db';
import { type InsertableRoom, type InsertablePlayer, type InsertableMessage } from './db';

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
    .returning('*')
    .execute();

  const [createdPlayer] = await db
    .insertInto('players')
    .values({
      ...player,
      room_id: room.id,
      color: 'white',
      is_host: true,
    })
    .returning('*')
    .execute();

  // Cache room state in KV for faster access
  await kv.set(`room:${room.id}`, {
    ...room,
    players: [createdPlayer],
    spectators: [],
    messages: [],
  });

  return {
    ...room,
    players: [createdPlayer],
    spectators: [],
    messages: [],
  };
}

export async function getRoom(id: string) {
  // Try to get from KV cache first
  const cached = await kv.get(`room:${id}`);
  if (cached) return cached;

  // If not in cache, get from database
  const room = await db
    .selectFrom('rooms')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();

  if (!room) return null;

  const [players, messages] = await Promise.all([
    db
      .selectFrom('players')
      .where('room_id', '=', id)
      .selectAll()
      .execute(),
    db
      .selectFrom('messages')
      .where('room_id', '=', id)
      .selectAll()
      .execute(),
  ]);

  const result = {
    ...room,
    players: players.filter(p => p.color !== null),
    spectators: players.filter(p => p.color === null),
    messages,
  };

  // Cache for next time
  await kv.set(`room:${id}`, result);

  return result;
}

export async function updateRoom(id: string, gameState: any) {
  const [room] = await db
    .updateTable('rooms')
    .set({
      game_state: JSON.stringify(gameState),
      updated_at: new Date(),
    })
    .where('id', '=', id)
    .returning('*')
    .execute();

  // Update cache
  const updatedRoom = await getRoom(id);
  await kv.set(`room:${id}`, updatedRoom);

  return updatedRoom;
}

export async function addMessage(roomId: string, message: InsertableMessage) {
  const [createdMessage] = await db
    .insertInto('messages')
    .values({
      ...message,
      room_id: roomId,
    })
    .returning('*')
    .execute();

  // Update cache
  const room = await getRoom(roomId);
  if (room) {
    room.messages.push(createdMessage);
    await kv.set(`room:${roomId}`, room);
  }

  return createdMessage;
}

export async function joinRoom(roomId: string, player: InsertablePlayer) {
  const room = await getRoom(roomId);
  if (!room) throw new Error('Room not found');

  // Determine if player should be white, black, or spectator
  let color: 'white' | 'black' | null = null;
  if (room.players.length === 0) color = 'white';
  else if (room.players.length === 1) color = 'black';

  const [createdPlayer] = await db
    .insertInto('players')
    .values({
      ...player,
      room_id: roomId,
      color,
      is_host: false,
    })
    .returning('*')
    .execute();

  // Update cache
  if (color) {
    room.players.push(createdPlayer);
  } else {
    room.spectators.push(createdPlayer);
  }
  await kv.set(`room:${roomId}`, room);

  return room;
} 