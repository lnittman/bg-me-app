import { useEffect, useRef, useCallback } from 'react';
import { type Room, type RoomEvent } from '@/types/schema';

export function useGameSocket(
  roomId: string,
  onRoomUpdate: (room: Room) => void,
  autoConnect = true
) {
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(`/api/rooms/${roomId}/socket`);
    socketRef.current = socket;

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      onRoomUpdate(data);
    });

    socket.addEventListener('close', () => {
      socketRef.current = null;
    });
  }, [roomId, onRoomUpdate]);

  const send = useCallback((event: RoomEvent) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(event));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect, autoConnect]);

  return {
    connect,
    send,
    socket: socketRef.current,
  };
}
