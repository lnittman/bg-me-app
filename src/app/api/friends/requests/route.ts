import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createFriendRequestAcceptedNotification } from "@/lib/notifications";
import { authOptions } from "@/lib/auth";

// Get friend requests
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Accept or reject friend request
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

      return NextResponse.json({ message: "Friend request accepted" });
    } else if (action === "reject") {
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });

      return NextResponse.json({ message: "Friend request rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling friend request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 