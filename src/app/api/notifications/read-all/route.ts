import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { markAllNotificationsAsRead } from "@/lib/notifications";

export async function POST() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await markAllNotificationsAsRead(session.user.id);
    return new NextResponse("OK");
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 