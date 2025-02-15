export function getPlayerBoard(board: number[], isWhite: boolean): number[] {
  if (isWhite) return board;
  return [...board].reverse().map(count => -count);
}

export function isValidMove(board: number[], from: number, to: number, isWhite: boolean): boolean {
  // Check if the move is within bounds
  if (from < 0 || from > 23 || to < 0 || to > 23) return false;

  // Check if there's a piece to move
  const piece = board[from];
  if (piece === 0) return false;

  // Check if the piece belongs to the current player
  if (isWhite && piece < 0) return false;
  if (!isWhite && piece > 0) return false;

  // Check if the destination is valid
  const destPiece = board[to];
  if (destPiece !== 0) {
    // Can't move onto opponent's piece unless it's a single piece
    if (isWhite && destPiece < 0 && destPiece !== -1) return false;
    if (!isWhite && destPiece > 0 && destPiece !== 1) return false;
  }

  return true;
}

export function makeMove(board: number[], from: number, to: number): number[] {
  const newBoard = [...board];
  const piece = newBoard[from];
  const destPiece = newBoard[to];

  // Remove piece from source
  newBoard[from] = piece > 0 ? piece - 1 : piece + 1;

  // Add piece to destination
  if (destPiece === 0) {
    newBoard[to] = piece > 0 ? 1 : -1;
  } else {
    newBoard[to] = piece > 0 ? destPiece + 1 : destPiece - 1;
  }

  return newBoard;
}

export function getValidMoves(board: number[], dice: number[], isWhite: boolean): [number, number][] {
  const moves: [number, number][] = [];

  for (let from = 0; from < 24; from++) {
    for (const die of dice) {
      const to = isWhite ? from + die : from - die;
      if (isValidMove(board, from, to, isWhite)) {
        moves.push([from, to]);
      }
    }
  }

  return moves;
}

export function hasWon(board: number[], isWhite: boolean): boolean {
  // Check if all pieces are in the home board (last 6 spaces)
  const start = isWhite ? 18 : 0;
  const end = isWhite ? 24 : 6;

  // Check if any pieces are outside home board
  for (let i = 0; i < 24; i++) {
    if (i >= start && i < end) continue;
    const piece = board[i];
    if (isWhite && piece > 0) return false;
    if (!isWhite && piece < 0) return false;
  }

  return true;
} 