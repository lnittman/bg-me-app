import { sql } from '@vercel/postgres';
import { type Generated, type Insertable, type Selectable, type Updateable } from 'kysely';

export interface Room {
  id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  game_state: string;
  status: 'waiting' | 'playing' | 'finished';
}

export interface Player {
  id: Generated<string>;
  room_id: string;
  name: string;
  emoji: string;
  color: 'white' | 'black' | null;
  is_host: boolean;
  is_ready: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Message {
  id: Generated<string>;
  room_id: string;
  player_id: string;
  content: string;
  created_at: Generated<Date>;
}

export interface Database {
  rooms: Room;
  players: Player;
  messages: Message;
}

export type InsertableRoom = Insertable<Room>;
export type SelectableRoom = Selectable<Room>;
export type UpdateableRoom = Updateable<Room>;

export type InsertablePlayer = Insertable<Player>;
export type SelectablePlayer = Selectable<Player>;
export type UpdateablePlayer = Updateable<Player>;

export type InsertableMessage = Insertable<Message>;
export type SelectableMessage = Selectable<Message>;
export type UpdateableMessage = Updateable<Message>;

// Create tables if they don't exist
export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS rooms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      game_state JSONB NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'waiting'
        CHECK (status IN ('waiting', 'playing', 'finished'))
    );

    CREATE TABLE IF NOT EXISTS players (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      color TEXT CHECK (color IN ('white', 'black')),
      is_host BOOLEAN NOT NULL DEFAULT false,
      is_ready BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
} 