import { createKysely } from "@vercel/postgres-kysely";
import { type Database } from "./types";
import { prisma } from "./prisma";

// Keep Kysely instance for edge functions
export const db = createKysely<Database>();

// Helper function to get a room with its relations
export async function getRoomWithRelations(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      players: true,
      messages: {
        orderBy: { timestamp: 'asc' },
        take: 100
      }
    }
  });

  if (!room) return null;

  return room;
}

// Helper function to create a room
export async function createRoom(data: any) {
  return prisma.room.create({
    data: {
      ...data,
      players: {
        create: data.players
      }
    },
    include: {
      players: true,
      messages: true
    }
  });
}

// Helper function to add a player to a room
export async function addPlayerToRoom(roomId: string, playerData: any) {
  return prisma.player.create({
    data: {
      ...playerData,
      roomId
    },
    include: {
      room: {
        include: {
          players: true,
          messages: true
        }
      }
    }
  });
}

// Helper function to update game state
export async function updateGameState(roomId: string, gameState: any) {
  return prisma.room.update({
    where: { id: roomId },
    data: { gameState },
    include: {
      players: true,
      messages: true
    }
  });
}

// Helper function to add a message
export async function addMessage(roomId: string, playerId: string, text: string) {
  return prisma.message.create({
    data: {
      roomId,
      playerId,
      text
    },
    include: {
      player: true
    }
  });
}

// Helper function to update ready state
export async function updateReadyState(roomId: string, playerId: string, isReady: boolean) {
  return prisma.player.update({
    where: { id: playerId },
    data: { isReady },
    include: {
      room: {
        include: {
          players: true,
          messages: true
        }
      }
    }
  });
} 