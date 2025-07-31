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
}

export interface GameResult {
  type: 'checkmate' | 'stalemate' | 'draw' | 'insufficient' | 'repetition';
  winner?: string;
}

export type PlayerColor = 'white' | 'black' | 'random';
export type AIDifficulty = 'easy' | 'normal' | 'hard';
export type GameStatus = 'setup' | 'playing' | 'finished';

export interface ChessGameState {
  game: Chess;
  gamePosition: string;
  playerColor: PlayerColor;
  aiDifficulty: AIDifficulty;
  gameStatus: GameStatus;
  moveHistory: GameMove[];
  gameResult: GameResult | null;
  thinking: boolean;
}

export interface ChessPiece {
  type: string;
  color: 'w' | 'b';
}

export interface SquareStyles {
  [key: string]: React.CSSProperties;
}