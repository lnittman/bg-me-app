import { type Player } from '@/lib/types';

export async function createRoom(player: Player) {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player }),
  });

  if (!response.ok) {
    throw new Error('Failed to create room');
  }

  return response.json();
}

export async function joinRoom(roomId: string, player: Player) {
  const response = await fetch(`/api/rooms/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player }),
  });

  if (!response.ok) {
    throw new Error('Failed to join room');
  }

  return response.json();
} 