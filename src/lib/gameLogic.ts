import { BOARD_SIZE, type ValidMove } from './shared/schema';

// Initial board setup for backgammon
export const INITIAL_BOARD = [
  2, 0, 0, 0, 0, -5, // 0-5
  0, -3, 0, 0, 0, 5, // 6-11
  -5, 0, 0, 0, 3, 0, // 12-17
  5, 0, 0, 0, 0, -2  // 18-23
];

// Get the board from the current player's perspective
export function getPlayerBoard(board: number[], isWhite: boolean): number[] {
  if (isWhite) return [...board];
  return [...board].reverse().map(x => -x);
}

// Roll two dice
export function rollDice(): number[] {
  return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
}

// Check if a move is valid
export function isValidMove(
  board: number[],
  from: number,
  to: number,
  currentPlayer: "white" | "black",
  dice: number[]
): boolean {
  // Basic validation
  if (from < 0 || from >= BOARD_SIZE || to < 0 || to >= BOARD_SIZE) return false;
  
  // Check if the move distance matches a die
  const distance = Math.abs(to - from);
  if (!dice.includes(distance)) return false;

  // Check if the piece belongs to the current player
  const piece = board[from];
  if ((currentPlayer === "white" && piece <= 0) || 
      (currentPlayer === "black" && piece >= 0)) {
    return false;
  }

  // Check if the destination is valid
  const destPiece = board[to];
  if ((currentPlayer === "white" && destPiece < -1) || 
      (currentPlayer === "black" && destPiece > 1)) {
    return false;
  }

  return true;
}

// Make a move on the board
export function makeMove(board: number[], from: number, to: number): number[] {
  const newBoard = [...board];
  const piece = newBoard[from];
  
  // Remove piece from source
  newBoard[from] = newBoard[from] - Math.sign(piece);
  
  // Add piece to destination
  newBoard[to] = newBoard[to] + Math.sign(piece);
  
  return newBoard;
}

// Get all valid moves for the current player
export function getValidMoves(
  board: number[],
  currentPlayer: "white" | "black",
  dice: number[]
): ValidMove[] {
  const moves: ValidMove[] = [];
  const direction = currentPlayer === "white" ? 1 : -1;

  for (let from = 0; from < BOARD_SIZE; from++) {
    const piece = board[from];
    if ((currentPlayer === "white" && piece <= 0) || 
        (currentPlayer === "black" && piece >= 0)) {
      continue;
    }

    for (const die of dice) {
      const to = from + (die * direction);
      if (isValidMove(board, from, to, currentPlayer, dice)) {
        moves.push({ from, to, dice: die });
      }
    }
  }

  return moves;
}

// Check if a player can bear off
export function canBearOff(board: number[], currentPlayer: "white" | "black"): boolean {
  const otherPoints = currentPlayer === "white" ? board.slice(0, 18) : board.slice(6);
  
  // Check if all pieces are in home board
  return otherPoints.every(point => 
    (currentPlayer === "white" && point <= 0) || 
    (currentPlayer === "black" && point >= 0)
  );
}

// Check if the game is over
export function isGameOver(board: number[]): boolean {
  // Check if either player has borne off all pieces
  const whitePieces = board.reduce((sum, point) => sum + Math.max(0, point), 0);
  const blackPieces = board.reduce((sum, point) => sum + Math.abs(Math.min(0, point)), 0);
  
  return whitePieces === 0 || blackPieces === 0;
}

// Get the winner if the game is over
export function getWinner(board: number[]): "white" | "black" | null {
  if (!isGameOver(board)) return null;
  
  const whitePieces = board.reduce((sum, point) => sum + Math.max(0, point), 0);
  return whitePieces === 0 ? "white" : "black";
} 