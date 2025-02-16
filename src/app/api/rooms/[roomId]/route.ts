import { NextResponse } from 'next/server';
import { cache, config } from '@/lib/vercel';
import { getRoomWithRelations } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';

export const runtime = 'nodejs';

// Get room details
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    // Get room from KV cache first
    let room = await cache.getRoom(params.roomId);
    
    if (!room) {
      // If not in cache, get from database
      room = await getRoomWithRelations(params.roomId);
      if (room) {
        // Store in cache for future requests
        await cache.setRoom(params.roomId, room);
      }
    }

    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    // Get game config from Edge Config
    const gameConfig = await config.get(`game:${params.roomId}:config`);

    return NextResponse.json({
      ...room,
      config: gameConfig,
    });
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

    const room = await cache.getRoom(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    const updates = await request.json();
    const updatedRoom = {
      ...room,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update in KV cache
    await cache.setRoom(params.roomId, updatedRoom);

    // If game state is updated, save snapshot to blob storage
    if (updates.gameState) {
      await cache.setGameState(params.roomId, updates.gameState);
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return new NextResponse('Error updating room', { status: 500 });
  }
} 