import { Chess } from 'chess.js';
import type { Move } from '../types/chess';

export const getGameStatusMessage = (game: Chess): string => {
  if (game.isCheckmate()) {
    return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
  }
  
  if (game.isDraw()) {
    if (game.isStalemate()) return 'Draw by stalemate';
    if (game.isInsufficientMaterial()) return 'Draw by insufficient material';
    if (game.isThreefoldRepetition()) return 'Draw by threefold repetition';
    return 'Draw';
  }
  
  if (game.inCheck()) {
    return `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`;
  }
  
  return `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
};

export const formatMove = (move: Move): string => {
  let notation = '';
  
  // Castling
  if (move.flags.includes('k')) return 'O-O';
  if (move.flags.includes('q')) return 'O-O-O';
  
  // Piece notation
  if (move.piece !== 'p') {
    notation += move.piece.toUpperCase();
  }
  
  // Capture
  if (move.captured) {
    if (move.piece === 'p') notation += move.from[0];
    notation += 'x';
  }
  
  // Destination
  notation += move.to;
  
  // Promotion
  if (move.promotion) {
    notation += '=' + move.promotion.toUpperCase();
  }
  
  return notation;
};

export const getSquareColor = (square: string): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
  const rank = parseInt(square[1]) - 1;   // 1=0, 2=1, etc.
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
};

export const isValidSquare = (square: string): boolean => {
  return /^[a-h][1-8]$/.test(square);
};