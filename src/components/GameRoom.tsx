'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/store/game';
import { GameBoard } from '@/components/GameBoard';
import { PlayerInfo } from '@/components/PlayerInfo';
import { ChatBox } from '@/components/ChatBox';
import { DiceRoll } from '@/components/DiceRoll';

export function GameRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { room, player, sendEvent, isLoading, error } = useGame(roomId);

  useEffect(() => {
    if (error) {
      router.push('/');
    }
  }, [error, router]);

  if (isLoading) {
    return <div>Loading game...</div>;
  }

  if (!room || !player) {
    return <div>Room not found</div>;
  }

  const isPlayerTurn = room.gameState.turn === 'white' 
    ? room.players[0]?.id === player.id 
    : room.players[1]?.id === player.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GameBoard 
            gameState={room.gameState}
            currentPlayer={player}
            onMove={(from, to) => {
              if (isPlayerTurn) {
                sendEvent({ type: 'move', from, to });
              }
            }}
          />
          
          <div className="mt-4">
            <DiceRoll 
              dice={room.gameState.dice}
              canRoll={isPlayerTurn && !room.gameState.moveInProgress}
              onRoll={() => sendEvent({ type: 'roll' })}
            />
          </div>
        </div>
        
        <div className="space-y-8">
          <PlayerInfo 
            players={room.players}
            spectators={room.spectators}
            readyStates={room.readyStates}
            currentPlayer={player}
            onReady={(isReady) => {
              sendEvent({ type: 'ready', playerId: player.id, isReady });
            }}
          />
          
          <ChatBox 
            messages={room.messages}
            onSendMessage={(text) => {
              sendEvent({
                type: 'message',
                message: {
                  playerId: player.id,
                  text,
                  timestamp: Date.now(),
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
