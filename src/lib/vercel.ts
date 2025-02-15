import { createClient } from '@vercel/edge-config';
import { put, del, list } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { type Room, type GameState, type Message } from './shared/schema';

// Edge Config client
export const config = createClient(process.env.EDGE_CONFIG!);

// Blob storage client with helper functions
export const blob = {
  put,
  del,
  list,
  // Helper for avatar uploads
  async uploadAvatar(playerId: string, file: File) {
    const { url } = await put(`avatars/${playerId}.png`, file, {
      access: 'public',
      contentType: file.type,
    });
    return url;
  },
  // Helper for game state snapshots
  async saveGameState(roomId: string, gameState: GameState) {
    const { url } = await put(
      `games/${roomId}/state-${Date.now()}.json`,
      JSON.stringify(gameState),
      { access: 'public' }
    );
    return url;
  }
};

// KV helper functions
export const cache = {
  // Room cache helpers
  async getRoom(roomId: string): Promise<Room | null> {
    return kv.get(`room:${roomId}`);
  },
  async setRoom(roomId: string, data: Room) {
    return kv.set(`room:${roomId}`, data);
  },
  async deleteRoom(roomId: string) {
    return kv.del(`room:${roomId}`);
  },
  
  // Player session helpers
  async getPlayerSession(playerId: string) {
    return kv.get(`player:${playerId}`);
  },
  async setPlayerSession(
    playerId: string, 
    data: { roomId: string; name: string; emoji: string; isSpectator?: boolean; joinedAt: string }, 
    expiresIn: number = 3600
  ) {
    return kv.set(`player:${playerId}`, data, { ex: expiresIn });
  },
  
  // Game state cache
  async getGameState(roomId: string): Promise<GameState | null> {
    return kv.get(`game:${roomId}`);
  },
  async setGameState(roomId: string, state: GameState) {
    return kv.set(`game:${roomId}`, state);
  },
  
  // Chat message cache
  async getChatMessages(roomId: string, limit: number = 100): Promise<Message[]> {
    return kv.lrange(`chat:${roomId}`, 0, limit - 1);
  },
  async addChatMessage(roomId: string, message: Message) {
    return kv.lpush(`chat:${roomId}`, JSON.stringify(message));
  },
  
  // Rate limiting helpers
  async getRateLimit(key: string): Promise<number | null> {
    return kv.get(`ratelimit:${key}`);
  },
  async setRateLimit(key: string, limit: number, windowMs: number) {
    return kv.set(`ratelimit:${key}`, limit, { px: windowMs });
  }
}; 