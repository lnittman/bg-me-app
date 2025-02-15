import { NextResponse } from 'next/server';
import { cache } from '@/lib/vercel';
import { addMessage } from '@/lib/db';
import { ratelimit } from '@/lib/ratelimit';
import { type Message } from '@/lib/shared/schema';

export const runtime = 'edge';

// Get chat messages
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await cache.getRoom(params.roomId);
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }

    // Get messages from cache
    const messages = await cache.getChatMessages(params.roomId);

    return NextResponse.json(messages);
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

    const room = await cache.getRoom(params.roomId);
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
    const newMessage = await addMessage({
      id: crypto.randomUUID(),
      roomId: params.roomId,
      playerId: message.playerId,
      text: message.text,
      timestamp: new Date(),
    });

    // Add to cache
    await cache.addChatMessage(params.roomId, {
      ...message,
      timestamp: Date.now(),
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse('Error sending message', { status: 500 });
  }
} 