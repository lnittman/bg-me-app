"use client"

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

function NotificationItem({ 
  notification, 
  onRead 
}: { 
  notification: { 
    id: string; 
    title: string; 
    message: string; 
    isRead: boolean;
    createdAt: string;
  };
  onRead: (id: string) => void;
}) {
  return (
    <div 
      className={cn(
        "p-4 hover:bg-accent cursor-pointer transition-colors",
        !notification.isRead && "bg-accent/50"
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="font-medium lowercase">{notification.title}</p>
          <p className="text-sm text-muted-foreground lowercase">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1 lowercase">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
        )}
      </div>
    </div>
  );
}

export function NotificationBell() {
  const { user } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg bg-card border shadow-sm"
          >
            <Icon name="Bell" className="h-5 w-5 transition-colors" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          alignOffset={0}
          sideOffset={8} 
          className="w-80"
          side="top"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-medium lowercase">notifications</h4>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs lowercase"
              >
                mark all as read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground lowercase">
                no notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 