import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;
export type JsonValue = boolean | number | string | null | JsonObject | JsonArray;
export type JsonArray = JsonValue[];
export type JsonObject = { [K in string]?: JsonValue };

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_token: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
  emailVerified: Timestamp | null;
  image: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Timestamp;
}

export interface Room {
  id: string;
  creatorId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  gameState: Json | null;
  readyStates: Json;
}

export interface Player {
  id: string;
  roomId: string;
  userId: string;
  name: string;
  emoji: string;
  isSpectator: Generated<boolean>;
  joinedAt: Generated<Timestamp>;
}

export interface Message {
  id: string;
  roomId: string;
  playerId: string;
  text: string;
  timestamp: Generated<Timestamp>;
}

export interface RateLimit {
  id: string;
  key: string;
  tokens: number;
  expires: Timestamp;
}

export interface Database {
  Account: Account;
  Session: Session;
  User: User;
  VerificationToken: VerificationToken;
  Room: Room;
  Player: Player;
  Message: Message;
  RateLimit: RateLimit;
} 