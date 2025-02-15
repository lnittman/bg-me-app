import * as React from 'react';
import { create } from 'zustand';
import { type Room, type Player } from '@/types/schema';
import { useGameSocket } from '@/hooks/useGameSocket';
import useSWR from 'swr';

interface GameStore {
  currentRoom: Room | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: Error | null;
  setCurrentRoom: (room: Room | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  joinRoom: (roomId: string, player: Player) => void;
  leaveRoom: (roomId: string, playerId: string) => void;
  setReady: (roomId: string, playerId: string) => void;
  setUnready: (roomId: string, playerId: string) => void;
  startGame: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  setError: (error: Error | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentRoom: null,
  currentPlayer: null,
  isLoading: false,
  error: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  joinRoom: (roomId, player) => {
    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  leaveRoom: (roomId, playerId) => {
    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  setReady: (roomId, playerId) => {
    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/ready`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  setUnready: (roomId, playerId) => {
    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/unready`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  startGame: (roomId) => {
    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/start`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  sendMessage: (roomId, text) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    set({ isLoading: true });
    fetch(`/api/rooms/${roomId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        text,
        timestamp: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((room) => set({ currentRoom: room }))
      .catch((error) => set({ error }))
      .finally(() => set({ isLoading: false }));
  },

  setError: (error) => set({ error }),
}));

// Custom hook that combines SWR and WebSocket
export function useGame(roomId: string | null) {
  const { 
    setCurrentRoom, 
    setError,
    currentRoom,
    currentPlayer 
  } = useGameStore();

  // SWR fetch for initial room data and revalidation
  const { data: room, error } = useSWR<Room>(
    roomId ? `/api/rooms/${roomId}` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch room');
      return res.json();
    },
    {
      refreshInterval: 0, // Disable polling since we use WebSocket
      revalidateOnFocus: false,
    }
  );

  // WebSocket connection for real-time updates
  const { send } = useGameSocket(
    roomId ?? '',
    (updatedRoom) => {
      setCurrentRoom(updatedRoom);
    }
  );

  // Set room data from SWR
  React.useEffect(() => {
    if (room) {
      setCurrentRoom(room);
    }
    if (error) {
      setError(error);
    }
  }, [room, error, setCurrentRoom, setError]);

  return {
    room: currentRoom,
    player: currentPlayer,
    send,
    isLoading: !error && !room,
    error,
  };
}

export default useGameStore;
