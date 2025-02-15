import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/storage';
import { type InsertablePlayer } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { player } = await request.json() as { player: InsertablePlayer };
    const room = await createRoom(player);
    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
