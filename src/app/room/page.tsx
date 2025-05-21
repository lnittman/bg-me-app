"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { AddFriendDialog } from "@/components/AddFriendDialog";
import { Icon } from "@/components/ui/icon";
import { useGameStore } from "@/store/game";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  isOnline: boolean;
}

interface Room {
  id: string;
  creatorId: string;
  status: string;
  players: {
    id: string;
    name: string;
    emoji: string;
  }[];
}

export default function RoomPage() {
  const { user } = useUser();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer);

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.id) {
      // Fetch friends
      fetch("/api/friends")
        .then((res) => res.json())
        .then((data) => setFriends(data));

      // Fetch active rooms
      fetch("/api/rooms")
        .then((res) => res.json())
        .then((data) => setRooms(data));
    }
  }, [user?.id]);

  const handleWatch = (roomId: string) => {
    if (!user) return;
    const spectator = {
      id: Math.random().toString(36).substring(2, 9),
      name: user.firstName || user.username || "spectator",
      emoji: "\uD83D\uDC40", // 👀
      joinedAt: Date.now(),
      isSpectator: true,
    };
    setCurrentPlayer(spectator);
    router.push(`/room/${roomId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Friends List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-medium lowercase">friends</h2>
          </div>
          <AddFriendDialog />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={friend.image || undefined} />
                        <AvatarFallback>
                          {friend.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          friend.isOnline ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{friend.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Invite
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Active Rooms */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Door" className="w-5 h-5" />
            <h2 className="text-lg font-medium lowercase">active rooms</h2>
          </div>
          <Button asChild>
            <Link href="/room/create" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>new room</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => (
                <div key={room.id}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {room.players.map((player) => (
                            <div
                              key={player.id}
                              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-background"
                            >
                              {player.emoji}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {room.players.map((p) => p.name).join(" vs ")}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {room.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm">
                          <Link href={`/room/${room.id}`}>join</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleWatch(room.id)}>
                          watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 