export interface Player {
  id: string;
  name: string;
  emoji: string;
  joinedAt: number;
  color?: 'white' | 'black' | null;
  isHost?: boolean;
  isReady?: boolean;
}

export interface Message {
  id: string;
  content: string;
  playerId: string;
  roomId: string;
  createdAt: number;
}

export interface GameState {
  board: number[];
  dice: number[];
  turn: 'white' | 'black';
  moveInProgress: boolean;
  winner: 'white' | 'black' | null;
  bar: {
    white: number;
    black: number;
  };
  off: {
    white: number;
    black: number;
  };
}

export interface Room {
  id: string;
  gameState: GameState;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  spectators: Player[];
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type RoomEvent = 
  | { type: 'join'; player: Player }
  | { type: 'leave'; playerId: string }
  | { type: 'ready'; playerId: string }
  | { type: 'unready'; playerId: string }
  | { type: 'start' }
  | { type: 'move'; from: number; to: number }
  | { type: 'roll' }
  | { type: 'message'; message: Message }; 