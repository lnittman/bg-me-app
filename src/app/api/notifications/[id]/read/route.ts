import { NextResponse } from "next/server";
import { markNotificationAsRead } from "@/lib/notifications";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Verify the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    if (notification.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await markNotificationAsRead(params.id);
    return new NextResponse("OK");
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 