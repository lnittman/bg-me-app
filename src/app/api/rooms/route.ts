import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/db';
import { nanoid } from 'nanoid';
import { cache, blob, config } from '@/lib/vercel';
import { ratelimit } from '@/lib/ratelimit';
import { INITIAL_BOARD } from '@/lib/gameLogic';
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

export const runtime = 'edge';

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

    // Store room in KV for quick access
    await cache.setRoom(roomId, roomData);

    // Store initial game configuration in Edge Config
    await config.set(`game:${roomId}:config`, {
      initialBoard: INITIAL_BOARD,
      createdAt: Date.now(),
      maxPlayers: 2,
      timeLimit: 30 * 60, // 30 minutes
    });

    // Create a blob storage directory for game snapshots
    await blob.put(
      `games/${roomId}/metadata.json`,
      JSON.stringify({
        createdAt: new Date().toISOString(),
        creatorId,
        status: 'waiting',
      }),
      { access: 'public' }
    );

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
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the current user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
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
