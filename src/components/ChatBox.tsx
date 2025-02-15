'use client';

import { useRef, useEffect } from 'react';
import { type Message } from '@/types/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      onSendMessage(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="mb-4 last:mb-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">
                {message.playerName}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
