'use client';

import { useParams } from 'next/navigation';
import { useGame } from '@/store/game';
import { GameBoard } from '@/components/GameBoard';
import { ChatBox } from '@/components/ChatBox';
import { Card, CardContent } from '@/components/ui/card';

export function GameRoom() {
  const { id: roomId } = useParams();
  const { room, player, send, isLoading, error } = useGame(roomId as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!room || !player) {
    return <div>Room not found</div>;
  }

  const isSpectator = player.isSpectator || player.color === undefined;

  const handleMove = (from: number, to: number) => {
    if (isSpectator) return;
    send({ type: 'move', from, to });
  };

  const handleSendMessage = (text: string) => {
    send({
      type: 'message',
      message: {
        id: Math.random().toString(36).substring(2, 9),
        playerId: player.id,
        playerName: player.name,
        text,
        timestamp: Date.now(),
      },
    });
  };

  return (
    <div className="space-y-2">
      {isSpectator && (
        <div className="text-center text-sm text-muted-foreground">spectating</div>
      )}
      <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
        <Card>
          <CardContent className="p-4">
            <GameBoard
              gameState={room.gameState}
              currentPlayer={player}
              onMove={handleMove}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0 h-full">
            <ChatBox
              messages={room.messages}
              onSendMessage={handleSendMessage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
