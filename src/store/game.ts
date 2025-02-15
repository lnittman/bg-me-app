import { create } from 'zustand';
import { type Room, type Player, type Message, type GameState } from '@/lib/types';
import { useGameSocket } from '@/hooks/useGameSocket';
import useSWR from 'swr';

interface GameStore {
  currentRoom: Room | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: Error | null;
  setCurrentRoom: (room: Room) => void;
  setCurrentPlayer: (player: Player) => void;
  updateGameState: (gameState: GameState) => void;
  addMessage: (message: Message) => void;
  setError: (error: Error | null) => void;
}

const useGameStore = create<GameStore>((set) => ({
  currentRoom: null,
  currentPlayer: null,
  isLoading: false,
  error: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  updateGameState: (gameState) => 
    set((state) => ({
      currentRoom: state.currentRoom 
        ? { ...state.currentRoom, gameState }
        : null
    })),
  addMessage: (message) =>
    set((state) => ({
      currentRoom: state.currentRoom
        ? {
            ...state.currentRoom,
            messages: [...state.currentRoom.messages, message],
          }
        : null
    })),
  setError: (error) => set({ error }),
}));

// Custom hook that combines SWR, WebSocket, and Zustand
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
  const { sendEvent } = useGameSocket(
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
    sendEvent,
    isLoading: !error && !room,
    error,
  };
}

export default useGameStore;
