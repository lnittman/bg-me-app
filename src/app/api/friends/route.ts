import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { createFriendRequestNotification, createFriendRequestAcceptedNotification } from "@/lib/notifications";

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

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { recipientEmail } = await request.json();

    // Find the recipient user
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
    });

    if (!recipient) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if a friend request already exists
    const existingRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: session.user.id,
          receiverId: recipient.id,
        },
      },
    });

    if (existingRequest) {
      return new NextResponse("Friend request already sent", { status: 400 });
    }

    // Create the friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId: recipient.id,
      },
    });

    // Create a notification for the recipient
    await createFriendRequestNotification({
      recipientId: recipient.id,
      senderName: session.user.name || "Someone",
      senderEmail: session.user.email!,
    });

    return NextResponse.json(friendRequest);
  } catch (error) {
    console.error("Error creating friend request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { requestId, action } = await request.json();

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!friendRequest) {
      return new NextResponse("Friend request not found", { status: 404 });
    }

    if (friendRequest.receiverId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (action === "accept") {
      // Create friendship records
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

      // Create a notification for the sender
      await createFriendRequestAcceptedNotification({
        recipientId: friendRequest.senderId,
        accepterName: session.user.name || "Someone",
      });

      return new NextResponse("Friend request accepted");
    } else if (action === "reject") {
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });

      return new NextResponse("Friend request rejected");
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("Error handling friend request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 