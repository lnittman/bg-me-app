import { NextRequest, NextResponse } from 'next/server';
import { getRoom, updateRoom } from '@/lib/storage';
import { type Player } from '@/lib/types';

export const runtime = 'edge';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { player } = await request.json() as { player: Player };
    const room = await getRoom(params.id);

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if player already exists
    const existingPlayer = room.players.find(p => p.id === player.id);
    const existingSpectator = room.spectators.find(p => p.id === player.id);

    if (existingPlayer || existingSpectator) {
      // Player already in room, return current state
      return NextResponse.json(room);
    }

    // Add player to room based on available slots
    if (room.players.length < 2) {
      room.players.push(player);
    } else {
      room.spectators.push(player);
    }

    // Update room state
    const updatedRoom = await updateRoom(params.id, room);
    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
}
