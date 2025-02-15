import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { KnockFeedProvider, useFeedStore } from "@knocklabs/react";
import { knockClient, KNOCK_CHANNEL_ID } from "@/lib/knock";
import { Icon } from "@/components/ui/icon";

function NotificationButton() {
  const store = useFeedStore();
  const unseenCount = store?.metadata?.unseen_count || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={`${unseenCount} unread notifications`}
    >
      <Icon
        name="Bell"
        className={cn(
          "w-5 h-5 transition-colors",
          unseenCount > 0 && "text-primary"
        )}
      />
      {unseenCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
          {unseenCount}
        </span>
      )}
    </Button>
  );
}

export function NotificationBell() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      // Identify user with Knock
      knockClient.users.identify(session.user.id, {
        email: session.user.email!,
        name: session.user.name || undefined,
      });
    }
  }, [session?.user]);

  if (!session?.user) return null;

  return (
    <KnockFeedProvider
      feedId={KNOCK_CHANNEL_ID}
      defaultFeedOptions={{
        tenant: "default",
      }}
      onNotificationClick={(item) => {
        if (item.data.requestId) {
          // Handle friend request acceptance from notification
          fetch("/api/friends/requests", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestId: item.data.requestId,
              action: "accept",
            }),
          }).catch(console.error);
        }
      }}
    >
      <NotificationButton />
    </KnockFeedProvider>
  );
} 