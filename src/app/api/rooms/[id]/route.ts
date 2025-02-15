import { getRoom } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const matches = request.url.match(/\/rooms\/([^\/]+)$/);
    const id = matches?.[1];
    if (!id) {
      return new Response('Invalid room ID', { status: 400 });
    }

    const room = await getRoom(id);
    
    if (!room) {
      return new Response('Room not found', { status: 404 });
    }

    return Response.json(room);
  } catch {
    return new Response('Failed to get room', { status: 500 });
  }
}
