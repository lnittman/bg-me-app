import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/db';
import { nanoid } from 'nanoid';
import { ratelimit } from '@/lib/ratelimit';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Rate limit: 10 rooms per hour per IP
    const { success } = await ratelimit.room.limit();
    if (!success) {
      return new NextResponse('Too many rooms created', { status: 429 });
    }

    // Create room ID and creator ID
    const roomId = nanoid(10);
    const creatorId = nanoid(10);

    // Create initial room state
    const roomData = {
      id: roomId,
      creatorId,
      players: [],
      spectators: [],
      messages: [],
      gameState: null,
      readyStates: {},
    };

    // Create room in database
    const room = await createRoom(creatorId);

    return NextResponse.json({
      ...room,
      ...roomData,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return new NextResponse('Error creating room', { status: 500 });
  }
}

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the current user
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Get active rooms where the user is a player
  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { creatorId: currentUser.id },
        {
          players: {
            some: {
              userId: currentUser.id,
            },
          },
        },
      ],
      status: {
        in: ["waiting", "playing"],
      },
    },
    include: {
      players: {
        select: {
          id: true,
          name: true,
          emoji: true,
          userId: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(rooms);
}

