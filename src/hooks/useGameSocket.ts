import { useEffect, useRef, useCallback } from 'react';
import { type Room, type RoomEvent } from '@/types/schema';

export function useGameSocket(
  roomId: string,
  onRoomUpdate: (room: Room) => void,
  autoConnect = true
) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const scheduleReconnect = useCallback(() => {
    if (!autoConnect) return;
    const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current += 1;
      connect();
    }, delay);
  }, [connect, autoConnect]);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(`/api/rooms/${roomId}/socket`);
    socketRef.current = socket;
    reconnectAttempts.current = 0;

    socket.addEventListener('open', () => {
      reconnectAttempts.current = 0;
    });
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      onRoomUpdate(data);
    });

    socket.addEventListener('close', () => {
      socketRef.current = null;
      scheduleReconnect();
    });

    socket.addEventListener('error', () => {
      socket.close();
    });
  }, [roomId, onRoomUpdate, scheduleReconnect]);

  const send = useCallback((event: RoomEvent) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ ...event, roomId })
      );
    }
  }, [roomId]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect, autoConnect]);

  return {
    connect,
    send,
    socket: socketRef.current,
  };
}
