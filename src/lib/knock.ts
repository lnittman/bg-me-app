import { Knock } from "@knocklabs/client";
import { KnockFeedProvider } from "@knocklabs/react";

export const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!);

export const KNOCK_CHANNEL_ID = "friend-requests";

export async function sendFriendRequest({
  recipientId,
  recipientEmail,
  recipientName,
  senderName,
  senderEmail,
}: {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
}) {
  try {
    await knockClient.notify("friend-request", {
      actor: senderEmail,
      recipients: [recipientId],
      data: {
        senderName,
        senderEmail,
        recipientName,
      },
    });
  } catch (error) {
    console.error("Error sending friend request notification:", error);
  }
}

export async function sendFriendRequestAccepted({
  recipientId,
  recipientEmail,
  recipientName,
  accepterName,
}: {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  accepterName: string;
}) {
  try {
    await knockClient.notify("friend-request-accepted", {
      actor: accepterName,
      recipients: [recipientId],
      data: {
        accepterName,
        recipientName,
      },
    });
  } catch (error) {
    console.error("Error sending friend request accepted notification:", error);
  }
}

export async function identifyUser({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name?: string | null;
}) {
  try {
    await knockClient.users.identify(id, {
      email,
      name: name || undefined,
    });
  } catch (error) {
    console.error("Error identifying user:", error);
  }
} 