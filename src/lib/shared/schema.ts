export interface Player {
  id: string;
  name: string;
  emoji: string;
  isSpectator?: boolean;
}

export interface GameState {
  board: number[];
  currentPlayer: "white" | "black";
  dice: number[];
  moveInProgress: boolean;
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
  creatorId: string;
  players: Player[];
  spectators: Player[];
  messages: Message[];
  gameState: GameState | null;
  readyStates: Record<string, boolean>;
}

export interface Message {
  playerId: string;
  text: string;
  timestamp: number;
}

// Game constants
export const BOARD_SIZE = 24;
export const INITIAL_CHECKERS_PER_PLAYER = 15;

// Game validation types
export type ValidMove = {
  from: number;
  to: number;
  dice: number;
}; 