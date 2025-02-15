import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { sendFriendRequestAccepted } from "@/lib/knock";

// Get friend requests
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

  // Get pending friend requests
  const requests = await prisma.friendRequest.findMany({
    where: {
      receiverId: currentUser.id,
      status: "pending",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(requests);
}

// Accept or reject friend request
export async function PATCH(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { requestId, action } = await request.json();

  if (!requestId || !action || !["accept", "reject"].includes(action)) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  // Get the current user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Get the friend request
  const friendRequest = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: {
      sender: true,
    },
  });

  if (!friendRequest || friendRequest.receiverId !== currentUser.id) {
    return new NextResponse("Friend request not found", { status: 404 });
  }

  if (friendRequest.status !== "pending") {
    return new NextResponse("Friend request already processed", { status: 400 });
  }

  if (action === "accept") {
    // Create friend connections for both users
    await prisma.$transaction([
      prisma.friend.create({
        data: {
          userId: friendRequest.senderId,
          friendId: friendRequest.receiverId,
        },
      }),
      prisma.friend.create({
        data: {
          userId: friendRequest.receiverId,
          friendId: friendRequest.senderId,
        },
      }),
      prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "accepted" },
      }),
    ]);

    // Send notification through Knock
    await sendFriendRequestAccepted({
      recipientId: friendRequest.senderId,
      recipientEmail: friendRequest.sender.email,
      recipientName: friendRequest.sender.name || friendRequest.sender.email,
      accepterName: currentUser.name || currentUser.email,
    });
  } else {
    // Reject the request
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "rejected" },
    });
  }

  return new NextResponse("Friend request processed", { status: 200 });
} 