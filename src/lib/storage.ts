import { type Player } from '@/lib/types';

interface Room {
  id: string;
  players: Player[];
  createdAt: number;
  updatedAt: number;
}

const rooms = new Map<string, Room>();

export function createRoom(): Room {
  const id = Math.random().toString(36).substring(2, 15);
  const room: Room = {
    id,
    players: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  rooms.set(id, room);
  return room;
}

export function getRoom(id: string): Room | undefined {
  return rooms.get(id);
}

export function updateRoom(id: string, room: Room): void {
  room.updatedAt = Date.now();
  rooms.set(id, room);
}

export function deleteRoom(id: string): void {
  rooms.delete(id);
} 