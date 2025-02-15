import { Server } from 'socket.io';
import { type Server as HTTPServer } from 'http';
import { type Socket } from 'socket.io-client';
import { kv } from '@vercel/kv';
import { db, updateGameState, addMessage, updateReadyState } from './db';
import { type GameState, type Message } from './shared/schema';
import { ratelimit } from './ratelimit';

export const initSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    let currentRoom: string | null = null;

    socket.on('joinRoom', async (roomId: string) => {
      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
      }

      // Join new room
      socket.join(roomId);
      currentRoom = roomId;

      // Get room data from KV store
      const room = await kv.get(`room:${roomId}`);
      if (room) {
        socket.emit('roomState', room);
      }
    });

    socket.on('move', async ({ roomId, gameState }: { roomId: string; gameState: GameState }) => {
      try {
        // Rate limit moves
        const { success } = await ratelimit.move.limit(socket.id);
        if (!success) {
          socket.emit('error', 'Too many moves');
          return;
        }

        // Update game state in database
        await updateGameState(roomId, gameState);

        // Update KV store
        const room = await kv.get(`room:${roomId}`);
        if (room) {
          await kv.set(`room:${roomId}`, {
            ...room,
            gameState,
          });
        }

        // Broadcast new state to room
        io.to(roomId).emit('gameState', gameState);
      } catch (error) {
        console.error('Error processing move:', error);
        socket.emit('error', 'Error processing move');
      }
    });

    socket.on('message', async ({ roomId, message }: { roomId: string; message: Message }) => {
      try {
        // Rate limit messages
        const { success } = await ratelimit.message.limit(socket.id);
        if (!success) {
          socket.emit('error', 'Too many messages');
          return;
        }

        // Add message to database
        await addMessage({
          id: crypto.randomUUID(),
          roomId,
          playerId: message.playerId,
          text: message.text,
          timestamp: new Date(),
        });

        // Update KV store
        const room = await kv.get(`room:${roomId}`);
        if (room) {
          await kv.set(`room:${roomId}`, {
            ...room,
            messages: [...room.messages, message],
          });
        }

        // Broadcast message to room
        io.to(roomId).emit('message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Error sending message');
      }
    });

    socket.on('ready', async ({ roomId, playerId, isReady }: { roomId: string; playerId: string; isReady: boolean }) => {
      try {
        // Update ready state in database
        await updateReadyState(roomId, playerId, isReady);

        // Update KV store
        const room = await kv.get(`room:${roomId}`);
        if (room) {
          const readyStates = { ...room.readyStates, [playerId]: isReady };
          await kv.set(`room:${roomId}`, {
            ...room,
            readyStates,
          });
        }

        // Broadcast ready state to room
        io.to(roomId).emit('readyState', { playerId, isReady });
      } catch (error) {
        console.error('Error updating ready state:', error);
        socket.emit('error', 'Error updating ready state');
      }
    });

    socket.on('disconnect', () => {
      if (currentRoom) {
        socket.leave(currentRoom);
      }
    });
  });

  return io;
}; 