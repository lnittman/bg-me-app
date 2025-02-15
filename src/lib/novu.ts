import { Novu } from '@novu/node';

const novu = new Novu(process.env.NOVU_API_KEY!);

export const NOTIFICATION_TEMPLATES = {
  FRIEND_REQUEST: 'friend-request',
  FRIEND_REQUEST_ACCEPTED: 'friend-request-accepted',
} as const;

export async function sendFriendRequestNotification({
  recipientId,
  recipientEmail,
  recipientName,
  senderName,
  senderEmail,
  acceptUrl,
}: {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
  acceptUrl: string;
}) {
  try {
    await novu.trigger(NOTIFICATION_TEMPLATES.FRIEND_REQUEST, {
      to: {
        subscriberId: recipientId,
        email: recipientEmail,
      },
      payload: {
        recipientName,
        senderName,
        senderEmail,
        acceptUrl,
      },
    });
  } catch (error) {
    console.error('Error sending friend request notification:', error);
  }
}

export async function sendFriendRequestAcceptedNotification({
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
    await novu.trigger(NOTIFICATION_TEMPLATES.FRIEND_REQUEST_ACCEPTED, {
      to: {
        subscriberId: recipientId,
        email: recipientEmail,
      },
      payload: {
        recipientName,
        accepterName,
      },
    });
  } catch (error) {
    console.error('Error sending friend request accepted notification:', error);
  }
}

// Create or update a subscriber in Novu
export async function upsertSubscriber({
  id,
  email,
  name,
}: {
  id: string;
  email: string;
  name?: string | null;
}) {
  try {
    await novu.subscribers.identify(id, {
      email,
      firstName: name || undefined,
    });
  } catch (error) {
    console.error('Error upserting subscriber:', error);
  }
} 