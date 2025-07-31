import { Chess } from 'chess.js';
import type { ChessPiece, Move } from '../types/chess';

export class ChessAI {
  private pieceValues: { [key: string]: number } = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
    P: -1, N: -3, B: -3, R: -5, Q: -9, K: 0
  };

  // Position evaluation
  evaluatePosition(game: Chess): number {
    let evaluation = 0;
    const board = game.board();
    
    // Material count
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          evaluation += this.pieceValues[piece.type] * (piece.color === 'w' ? -1 : 1);
          
          // Positional bonuses
          evaluation += this.getPositionalBonus(piece, i, j);
        }
      }
    }
    
    // Game state bonuses
    if (game.isCheckmate()) {
      evaluation += game.turn() === 'w' ? 1000 : -1000;
    }
    
    if (game.inCheck()) {
      evaluation += game.turn() === 'w' ? -10 : 10;
    }
    
    return evaluation;
  }

  // Positional bonus for pieces
  private getPositionalBonus(piece: ChessPiece, row: number, col: number): number {
    const isWhite = piece.color === 'w';
    let bonus = 0;
    
    switch (piece.type) {
      case 'p': // Pawn
        bonus = isWhite ? (7 - row) * 0.1 : row * 0.1; // Advance bonus
        if (col >= 3 && col <= 4) bonus += 0.1; // Center files
        break;
      case 'n': // Knight
        // Knights better in center
        bonus = (4 - Math.abs(3.5 - row)) * 0.1 + (4 - Math.abs(3.5 - col)) * 0.1;
        break;
      case 'b': // Bishop
        // Bishops prefer long diagonals
        bonus = Math.abs(row - col) === 0 || Math.abs(row + col - 7) === 0 ? 0.2 : 0;
        break;
      case 'k': // King
        // King safety in opening/middlegame vs endgame activity
        const pieceCount = this.countPieces();
        if (pieceCount > 10) {
          // Opening/middlegame - stay safe
          bonus = isWhite ? 
            (row > 6 ? 0.3 : -0.3) : 
            (row < 1 ? 0.3 : -0.3);
        } else {
          // Endgame - be active
          bonus = (4 - Math.abs(3.5 - row)) * 0.1 + (4 - Math.abs(3.5 - col)) * 0.1;
        }
        break;
    }
    
    return bonus * (isWhite ? -1 : 1);
  }

  private countPieces(): number {
    // Simplified piece counting - would need game instance
    return 16; // Placeholder
  }

  // Minimax with alpha-beta pruning
  minimax(
    game: Chess, 
    depth: number, 
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number {
    if (depth === 0 || game.isGameOver()) {
      return this.evaluatePosition(game);
    }

    const moves = game.moves({ verbose: true });
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      game.move(move);
      const value = this.minimax(game, depth - 1, !isMaximizing, alpha, beta);
      game.undo();

      if (isMaximizing) {
        bestValue = Math.max(bestValue, value);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) break; // Alpha-beta pruning
      } else {
        bestValue = Math.min(bestValue, value);
        beta = Math.min(beta, value);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }

    return bestValue;
  }

  // Get best move for AI
  getBestMove(game: Chess, difficulty: string): Move | null {
    const possibleMoves = game.moves({ verbose: true });
    
    if (possibleMoves.length === 0) return null;

    switch (difficulty) {
      case 'easy':
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      case 'normal':
        return this.minimaxMove(game, 2);
      
      case 'hard':
        return this.minimaxMove(game, 4, true);
      
      default:
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  private minimaxMove(game: Chess, depth: number, useAlphaBeta: boolean = false): Move | null {
    const moves = game.moves({ verbose: true });
    let bestMove: Move | null = null;
    let bestValue = -Infinity;

    for (const move of moves) {
      game.move(move);
      const value = useAlphaBeta ? 
        this.minimax(game, depth - 1, false) :
        this.minimax(game, depth - 1, false, -Infinity, Infinity);
      game.undo();

      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  }
}