import { NextResponse } from 'next/server';
import { cache } from '@/lib/vercel';
import { addPlayerToRoom } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';
import { type Player } from '@/lib/shared/schema';

export const runtime = 'edge';

type Context = {
  params: {
    roomId: string;
  };
};

export async function POST(request: Request, { params }: Context) {
  try {
    const { success } = await ratelimit.room.limit();
    if (!success) {
      return new NextResponse('Too many requests', { status: 429 });
    }

    const room = await cache.getRoom(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    const { player } = (await request.json()) as { player: Player };

    // Check if room is full
    if (!player.isSpectator && room.players.length >= 2) {
      return new NextResponse('Room is full', { status: 400 });
    }

    // Add player to database
    await addPlayerToRoom(params.roomId, {
      id: player.id,
      roomId: params.roomId,
      name: player.name,
      emoji: player.emoji,
      isSpectator: player.isSpectator || false,
    });

    // Update room in cache
    const updatedRoom = {
      ...room,
      players: player.isSpectator 
        ? room.players 
        : [...room.players, player],
      spectators: player.isSpectator
        ? [...room.spectators, player]
        : room.spectators,
      updatedAt: new Date().toISOString(),
    };

    await cache.setRoom(params.roomId, updatedRoom);

    // Store player session
    await cache.setPlayerSession(player.id, {
      roomId: params.roomId,
      name: player.name,
      emoji: player.emoji,
      isSpectator: player.isSpectator,
      joinedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error joining room:', error);
    return new NextResponse('Error joining room', { status: 500 });
  }
} 