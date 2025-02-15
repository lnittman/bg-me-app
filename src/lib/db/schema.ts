import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { type GameState, type Player } from '@shared/schema';

export const rooms = pgTable('rooms', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  gameState: jsonb('game_state').$type<GameState | null>().default(null),
  readyStates: jsonb('ready_states').$type<Record<string, boolean>>().default({}),
});

export const players = pgTable('players', {
  id: text('id').primaryKey(),
  roomId: text('room_id').references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  emoji: text('emoji').notNull(),
  isSpectator: boolean('is_spectator').default(false).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
  playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
  text: text('text').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// For rate limiting and session management
export const ratelimits = pgTable('ratelimits', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  tokens: integer('tokens').notNull(),
  expires: timestamp('expires').notNull(),
});

// Types
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

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