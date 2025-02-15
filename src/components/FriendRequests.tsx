import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { toast } from "sonner";

interface FriendRequest {
  id: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

export function FriendRequests() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (requestId: string, action: "accept" | "reject") => {
    try {
      const response = await fetch("/api/friends/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      toast.success(`Friend request ${action}ed`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      toast.error("Failed to process friend request");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Friend Requests</SheetTitle>
          <SheetDescription>
            Accept or reject friend requests from other players.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No pending friend requests
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.sender.image || undefined} />
                    <AvatarFallback>
                      {request.sender.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.sender.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.sender.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRequest(request.id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequest(request.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 