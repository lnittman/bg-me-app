import { NextResponse } from "next/server";
import { markAllNotificationsAsRead } from "@/lib/notifications";
import { auth } from "@/lib/auth";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await markAllNotificationsAsRead(userId);
    return new NextResponse("OK");
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 