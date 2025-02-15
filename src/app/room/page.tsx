"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, GamepadIcon } from "lucide-react";
import Link from "next/link";
import { AddFriendDialog } from "@/components/AddFriendDialog";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch friends
      fetch("/api/friends")
        .then((res) => res.json())
        .then((data) => setFriends(data));

      // Fetch active rooms
      fetch("/api/rooms")
        .then((res) => res.json())
        .then((data) => setRooms(data));
    }
  }, [session?.user?.id]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Friends List */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-medium lowercase">friends</h2>
            </div>
            <AddFriendDialog />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
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

        {/* Active Games */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <GamepadIcon className="w-5 h-5" />
              <h2 className="text-lg font-medium lowercase">active games</h2>
            </div>
            <Button asChild>
              <Link href="/room/create" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>new game</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 gap-4">
                {rooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/room/${room.id}`}
                    className="block"
                  >
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
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
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 