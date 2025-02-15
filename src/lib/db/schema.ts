import { sql } from '@vercel/postgres';
import { type Generated, type Insertable, type Selectable, type Updateable } from 'kysely';

export interface Database {
  rooms: RoomTable;
  players: PlayerTable;
  messages: MessageTable;
}

export interface RoomTable {
  id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  game_state: string;
  status: 'waiting' | 'playing' | 'finished';
}

export interface PlayerTable {
  id: Generated<string>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  room_id: string;
  name: string;
  emoji: string;
  color: 'white' | 'black' | null;
  is_host: boolean;
  is_ready: boolean;
}

export interface MessageTable {
  id: Generated<string>;
  created_at: Generated<Date>;
  room_id: string;
  player_id: string;
  content: string;
}

export type Room = Selectable<RoomTable>;
export type InsertableRoom = Insertable<RoomTable>;
export type UpdateableRoom = Updateable<RoomTable>;

export type Player = Selectable<PlayerTable>;
export type InsertablePlayer = Insertable<PlayerTable>;
export type UpdateablePlayer = Updateable<PlayerTable>;

export type Message = Selectable<MessageTable>;
export type InsertableMessage = Insertable<MessageTable>;
export type UpdateableMessage = Updateable<MessageTable>;

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