"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { 
  RotateCcw, 
  Settings, 
  Crown, 
  AlertCircle, 
  History,
  Home,
  Brain,
  User,
  Bot,
  ArrowLeft,
  Trophy,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import type { Move, GameMove, GameResult as GameResultType, PlayerColor, AIDifficulty, SquareStyles } from '../types/chess';
import IntroPage from './IntroPage';
import GameSettings from './GameSettings';
import GameResult from './GameResult';
import MoveHistory from './MoveHistory';

type GamePage = 'intro' | 'setup' | 'game';

const ChessGame = () => {
  // Game state
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('normal');
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultType | null>(null);
  const [thinking, setThinking] = useState(false);
  const [currentPage, setCurrentPage] = useState<GamePage>('intro');
  
  // Highlight states
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  // Simple evaluation function for AI
  const evaluatePosition = useCallback((game: Chess): number => {
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
    
    // Add bonus for checkmate
    if (game.isCheckmate()) {
      evaluation += game.turn() === 'w' ? 1000 : -1000;
    }
    
    return evaluation;
  }, []);

  // Minimax algorithm implementation
  const minimaxMove = useCallback((gameInstance: Chess, depth: number, useAlphaBeta = false): Move | null => {
    const minimax = (game: Chess, depth: number, isMaximizing: boolean, alpha = -Infinity, beta = Infinity): number => {
      if (depth === 0 || game.isGameOver()) {
        return evaluatePosition(game);
      }

      const moves = game.moves({ verbose: true });
      let bestValue = isMaximizing ? -Infinity : Infinity;

      for (const move of moves) {
        game.move(move);
        const value = minimax(game, depth - 1, !isMaximizing, alpha, beta);
        game.undo();

        if (isMaximizing) {
          bestValue = Math.max(bestValue, value);
          if (useAlphaBeta) {
            alpha = Math.max(alpha, value);
            if (beta <= alpha) break; // Alpha-beta pruning
          }
        } else {
          bestValue = Math.min(bestValue, value);
          if (useAlphaBeta) {
            beta = Math.min(beta, value);
            if (beta <= alpha) break; // Alpha-beta pruning
          }
        }
      }

      return bestValue;
    };

    const moves = gameInstance.moves({ verbose: true });
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
  }, [evaluatePosition]);

  // AI Move calculation with different difficulty levels
  const calculateAIMove = useCallback((gameInstance: Chess, difficulty: AIDifficulty): Move | null => {
    const possibleMoves = gameInstance.moves({ verbose: true });
    
    if (possibleMoves.length === 0) return null;

    switch (difficulty) {
      case 'easy':
        // Random move
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      case 'normal':
        // Simple minimax 2-3 moves deep
        return minimaxMove(gameInstance, 2);
      
      case 'hard':
        // Minimax with alpha-beta pruning, deeper search
        return minimaxMove(gameInstance, 4, true);
      
      default:
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }, [minimaxMove]);

  // Make AI move
  const makeAIMove = useCallback(async () => {
    if (game.turn() === playerColor[0] || game.isGameOver()) return;

    setThinking(true);
    
    // Add delay to make AI thinking visible
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const aiMove = calculateAIMove(game, aiDifficulty);
    
    if (aiMove) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(aiMove);
      
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, {
        move: aiMove,
        fen: gameCopy.fen(),
        player: 'AI',
        timestamp: Date.now()
      }]);
      
      // Highlight AI move
      setMoveFrom(aiMove.from);
      setMoveTo(aiMove.to);
    }
    
    setThinking(false);
  }, [game, playerColor, aiDifficulty, calculateAIMove]);

  // Handle piece drop
  const onDrop = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    // Check if it's player's turn
    if (game.turn() !== playerColor[0]) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move) {
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(prev => [...prev, {
          move,
          fen: gameCopy.fen(),
          player: 'Player',
          timestamp: Date.now()
        }]);
        
        // Highlight player move
        setMoveFrom(sourceSquare);
        setMoveTo(targetSquare);
        
        // Clear option squares
        setOptionSquares({});
        
        return true;
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
    
    return false;
  }, [game, playerColor]);

  // Handle square click for move highlighting
  const onSquareClick = useCallback((square: string) => {
    // Clear right-clicked squares
    setRightClickedSquares({});

    // If it's not player's turn, don't allow interaction
    if (game.turn() !== playerColor[0]) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const piece = game.get(square as any);
    
    if (!moveFrom) {
      // First click - select piece
      if (piece && piece.color === playerColor[0]) {
        setMoveFrom(square);
        
        // Show possible moves
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const moves = game.moves({ square: square as any, verbose: true });
        const newSquares: SquareStyles = {};
        moves.forEach((move: Move) => {
          newSquares[move.to] = {
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 36%, transparent 40%)',
            borderRadius: '50%'
          };
        });
        setOptionSquares(newSquares);
      }
    } else {
      // Second click - attempt move
      if (moveFrom === square) {
        // Clicking same square - deselect
        setMoveFrom('');
        setOptionSquares({});
      } else {
        // Attempt to make move
        onDrop(moveFrom, square);
        setMoveFrom('');
        setOptionSquares({});
      }
    }
  }, [game, playerColor, moveFrom, onDrop]);

  // Handle right click for square marking
  const onSquareRightClick = useCallback((square: string) => {
    setRightClickedSquares(prev => {
      const newSquares = { ...prev };
      if (square in newSquares) {
        delete newSquares[square];
      } else {
        newSquares[square] = { backgroundColor: 'rgba(239, 68, 68, 0.4)' };
      }
      return newSquares;
    });
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    const newGame = new Chess();
    let selectedColor = playerColor;
    
    // Handle random color selection
    if (playerColor === 'random') {
      selectedColor = Math.random() < 0.5 ? 'white' : 'black';
      setPlayerColor(selectedColor);
    }
    
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setGameStatus('playing');
    setGameResult(null);
    setMoveFrom('');
    setMoveTo('');
    setOptionSquares({});
    setRightClickedSquares({});
    setCurrentPage('game');
  }, [playerColor]);

  // Undo last move
  const undoMove = useCallback(() => {
    if (moveHistory.length < 2) return;
    
    const gameCopy = new Chess();
    const newHistory = moveHistory.slice(0, -2); // Remove last 2 moves (player + AI)
    
    // Replay moves
    newHistory.forEach(historyMove => {
      gameCopy.move(historyMove.move);
    });
    
    setGame(gameCopy);
    setGamePosition(gameCopy.fen());
    setMoveHistory(newHistory);
    setMoveFrom('');
    setMoveTo('');
    setOptionSquares({});
  }, [moveHistory]);

  // Check game status
  useEffect(() => {
    if (gameStatus === 'playing') {
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        setGameResult({ type: 'checkmate', winner });
      } else if (game.isDraw()) {
        if (game.isStalemate()) {
          setGameResult({ type: 'stalemate' });
        } else if (game.isInsufficientMaterial()) {
          setGameResult({ type: 'insufficient' });
        } else if (game.isThreefoldRepetition()) {
          setGameResult({ type: 'repetition' });
        } else {
          setGameResult({ type: 'draw' });
        }
      }
    }
  }, [game, gameStatus]);

  // Handle AI moves
  useEffect(() => {
    if (gameStatus === 'playing' && !game.isGameOver()) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [gameStatus, game, makeAIMove]);

  // Custom square styles
  const customSquareStyles = useMemo((): SquareStyles => {
    const styles: SquareStyles = {};
    
    // Highlight last move
    if (moveFrom) {
      styles[moveFrom] = { backgroundColor: 'rgba(59, 130, 246, 0.6)' };
    }
    if (moveTo) {
      styles[moveTo] = { backgroundColor: 'rgba(59, 130, 246, 0.6)' };
    }
    
    // Add option squares
    Object.keys(optionSquares).forEach(square => {
      styles[square] = optionSquares[square];
    });
    
    // Add right-clicked squares
    Object.keys(rightClickedSquares).forEach(square => {
      styles[square] = rightClickedSquares[square];
    });
    
    // Highlight check
    if (game.inCheck()) {
      const board = game.board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type === 'k' && piece.color === game.turn()) {
            const square = String.fromCharCode(97 + j) + (8 - i);
            styles[square] = { backgroundColor: 'rgba(239, 68, 68, 0.8)' };
            break;
          }
        }
      }
    }
    
    return styles;
  }, [moveFrom, moveTo, optionSquares, rightClickedSquares, game]);

  // Navigation handlers
  const handleStartGame = () => setCurrentPage('setup');
  const handleBackToHome = () => setCurrentPage('intro');
  const handleGoHome = () => {
    setCurrentPage('intro');
    setGameResult(null);
  };

  // Render different pages
  if (currentPage === 'intro') {
    return <IntroPage onStartGame={handleStartGame} />;
  }

  if (currentPage === 'setup') {
    return (
      <GameSettings
        playerColor={playerColor}
        aiDifficulty={aiDifficulty}
        onColorChange={setPlayerColor}
        onDifficultyChange={setAiDifficulty}
        onStartGame={startNewGame}
        onBack={handleBackToHome}
      />
    );
  }

  // Game page
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 p-6 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 group bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20 hover:border-blue-400/50"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg font-medium">Back to Home</span>
            </button>
            
            <h1 className="text-5xl md:text-7xl font-black text-white bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
              Chess Master
            </h1>
            
            <div className="w-48"></div> {/* Spacer for centering */}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Enhanced Game Board */}
          <div className="flex-1 max-w-3xl">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20">
              {/* Enhanced Game Status Bar */}
              {gameStatus === 'playing' && (
                <div className="mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                    {/* Enhanced Player Info */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                          <User className="w-6 h-6 text-blue-400 drop-shadow-lg" />
                        </div>
                        <span className="font-bold text-xl">You</span>
                      </div>
                      <div className="text-3xl font-black capitalize bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">{playerColor}</div>
                    </div>

                    {/* Enhanced Turn Indicator */}
                    <div className={`rounded-3xl p-6 border transition-all duration-300 ${
                      game.turn() === playerColor[0] 
                        ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400/50' 
                        : 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-400/50'
                    }`}>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        {game.turn() === playerColor[0] ? (
                          <>
                            <div className="p-3 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl border border-emerald-400/30">
                              <Crown className="w-6 h-6 text-emerald-400 drop-shadow-lg" />
                            </div>
                            <span className="font-bold text-xl text-emerald-200">Your Turn</span>
                          </>
                        ) : thinking ? (
                          <>
                            <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                            <span className="font-bold text-xl text-yellow-200">AI Thinking...</span>
                          </>
                        ) : (
                          <>
                            <div className="p-3 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-2xl border border-orange-400/30">
                              <Bot className="w-6 h-6 text-orange-400 drop-shadow-lg" />
                            </div>
                            <span className="font-bold text-xl text-orange-200">AI Turn</span>
                          </>
                        )}
                      </div>
                      
                      {game.inCheck() && (
                        <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 px-4 py-2 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold border border-red-400/50">
                          <AlertCircle className="w-5 h-5 text-red-300" />
                          Check!
                        </div>
                      )}
                    </div>

                    {/* Enhanced AI Info */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                          <Brain className="w-6 h-6 text-purple-400 drop-shadow-lg" />
                        </div>
                        <span className="font-bold text-xl">AI Level</span>
                      </div>
                      <div className="text-3xl font-black capitalize bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">{aiDifficulty}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Chessboard */}
              <div className="relative mb-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <Chessboard
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    onSquareRightClick={onSquareRightClick}
                    boardOrientation={playerColor === 'black' ? 'black' : 'white'}
                    customSquareStyles={customSquareStyles}
                    boardWidth={Math.min(700, window.innerWidth - 200)}
                    animationDuration={200}
                  />
                </div>
              </div>

              {/* Enhanced Game Controls */}
              {gameStatus === 'playing' && (
                <div className="flex flex-wrap gap-6 justify-center">
                  <button
                    onClick={undoMove}
                    disabled={moveHistory.length < 2}
                    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white px-8 py-4 rounded-3xl hover:bg-white/20 transition-all duration-300 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-blue-400/50 font-bold text-lg"
                  >
                    <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                    Undo
                  </button>
                  
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white px-8 py-4 rounded-3xl hover:bg-white/20 transition-all duration-300 flex items-center gap-4 border border-white/20 hover:border-blue-400/50 font-bold text-lg"
                  >
                    <History className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    History
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage('setup')}
                    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white px-8 py-4 rounded-3xl hover:bg-white/20 transition-all duration-300 flex items-center gap-4 border border-white/20 hover:border-blue-400/50 font-bold text-lg"
                  >
                    <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Move History Panel */}
          {showHistory && gameStatus === 'playing' && (
            <MoveHistory
              moveHistory={moveHistory}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>

        {/* Game Result Modal */}
        {gameResult && (
          <GameResult
            result={gameResult}
            onNewGame={startNewGame}
            onContinue={() => setGameResult(null)}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </div>
  );
};

export default ChessGame;