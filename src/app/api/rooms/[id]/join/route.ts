import { type Player } from '@/types/schema';
import { joinRoom } from '@/lib/storage';
import { type InsertablePlayer } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const matches = request.url.match(/\/rooms\/([^\/]+)\/join/);
    const id = matches?.[1];
    if (!id) {
      return new Response('Invalid room ID', { status: 400 });
    }

    const { name, emoji } = await request.json() as Pick<Player, 'name' | 'emoji'>;
    
    const insertablePlayer: InsertablePlayer = {
      name,
      emoji,
      room_id: id,
      is_host: false,
      is_ready: false,
    };

    const room = await joinRoom(id, insertablePlayer);
    return Response.json(room);
  } catch {
    return new Response('Failed to join room', { status: 500 });
  }
}
