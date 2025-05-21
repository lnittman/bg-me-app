import { NextResponse } from 'next/server';
import { getRoomWithRelations, updateGameState } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';

// Get room details
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await getRoomWithRelations(params.roomId);

    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return new NextResponse('Error fetching room', { status: 500 });
  }
}

// Update room state (ready states, game state, etc.)
export async function PATCH(
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

    const updates = await request.json();

    let updatedRoom = room;
    if (updates.gameState) {
      updatedRoom = await updateGameState(params.roomId, updates.gameState);
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return new NextResponse('Error updating room', { status: 500 });
  }
} 
