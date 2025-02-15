import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { sendFriendRequest, identifyUser } from "@/lib/knock";

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

  // Get friends with their online status
  const friends = await prisma.friend.findMany({
    where: { userId: currentUser.id },
    include: {
      friend: {
        select: {
          id: true,
          name: true,
          image: true,
          isOnline: true,
          lastSeen: true,
        },
      },
    },
  });

  // Transform the data to match the expected format
  const formattedFriends = friends.map((f) => ({
    id: f.friend.id,
    name: f.friend.name,
    image: f.friend.image,
    isOnline: f.friend.isOnline,
    lastSeen: f.friend.lastSeen,
  }));

  return NextResponse.json(formattedFriends);
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { friendEmail } = await request.json();

  // Get the current user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Find the friend by email
  const friend = await prisma.user.findUnique({
    where: { email: friendEmail },
  });

  if (!friend) {
    return new NextResponse("Friend not found", { status: 404 });
  }

  // Check if friend request already exists
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: friend.id },
        { senderId: friend.id, receiverId: currentUser.id },
      ],
    },
  });

  if (existingRequest) {
    return new NextResponse("Friend request already exists", { status: 400 });
  }

  // Create friend request
  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: currentUser.id,
      receiverId: friend.id,
    },
  });

  // Ensure both users are identified with Knock
  await Promise.all([
    identifyUser({
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    }),
    identifyUser({
      id: friend.id,
      email: friend.email,
      name: friend.name,
    }),
  ]);

  // Send notification through Knock
  await sendFriendRequest({
    recipientId: friend.id,
    recipientEmail: friend.email,
    recipientName: friend.name || friend.email,
    senderName: currentUser.name || currentUser.email,
    senderEmail: currentUser.email,
  });

  return NextResponse.json(friendRequest);
} 