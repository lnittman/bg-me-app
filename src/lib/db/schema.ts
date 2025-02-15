import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { type GameState, type Player } from '@shared/schema';
import { sql } from 'drizzle-orm';

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

// Auth.js / NextAuth.js tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionToken: text('session_token'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
},
(vt) => ({
  compoundKey: sql`PRIMARY KEY (${vt.identifier}, ${vt.token})`,
}));

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