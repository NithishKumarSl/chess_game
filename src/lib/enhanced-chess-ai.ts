import { Chess } from 'chess.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Move, AIDifficulty } from '../types/chess';
import { isQuotaExceededError, getQuotaStatusMessage } from './ai-utils';

// Enhanced AI System that combines multiple approaches
export class EnhancedChessAI {
  private difficulty: AIDifficulty;
  private geminiAI: GoogleGenerativeAI | null = null;
  private useGemini: boolean = false;
  private quotaExceeded: boolean = false;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
    this.initializeEngines();
  }

  private async initializeEngines() {
    // Initialize Gemini AI
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        this.geminiAI = new GoogleGenerativeAI(geminiApiKey);
        this.useGemini = true;
        console.log('Gemini AI initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize Gemini AI:', error);
        this.useGemini = false;
      }
    } else {
      console.log('No Gemini API key found, using custom algorithm only');
    }
  }

  // Get move using multiple AI approaches
  public async getMove(game: Chess): Promise<Move | null> {
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return null;

    // Collect moves from different AI approaches
    const moves: { move: Move; source: string; confidence: number }[] = [];

    // 1. Original algorithm (always available)
    const originalMove = this.getOriginalAlgorithmMove(game);
    if (originalMove) {
      moves.push({ move: originalMove, source: 'original', confidence: 0.3 });
    }

    // 2. Gemini AI (if available and quota not exceeded)
    if (this.useGemini && !this.quotaExceeded) {
      const geminiMove = await this.getGeminiMove(game);
      if (geminiMove) {
        moves.push({ move: geminiMove, source: 'gemini', confidence: 0.9 });
      }
    }

    // 3. Fallback to original algorithm if no other engines available
    if (moves.length === 0 && originalMove) {
      return originalMove;
    }

    // Select the best move based on confidence and difficulty
    return this.selectBestMove(moves);
  }

  // Original algorithm (from chess-ai.ts)
  private getOriginalAlgorithmMove(game: Chess): Move | null {
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return null;

    switch (this.difficulty) {
      case 'novice':
        if (Math.random() < 0.7) {
          return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          return this.getBestMoveByEvaluation(game, possibleMoves);
        }
      
      case 'intermediate':
        if (Math.random() < 0.4) {
          return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          return this.minimaxMove(game, 2, false);
        }
      
      case 'master':
        if (Math.random() < 0.1) {
          return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          return this.minimaxMove(game, 4, true);
        }
      
      default:
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  // Gemini AI integration
  private async getGeminiMove(game: Chess): Promise<Move | null> {
    if (!this.geminiAI) return null;

    try {
      const model = this.geminiAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const fen = game.fen();
      const moveHistory = game.history();
      const isWhiteTurn = game.turn() === 'w';
      
      const prompt = `
You are a chess AI assistant. Analyze the current position and suggest the best move.

Current position (FEN): ${fen}
Move history: ${moveHistory.join(', ')}
Current turn: ${isWhiteTurn ? 'White' : 'Black'}
Difficulty level: ${this.difficulty}

Available moves: ${game.moves().join(', ')}

Please respond with ONLY the best move in algebraic notation (e.g., "e4", "Nf3", "O-O", etc.).
Consider the difficulty level:
- Novice: Focus on basic principles and avoid blunders
- Intermediate: Play solid moves with some tactical awareness
- Master: Play the strongest move with deep calculation

Respond with just the move notation, nothing else.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const moveText = response.text().trim();

      // Convert the move text to a Move object
      const move = this.convertGeminiMove(game, moveText);
      return move;

    } catch (error: any) {
      console.error('Gemini AI error:', error);
      
      // Check if it's a quota exceeded error
      if (isQuotaExceededError(error)) {
        console.warn('Gemini API quota exceeded, falling back to custom algorithm');
        console.log(getQuotaStatusMessage());
        this.useGemini = false; // Disable Gemini for this session
        this.quotaExceeded = true; // Set quotaExceeded flag
        return null; // Let the custom algorithm handle the move
      }
      
      return null;
    }
  }

  private convertGeminiMove(game: Chess, moveText: string): Move | null {
    try {
      // Handle special moves
      if (moveText === 'O-O' || moveText === '0-0') {
        // Kingside castle
        const moves = game.moves({ verbose: true });
        const castleMove = moves.find(m => m.flags.includes('k'));
        return castleMove || null;
      }
      
      if (moveText === 'O-O-O' || moveText === '0-0-0') {
        // Queenside castle
        const moves = game.moves({ verbose: true });
        const castleMove = moves.find(m => m.flags.includes('q'));
        return castleMove || null;
      }

      // Handle regular moves
      const moves = game.moves({ verbose: true });
      
      // Try to find matching move
      for (const move of moves) {
        if (move.san === moveText || 
            `${move.from}${move.to}` === moveText ||
            `${move.from}-${move.to}` === moveText) {
          return move;
        }
      }

      // If no exact match, try to parse the move
      const move = game.move(moveText);
      if (move) {
        game.undo();
        return move;
      }

    } catch (error) {
      console.error('Error converting Gemini move:', error);
    }
    return null;
  }

  // Select the best move from multiple AI approaches
  private selectBestMove(moves: { move: Move; source: string; confidence: number }[]): Move | null {
    if (moves.length === 0) return null;

    // Sort by confidence
    moves.sort((a, b) => b.confidence - a.confidence);

    // Apply difficulty-based selection
    const random = Math.random();
    
    switch (this.difficulty) {
      case 'novice':
        // 60% chance to pick the best move, 40% chance to pick randomly
        if (random < 0.6) {
          return moves[0].move;
        } else {
          return moves[Math.floor(Math.random() * moves.length)].move;
        }
      
      case 'intermediate':
        // 80% chance to pick the best move, 20% chance to pick from top 3
        if (random < 0.8) {
          return moves[0].move;
        } else {
          const topMoves = moves.slice(0, Math.min(3, moves.length));
          return topMoves[Math.floor(Math.random() * topMoves.length)].move;
        }
      
      case 'master':
        // Always pick the best move
        return moves[0].move;
      
      default:
        return moves[0].move;
    }
  }

  // Original algorithm methods (copied from chess-ai.ts)
  private getBestMoveByEvaluation(game: Chess, moves: Move[]): Move {
    let bestMove = moves[0];
    let bestValue = -Infinity;
    
    for (const move of moves) {
      game.move(move);
      const value = this.evaluatePosition(game);
      game.undo();
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove;
  }

  private minimaxMove(game: Chess, depth: number, useAlphaBeta = false): Move | null {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    let bestMove = moves[0];
    let bestValue = -Infinity;

    for (const move of moves) {
      game.move(move);
      const value = this.minimax(game, depth - 1, false, -Infinity, Infinity, useAlphaBeta);
      game.undo();

      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private minimax(game: Chess, depth: number, isMaximizing: boolean, alpha = -Infinity, beta = Infinity, useAlphaBeta = false): number {
    if (depth === 0) {
      return this.evaluatePosition(game);
    }

    if (game.isGameOver()) {
      return this.evaluatePosition(game);
    }

    const moves = game.moves({ verbose: true });
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      game.move(move);
      const value = this.minimax(game, depth - 1, !isMaximizing, alpha, beta, useAlphaBeta);
      game.undo();

      if (isMaximizing) {
        bestValue = Math.max(bestValue, value);
        if (useAlphaBeta) {
          alpha = Math.max(alpha, value);
          if (beta <= alpha) break;
        }
      } else {
        bestValue = Math.min(bestValue, value);
        if (useAlphaBeta) {
          beta = Math.min(beta, value);
          if (beta <= alpha) break;
        }
      }
    }

    return bestValue;
  }

  private evaluatePosition(game: Chess): number {
    const pieceValues: { [key: string]: number } = {
      p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
      P: -1, N: -3, B: -3, R: -5, Q: -9, K: 0
    };
    
    let evaluation = 0;
    const board = game.board();
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          evaluation += pieceValues[piece.type] * (piece.color === 'w' ? -1 : 1);
        }
      }
    }
    
    if (game.isCheckmate()) {
      evaluation += game.turn() === 'w' ? 10000 : -10000;
    }
    
    if (game.inCheck()) {
      evaluation += game.turn() === 'w' ? -50 : 50;
    }
    
    return evaluation;
  }

  public getThinkingMessage(): string {
    const sources = [];
    if (this.useGemini && !this.quotaExceeded) sources.push('Gemini AI');
    if (this.quotaExceeded) sources.push('Gemini AI (Quota Exceeded)');
    sources.push('Custom Algorithm');

    switch (this.difficulty) {
      case 'master':
        return `Analyzing with ${sources.join(', ')}...`;
      case 'intermediate':
        return `Calculating with ${sources.join(', ')}...`;
      case 'novice':
        return `Thinking with ${sources.join(', ')}...`;
      default:
        return `Thinking with ${sources.join(', ')}...`;
    }
  }

  public getAISources(): string[] {
    const sources = [];
    if (this.useGemini && !this.quotaExceeded) sources.push('Gemini 2.5 Flash');
    if (this.quotaExceeded) sources.push('Gemini 2.5 Flash (Quota Exceeded)');
    sources.push('Custom Algorithm');
    return sources;
  }
} 