import { Chess } from 'chess.js';

export interface Move {
  from: string;
  to: string;
  promotion?: string;
  flags?: string;
  piece?: string;
  captured?: string;
  san?: string;
}

export type AIDifficulty = 'novice' | 'intermediate' | 'master';

// Enhanced evaluation function for AI
export const evaluatePosition = (game: Chess): number => {
  const pieceValues: { [key: string]: number } = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
    P: -1, N: -3, B: -3, R: -5, Q: -9, K: 0
  };
  
  // Position bonuses for pieces
  const pawnPositions = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  
  const knightPositions = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ];
  
  const bishopPositions = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ];
  
  const rookPositions = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ];
  
  const queenPositions = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ];
  
  const kingPositions = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ];
  
  let evaluation = 0;
  const board = game.board();
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const baseValue = pieceValues[piece.type];
        let positionBonus = 0;
        
        // Add position-based bonuses
        if (piece.type === 'p') {
          positionBonus = piece.color === 'w' ? -pawnPositions[i][j] : pawnPositions[i][j];
        } else if (piece.type === 'n') {
          positionBonus = piece.color === 'w' ? -knightPositions[i][j] : knightPositions[i][j];
        } else if (piece.type === 'b') {
          positionBonus = piece.color === 'w' ? -bishopPositions[i][j] : bishopPositions[i][j];
        } else if (piece.type === 'r') {
          positionBonus = piece.color === 'w' ? -rookPositions[i][j] : rookPositions[i][j];
        } else if (piece.type === 'q') {
          positionBonus = piece.color === 'w' ? -queenPositions[i][j] : queenPositions[i][j];
        } else if (piece.type === 'k') {
          positionBonus = piece.color === 'w' ? -kingPositions[i][j] : kingPositions[i][j];
        }
        
        evaluation += (baseValue * 100 + positionBonus) * (piece.color === 'w' ? -1 : 1);
      }
    }
  }
  
  // Mobility bonus
  const whiteMoves = game.moves({ verbose: true }).length;
  const gameCopy = new Chess(game.fen());
  // Make a dummy move to get opponent's moves
  const dummyMove = gameCopy.moves({ verbose: true })[0];
  if (dummyMove) {
    gameCopy.move(dummyMove);
    const blackMoves = gameCopy.moves({ verbose: true }).length;
    evaluation += (whiteMoves - blackMoves) * 10;
  }
  
  // Checkmate bonus
  if (game.isCheckmate()) {
    evaluation += game.turn() === 'w' ? 10000 : -10000;
  }
  
  // Check bonus
  if (game.inCheck()) {
    evaluation += game.turn() === 'w' ? -50 : 50;
  }
  
  return evaluation;
};

