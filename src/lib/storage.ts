import { kv } from '@vercel/kv';
import { prisma } from './db/prisma';
import { type Room, type Player, type Message, type GameState } from '@/types/schema';

const rooms = new Map<string, Room>();

export async function createRoom(player: Omit<Player, 'id' | 'roomId' | 'joinedAt'>) {
  const room = await prisma.room.create({
    data: {
      gameState: {
        board: Array(24).fill(0),
        dice: [],
        turn: 'white',
        moveInProgress: false,
        winner: null,
        bar: { white: 0, black: 0 },
        off: { white: 0, black: 0 },
      },
      status: 'waiting',
      players: {
        create: {
          ...player,
          color: 'white',
          isHost: true,
          isReady: false
        }
      }
    },
    include: {
      players: true,
      messages: true
    }
  });

  const roomState = {
    ...room,
    spectators: [],
  };

  // Cache room state in KV for faster access
  await kv.set(`room:${room.id}`, roomState);

  return roomState;
}

export async function getRoom(roomId: string) {
  // Try to get from cache first
  const cached = await kv.get<Room>(`room:${roomId}`);
  if (cached) return cached;

  // If not in cache, get from database
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      players: true,
      messages: true
    }
  });

  if (!room) return null;

  const roomState = {
    ...room,
    spectators: room.players.filter(p => !p.color)
  };

  // Cache for next time
  await kv.set(`room:${roomId}`, roomState);

  return roomState;
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

export async function joinRoom(roomId: string, player: Omit<Player, 'id' | 'roomId' | 'joinedAt'>) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      players: true,
      messages: true
    }
  });

  if (!room) throw new Error('Room not found');

  // Determine if player should be white, black, or spectator
  let color: 'white' | 'black' | undefined = undefined;
  if (room.players.length === 0) color = 'white';
  else if (room.players.length === 1) color = 'black';

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: {
      players: {
        create: {
          ...player,
          color,
          isHost: false,
          isReady: false
        }
      }
    },
    include: {
      players: true,
      messages: true
    }
  });

  // Update cache
  const roomState = {
    ...updatedRoom,
    spectators: updatedRoom.players.filter(p => !p.color)
  };
  await kv.set(`room:${roomId}`, roomState);

  return roomState;
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