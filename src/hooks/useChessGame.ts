"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { ChessAI } from '../lib/chess-ai';
import type { ChessGameState, PlayerColor, AIDifficulty, GameMove } from '../types/chess';

export const useChessGame = () => {
  const [gameState, setGameState] = useState<ChessGameState>({
    game: new Chess(),
    gamePosition: new Chess().fen(),
    playerColor: 'white',
    aiDifficulty: 'normal',
    gameStatus: 'setup',
    moveHistory: [],
    gameResult: null,
    thinking: false,
  });

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    try {
      const gameCopy = new Chess(gameState.game.fen());
      const move = gameCopy.move({ from, to, promotion: promotion || 'q' });

      if (move) {
        const newMove: GameMove = {
          move,
          fen: gameCopy.fen(),
          player: 'Player',
          timestamp: Date.now(),
        };

        setGameState(prev => ({
          ...prev,
          game: gameCopy,
          gamePosition: gameCopy.fen(),
          moveHistory: [...prev.moveHistory, newMove],
        }));

        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  }, [gameState.game]);

  const makeAIMove = useCallback(async () => {
    if (gameState.game.turn() === gameState.playerColor[0] || gameState.game.isGameOver()) {
      return;
    }

    setGameState(prev => ({ ...prev, thinking: true }));
    
    // Create chessAI instance inside the callback
    const chessAI = new ChessAI();
    
    // Add realistic thinking delay
    await new Promise(resolve => setTimeout(resolve, 
      gameState.aiDifficulty === 'hard' ? 1500 : 
      gameState.aiDifficulty === 'normal' ? 1000 : 500
    ));

    const aiMove = chessAI.getBestMove(gameState.game, gameState.aiDifficulty);
    
    if (aiMove) {
      const gameCopy = new Chess(gameState.game.fen());
      gameCopy.move(aiMove);
      
      const newMove: GameMove = {
        move: aiMove,
        fen: gameCopy.fen(),
        player: 'AI',
        timestamp: Date.now(),
      };

      setGameState(prev => ({
        ...prev,
        game: gameCopy,
        gamePosition: gameCopy.fen(),
        moveHistory: [...prev.moveHistory, newMove],
        thinking: false,
      }));
    } else {
      setGameState(prev => ({ ...prev, thinking: false }));
    }
  }, [gameState.game, gameState.playerColor, gameState.aiDifficulty]);

  const startNewGame = useCallback((color: PlayerColor, difficulty: AIDifficulty) => {
    const newGame = new Chess();
    let selectedColor = color;
    
    if (color === 'random') {
      selectedColor = Math.random() < 0.5 ? 'white' : 'black';
    }

    setGameState({
      game: newGame,
      gamePosition: newGame.fen(),
      playerColor: selectedColor,
      aiDifficulty: difficulty,
      gameStatus: 'playing',
      moveHistory: [],
      gameResult: null,
      thinking: false,
    });
  }, []);

  const undoMove = useCallback(() => {
    if (gameState.moveHistory.length < 2) return;
    
    const newGame = new Chess();
    const newHistory = gameState.moveHistory.slice(0, -2);
    
    newHistory.forEach(historyMove => {
      newGame.move(historyMove.move);
    });

    setGameState(prev => ({
      ...prev,
      game: newGame,
      gamePosition: newGame.fen(),
      moveHistory: newHistory,
    }));
  }, [gameState.moveHistory]);

  // Check for game end
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const game = gameState.game;
      
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        setGameState(prev => ({
          ...prev,
          gameResult: { type: 'checkmate', winner },
          gameStatus: 'finished',
        }));
      } else if (game.isDraw()) {
        let drawType: 'stalemate' | 'draw' | 'insufficient' | 'repetition' = 'draw';
        
        if (game.isStalemate()) drawType = 'stalemate';
        else if (game.isInsufficientMaterial()) drawType = 'insufficient';
        else if (game.isThreefoldRepetition()) drawType = 'repetition';
        
        setGameState(prev => ({
          ...prev,
          gameResult: { type: drawType },
          gameStatus: 'finished',
        }));
      }
    }
  }, [gameState.game, gameState.gameStatus]);

  // Handle AI moves
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !gameState.game.isGameOver()) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.game, makeAIMove]);

  return {
    gameState,
    makeMove,
    startNewGame,
    undoMove,
    setPlayerColor: (color: PlayerColor) => 
      setGameState(prev => ({ ...prev, playerColor: color })),
    setAIDifficulty: (difficulty: AIDifficulty) => 
      setGameState(prev => ({ ...prev, aiDifficulty: difficulty })),
  };
};