import { NextResponse } from "next/server";
import { markAllNotificationsAsRead } from "@/lib/notifications";
import { auth } from "@/lib/auth";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await markAllNotificationsAsRead(userId);
    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 