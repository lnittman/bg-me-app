import { Server } from 'socket.io';
import { type Server as HTTPServer } from 'http';
import { updateGameState, addMessage, updateReadyState, getRoomWithRelations } from './db';
import { type GameState, type Message } from './shared/schema';
import { isValidMove, makeMove, rollDice } from './gameLogic';
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

      const room = await getRoomWithRelations(roomId);
      if (room) {
        socket.emit('roomState', room);
      }
    });

    socket.on('move', async ({ roomId, from, to }: { roomId: string; from: number; to: number }) => {
      try {
        const { success } = await ratelimit.move.limit(socket.id);
        if (!success) {
          socket.emit('error', 'Too many moves');
          return;
        }

        const room = await getRoomWithRelations(roomId);
        if (!room || !room.gameState) {
          socket.emit('error', 'Room not found');
          return;
        }

        const { board, dice, turn } = room.gameState as GameState;
        if (!isValidMove(board, from, to, turn, dice)) {
          socket.emit('error', 'Invalid move');
          return;
        }

        const newBoard = makeMove(board, from, to);
        const distance = Math.abs(to - from);
        const dieIndex = dice.indexOf(distance);
        if (dieIndex !== -1) dice.splice(dieIndex, 1);

        let nextTurn = turn;
        if (dice.length === 0) {
          nextTurn = turn === 'white' ? 'black' : 'white';
          dice.push(...rollDice());
        }

        const newState: GameState = { ...room.gameState, board: newBoard, dice, turn: nextTurn };
        await updateGameState(roomId, newState);

        io.to(roomId).emit('gameState', newState);
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
        await addMessage(roomId, message.playerId, message.text);

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
