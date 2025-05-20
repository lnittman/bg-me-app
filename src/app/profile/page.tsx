import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddFriendDialog } from "@/components/AddFriendDialog";
import { FriendRequests } from "@/components/FriendRequests";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  isOnline: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/friends")
        .then((res) => res.json())
        .then((data) => setFriends(data));
    }
  }, [session?.user?.id]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback>{session.user.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold">{session.user.name}</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-medium lowercase">friends</h2>
          <div className="flex items-center gap-2">
            <FriendRequests />
            <AddFriendDialog />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {friends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  No friends yet
                </p>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.image || undefined} />
                      <AvatarFallback>{friend.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friend.name}</span>
                    {friend.isOnline && (
                      <span className="ml-auto text-xs text-green-500">
                        online
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
