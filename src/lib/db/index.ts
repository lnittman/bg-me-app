import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { type GameState } from '@/lib/shared/schema';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });

// Helper function to get a room with its players and messages
export async function getRoomWithRelations(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.id, roomId),
    with: {
      players: true,
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
        limit: 100,
      },
    },
  });

  return room;
}

// Helper function to create a new room
export async function createRoom(creatorId: string) {
  const [room] = await db
    .insert(schema.rooms)
    .values({
      id: crypto.randomUUID(),
      creatorId,
    })
    .returning();

  return room;
}

// Helper function to add a player to a room
export async function addPlayerToRoom(roomId: string, player: schema.NewPlayer) {
  const [newPlayer] = await db
    .insert(schema.players)
    .values(player)
    .returning();

  return newPlayer;
}

// Helper function to update game state
export async function updateGameState(roomId: string, gameState: GameState) {
  const [updatedRoom] = await db
    .update(schema.rooms)
    .set({
      gameState,
      updatedAt: new Date(),
    })
    .where(({ id }) => id.equals(roomId))
    .returning();

  return updatedRoom;
}

// Helper function to add a message
export async function addMessage(message: schema.NewMessage) {
  const [newMessage] = await db
    .insert(schema.messages)
    .values(message)
    .returning();

  return newMessage;
}

// Helper function to update ready states
export async function updateReadyState(roomId: string, playerId: string, isReady: boolean) {
  const room = await db.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.id, roomId),
  });

  if (!room) throw new Error('Room not found');

  const readyStates = { ...room.readyStates, [playerId]: isReady };

  const [updatedRoom] = await db
    .update(schema.rooms)
    .set({
      readyStates,
      updatedAt: new Date(),
    })
    .where(({ id }) => id.equals(roomId))
    .returning();

  return updatedRoom;
} 