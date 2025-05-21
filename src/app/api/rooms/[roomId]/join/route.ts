import { NextResponse } from 'next/server';
import { addPlayerToRoom, getRoomWithRelations } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';
import { type Player } from '@/lib/shared/schema';

export const runtime = 'nodejs';

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

    const room = await getRoomWithRelations(params.roomId);
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

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error joining room:', error);
    return new NextResponse('Error joining room', { status: 500 });
  }
} 