// Enhanced minimax algorithm with move ordering and quiescence search
export const minimaxMove = (gameInstance: Chess, depth: number, useAlphaBeta = false): Move | null => {
  // Move ordering function to improve alpha-beta pruning efficiency
  const orderMoves = (moves: Move[], game: Chess): Move[] => {
    return moves.sort((a, b) => {
      // Prioritize captures, then checks, then other moves
      const aIsCapture = a.captured ? 1 : 0;
      const bIsCapture = b.captured ? 1 : 0;
      
      // Check if moves give check
      game.move(a);
      const aIsCheck = game.inCheck();
      game.undo();
      game.move(b);
      const bIsCheck = game.inCheck();
      game.undo();
      
      if (aIsCapture !== bIsCapture) return bIsCapture - aIsCapture;
      if (aIsCheck !== bIsCheck) return (bIsCheck ? 1 : 0) - (aIsCheck ? 1 : 0);
      return 0;
    });
  };

  const minimax = (game: Chess, depth: number, isMaximizing: boolean, alpha = -Infinity, beta = Infinity): number => {
    if (depth === 0) {
      // Quiescence search for captures
      if (game.isGameOver()) {
        return evaluatePosition(game);
      }
      
      const captures = game.moves({ verbose: true }).filter(move => move.captured);
      if (captures.length > 0) {
        let bestValue = isMaximizing ? -Infinity : Infinity;
        for (const capture of captures) {
          game.move(capture);
          const value = minimax(game, 0, !isMaximizing, alpha, beta);
          game.undo();
          
          if (isMaximizing) {
            bestValue = Math.max(bestValue, value);
          } else {
            bestValue = Math.min(bestValue, value);
          }
        }
        return bestValue;
      }
      
      return evaluatePosition(game);
    }

    if (game.isGameOver()) {
      return evaluatePosition(game);
    }

    const moves = orderMoves(game.moves({ verbose: true }), game);
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      game.move(move);
      const value = minimax(game, depth - 1, !isMaximizing, alpha, beta);
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
  };

  const moves = orderMoves(gameInstance.moves({ verbose: true }), gameInstance);
  let bestMove: Move | null = null;
  let bestValue = -Infinity;

  for (const move of moves) {
    gameInstance.move(move);
    const value = minimax(gameInstance, depth - 1, false);
    gameInstance.undo();

    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
};

// Opening book moves for more realistic play
export const getOpeningMove = (gameInstance: Chess): Move | null => {
  const moveCount = gameInstance.history().length;
  if (moveCount > 6) return null; // Only use openings for first few moves
  
  const commonOpenings = [
    // White openings
    { from: 'e2', to: 'e4' }, // King's Pawn
    { from: 'd2', to: 'd4' }, // Queen's Pawn
    { from: 'c2', to: 'c4' }, // English Opening
    { from: 'g1', to: 'f3' }, // King's Knight
    { from: 'b1', to: 'c3' }, // Queen's Knight
    
    // Black responses
    { from: 'e7', to: 'e5' }, // King's Pawn
    { from: 'd7', to: 'd5' }, // Queen's Pawn
    { from: 'g8', to: 'f6' }, // King's Knight
    { from: 'c7', to: 'c5' }, // Sicilian
    { from: 'e7', to: 'e6' }, // French
  ];
  
  const validMoves = gameInstance.moves({ verbose: true });
  
  // Try to find a matching opening move
  for (const opening of commonOpenings) {
    const matchingMove = validMoves.find(move => 
      move.from === opening.from && move.to === opening.to
    );
    if (matchingMove) {
      return matchingMove;
    }
  }
  
  return null;
};

// AI Move calculation with different difficulty levels
export const calculateAIMove = (gameInstance: Chess, difficulty: AIDifficulty): Move | null => {
  const possibleMoves = gameInstance.moves({ verbose: true });
  
  if (possibleMoves.length === 0) return null;

  switch (difficulty) {
    case 'novice':
      // Beginner: 70% random, 30% basic evaluation
      if (Math.random() < 0.7) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      } else {
        // Simple one-ply lookahead
        let bestMove = possibleMoves[0];
        let bestValue = -Infinity;
        
        for (const move of possibleMoves) {
          gameInstance.move(move);
          const value = evaluatePosition(gameInstance);
          gameInstance.undo();
          
          if (value > bestValue) {
            bestValue = value;
            bestMove = move;
          }
        }
        return bestMove;
      }
      
    case 'intermediate':
      // Intermediate: 40% random, 60% minimax with depth 2
      if (Math.random() < 0.4) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      } else {
        return minimaxMove(gameInstance, 2, false);
      }
      
    case 'master':
      // Master: 10% random, 90% advanced minimax with alpha-beta pruning
      if (Math.random() < 0.1) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      } else {
        return minimaxMove(gameInstance, 4, true);
      }
      
    default:
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
};

// AI Engine class for managing AI moves
export class ChessAI {
  private difficulty: AIDifficulty;
  private thinkingTime: number;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
    this.thinkingTime = this.calculateThinkingTime();
  }

  private calculateThinkingTime(): number {
    switch (this.difficulty) {
      case 'master':
        return 800 + Math.random() * 400; // 800-1200ms
      case 'intermediate':
        return 600 + Math.random() * 300; // 600-900ms
      case 'novice':
        return 400 + Math.random() * 200; // 400-600ms
      default:
        return 500;
    }
  }

  public async getMove(game: Chess): Promise<Move | null> {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, this.thinkingTime));
    
    // Try opening book first
    let aiMove = getOpeningMove(game);
    
    // If no opening move, calculate using AI algorithm
    if (!aiMove) {
      aiMove = calculateAIMove(game, this.difficulty);
    }
    
    return aiMove;
  }

  public getThinkingMessage(): string {
    switch (this.difficulty) {
      case 'master':
        return 'Deep analysis...';
      case 'intermediate':
        return 'Calculating...';
      case 'novice':
        return 'Thinking...';
      default:
        return 'Thinking...';
    }
  }
}