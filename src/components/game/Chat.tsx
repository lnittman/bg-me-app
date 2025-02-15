import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  playerId: string;
  text: string;
  timestamp: number;
}

interface Player {
  id: string;
  name: string;
  emoji: string;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  players: Player[];
  spectators: Player[];
  currentUserId: string;
}

export default function Chat({ messages, onSendMessage, players, spectators, currentUserId }: ChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Card variant="bordered" className="h-full flex">
      {/* Chat section */}
      <div className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2 py-2">
          <ChatBubbleIcon className="h-5 w-5" />
          <h2 className="text-xl font-bold lowercase">chat</h2>
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <CardContent className="space-y-4">
            {messages.map((message, i) => (
              <div key={i} className="flex items-start gap-2">
                <span>{players.find(p => p.id === message.playerId)?.emoji}</span>
                <div className="space-y-1">
                  <p className="text-sm font-medium lowercase">
                    {players.find(p => p.id === message.playerId)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
        
        <CardFooter className="p-4 pt-0">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </div>

      {/* Participants section */}
      <div className="w-64 border-l">
        <CardHeader className="py-2">
          <h3 className="text-sm font-medium lowercase">participants</h3>
        </CardHeader>
        <ScrollArea className="h-[calc(100%-48px)]">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground lowercase">players</p>
              <AnimatePresence mode="popLayout">
                {players.map(player => (
                  <motion.div 
                    key={player.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md overflow-hidden",
                      player.id === currentUserId && "bg-muted"
                    )}
                  >
                    <span>{player.emoji}</span>
                    <span className="text-sm lowercase">{player.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {spectators.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground lowercase">spectators</p>
                <AnimatePresence mode="popLayout">
                  {spectators.map(spectator => (
                    <motion.div 
                      key={spectator.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md overflow-hidden",
                        spectator.id === currentUserId && "bg-muted"
                      )}
                    >
                      <span>{spectator.emoji}</span>
                      <span className="text-sm lowercase">{spectator.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </div>
    </Card>
  );
}
