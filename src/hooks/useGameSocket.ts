import { useEffect, useRef, useCallback } from 'react';
import { type Room, type RoomEvent } from '@/lib/types';

export function useGameSocket(roomId: string, onRoomUpdate: (room: Room) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  const sendEvent = useCallback((event: RoomEvent) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(event));
    }
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/api/rooms/${roomId}/socket`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('WebSocket error:', data.error);
        } else {
          onRoomUpdate(data as Room);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [roomId, onRoomUpdate]);

  return { sendEvent };
}
