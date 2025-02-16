import { prisma } from "@/lib/db/prisma";

export type NotificationType = "friend_request" | "friend_request_accepted";

export async function createNotification({
  userId,
  type,
  title,
  message,
  data,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data: data || {},
    },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadNotificationsCount(userId: string) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// Friend request specific functions
export async function createFriendRequestNotification({
  recipientId,
  senderName,
  senderEmail,
}: {
  recipientId: string;
  senderName: string;
  senderEmail: string;
}) {
  return createNotification({
    userId: recipientId,
    type: "friend_request",
    title: "New Friend Request",
    message: `${senderName} sent you a friend request`,
    data: {
      senderName,
      senderEmail,
    },
  });
}

export async function createFriendRequestAcceptedNotification({
  recipientId,
  accepterName,
}: {
  recipientId: string;
  accepterName: string;
}) {
  return createNotification({
    userId: recipientId,
    type: "friend_request_accepted",
    title: "Friend Request Accepted",
    message: `${accepterName} accepted your friend request`,
    data: {
      accepterName,
    },
  });
} 