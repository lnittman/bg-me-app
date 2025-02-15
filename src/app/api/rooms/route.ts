import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/storage';

export const runtime = 'edge';

export async function POST() {
  try {
    const room = await createRoom();
    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
