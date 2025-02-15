import { NextRequest, NextResponse } from 'next/server';
import { joinRoom } from '@/lib/storage';
import { type InsertablePlayer } from '@/lib/db';

export const runtime = 'edge';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { player } = await request.json() as { player: InsertablePlayer };
    const room = await joinRoom(params.id, player);
    return NextResponse.json(room);
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
}
