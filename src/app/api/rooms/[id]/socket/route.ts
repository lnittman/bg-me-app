import { type RoomEvent } from '@/types/schema';
import { getRoom, addMessage, addPlayer, removePlayer, setPlayerReady, startGame } from '@/lib/storage';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const matches = request.url.match(/\/rooms\/([^\/]+)\/socket/);
    const id = matches?.[1];
    if (!id) {
      return new Response('Invalid room ID', { status: 400 });
    }

    const room = await getRoom(id);
    
    if (!room) {
      return new Response('Room not found', { status: 404 });
    }

    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const socket = new WebSocket(`wss://${request.headers.get('host')}/api/rooms/${id}/socket`);

    socket.addEventListener('message', async (event: MessageEvent) => {
      const data = JSON.parse(event.data) as RoomEvent;
      const room = await getRoom(id);
      if (!room) return;

      switch (data.type) {
        case 'join':
          await addPlayer(id, data.player);
          break;
        case 'leave':
          await removePlayer(id, data.playerId);
          break;
        case 'ready':
          await setPlayerReady(id, data.playerId, true);
          break;
        case 'unready':
          await setPlayerReady(id, data.playerId, false);
          break;
        case 'start':
          await startGame(id);
          break;
        case 'message':
          await addMessage(id, data.message);
          break;
      }

      const updatedRoom = await getRoom(id);
      if (updatedRoom) {
        socket.send(JSON.stringify(updatedRoom));
      }
    });

    return new Response(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': request.headers.get('Sec-WebSocket-Key') || '',
      },
    });
  } catch {
    return new Response('Failed to handle WebSocket connection', { status: 500 });
  }
} 