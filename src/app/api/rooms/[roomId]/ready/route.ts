import { NextResponse } from 'next/server';
import { getRoomWithRelations, updateReadyState } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { success } = await ratelimit.room.limit();
    if (!success) {
      return new NextResponse('Too many requests', { status: 429 });
    }

    const room = await getRoomWithRelations(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    const { playerId, isReady } = await request.json();

    // Validate player is in the room
    const isValidPlayer = room.players.some(p => p.id === playerId);
    if (!isValidPlayer) {
      return new NextResponse('Player not found in room', { status: 404 });
    }

    // Update ready state in database
    await updateReadyState(params.roomId, playerId, isReady);

    const readyStates = { ...room.readyStates, [playerId]: isReady };
    const updatedRoom = {
      ...room,
      readyStates,
    };

    // Check if all players are ready
    const allPlayersReady = room.players.length === 2 && 
      room.players.every(p => readyStates[p.id]);

    return NextResponse.json({
      ...updatedRoom,
      allPlayersReady,
    });
  } catch (error) {
    console.error('Error updating ready state:', error);
    return new NextResponse('Error updating ready state', { status: 500 });
  }
} 
