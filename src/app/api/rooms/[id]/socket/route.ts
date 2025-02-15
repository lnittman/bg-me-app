import { type WebSocket } from '@vercel/edge';
import { kv } from '@vercel/kv';
import { updateRoom, addMessage } from '@/lib/storage';

interface GameEvent {
  type: 'move' | 'roll' | 'ready' | 'message';
  from?: number;
  to?: number;
  playerId?: string;
  isReady?: boolean;
  message?: {
    playerId: string;
    text: string;
    timestamp: number;
  };
}

export const runtime = 'edge';

export async function GET(request: Request) {
  const { socket, response } = Deno.upgradeWebSocket(request);
  const url = new URL(request.url);
  const roomId = url.pathname.split('/')[3];

  // Add this socket to room's socket list
  const roomSockets = (await kv.get<WebSocket[]>(`sockets:${roomId}`)) || [];
  roomSockets.push(socket);
  await kv.set(`sockets:${roomId}`, roomSockets);

  socket.onopen = () => {
    console.log('WebSocket opened');
  };

  socket.onmessage = async (event) => {
    try {
      const gameEvent = JSON.parse(event.data) as GameEvent;
      let room;

      switch (gameEvent.type) {
        case 'move':
          if (gameEvent.from !== undefined && gameEvent.to !== undefined) {
            room = await updateRoom(roomId, {
              type: 'move',
              from: gameEvent.from,
              to: gameEvent.to,
            });
          }
          break;

        case 'roll':
          room = await updateRoom(roomId, { type: 'roll' });
          break;

        case 'ready':
          if (gameEvent.playerId !== undefined && gameEvent.isReady !== undefined) {
            room = await updateRoom(roomId, {
              type: 'ready',
              playerId: gameEvent.playerId,
              isReady: gameEvent.isReady,
            });
          }
          break;

        case 'message':
          if (gameEvent.message) {
            await addMessage(roomId, {
              room_id: roomId,
              player_id: gameEvent.message.playerId,
              content: gameEvent.message.text,
            });
            room = await updateRoom(roomId, { type: 'message' });
          }
          break;
      }

      if (room) {
        // Broadcast update to all connected sockets
        const roomSockets = await kv.get<WebSocket[]>(`sockets:${roomId}`);
        if (roomSockets) {
          const message = JSON.stringify(room);
          roomSockets.forEach((s) => {
            try {
              s.send(message);
            } catch (err) {
              console.error('Error sending message to socket:', err);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      socket.send(JSON.stringify({ error: 'Failed to process event' }));
    }
  };

  socket.onclose = async () => {
    // Remove this socket from room's socket list
    const roomSockets = await kv.get<WebSocket[]>(`sockets:${roomId}`);
    if (roomSockets) {
      const index = roomSockets.indexOf(socket);
      if (index > -1) {
        roomSockets.splice(index, 1);
        await kv.set(`sockets:${roomId}`, roomSockets);
      }
    }
  };

  return response;
} 