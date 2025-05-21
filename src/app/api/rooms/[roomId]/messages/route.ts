import { NextResponse } from 'next/server';
import { addMessage, getRoomWithRelations } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';
import { type Message } from '@/lib/shared/schema';

export const runtime = 'nodejs';

// Get chat messages
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await getRoomWithRelations(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    return NextResponse.json(room.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new NextResponse('Error fetching messages', { status: 500 });
  }
}

// Send a new message
export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { success } = await ratelimit.message.limit();
    if (!success) {
      return new NextResponse('Too many messages', { status: 429 });
    }

    const room = await getRoomWithRelations(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    const message = (await request.json()) as Message;

    // Validate sender is in the room
    const isValidSender = [...room.players, ...room.spectators]
      .some(p => p.id === message.playerId);
    if (!isValidSender) {
      return new NextResponse('Sender not found in room', { status: 404 });
    }

    // Add message to database
    const newMessage = await addMessage(params.roomId, message.playerId, message.text);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse('Error sending message', { status: 500 });
  }
} 
