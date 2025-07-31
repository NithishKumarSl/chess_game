import { Chess } from 'chess.js';

export interface Move {
  from: string;
  to: string;
  promotion?: string;
  capture?: boolean;
  castling?: boolean;
  enPassant?: boolean;
  piece: string;
  flags: string;
  captured?: string;
}

export interface GameMove {
  move: Move;
  fen: string;
  player: 'Player' | 'AI';
  timestamp: number;
  timeUsed?: number; // Time used for this move in milliseconds
}

export interface GameResult {
  type: 'checkmate' | 'stalemate' | 'draw' | 'insufficient' | 'repetition' | 'timeout';
  winner?: string;
  reason?: string;
}

export type PlayerColor = 'white' | 'black' | 'random';
export type AIDifficulty = 'novice' | 'intermediate' | 'master';
export type GameStatus = 'setup' | 'playing' | 'finished';

export interface TimeControl {
  type: 'unlimited' | 'blitz' | 'rapid' | 'classical' | 'custom';
  initialTime?: number; // Time in milliseconds
  increment?: number; // Increment per move in milliseconds
  customTime?: number; // Custom time in minutes
}

export interface PlayerTime {
  remaining: number; // Remaining time in milliseconds
  lastMoveTime?: number; // Time used for last move
}

export interface ChessGameState {
  game: Chess;
  gamePosition: string;
  playerColor: PlayerColor;
  aiDifficulty: AIDifficulty;
  timeControl: TimeControl;
  playerTime: PlayerTime;
  aiTime: PlayerTime;
  gameStatus: GameStatus;
  moveHistory: GameMove[];
  gameResult: GameResult | null;
  thinking: boolean;
  isPlayerTurn: boolean;
}

export interface ChessPiece {
  type: string;
  color: 'w' | 'b';
}

export interface SquareStyles {
  [key: string]: React.CSSProperties;
}