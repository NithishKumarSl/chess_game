"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { EnhancedChessAI } from '../lib/enhanced-chess-ai';
import { 
  RotateCcw, 
  Settings, 
  Crown, 
  AlertCircle, 
  History,
  Brain,
  User,
  Bot,
  ArrowLeft,
  Clock,
  Trophy,
  Zap
} from 'lucide-react';

// Types
interface Move {
  from: string;
  to: string;
  promotion?: string;
  flags?: string;
  piece?: string;
  captured?: string;
  san?: string;
}

interface GameMove {
  move: Move;
  fen: string;
  player: 'Player' | 'AI';
  timestamp: number;
  timeUsed: number;
}

interface GameResult {
  type: 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'insufficient' | 'repetition';
  winner?: 'Player' | 'AI' | 'White' | 'Black';
  reason?: string;
}

type PlayerColor = 'white' | 'black' | 'random';
type AIDifficulty = 'novice' | 'intermediate' | 'master';

interface SquareStyles {
  [square: string]: React.CSSProperties;
}

interface TimeControl {
  type: 'unlimited' | 'rapid' | 'blitz' | 'classical' | 'custom';
  initialTime?: number;
  increment?: number;
  customTime?: number;
}

interface PlayerTime {
  remaining: number;
  lastMoveTime?: number;
}

interface ChessGameProps {
  playerColor: PlayerColor;
  aiDifficulty: AIDifficulty;
  timeControl: TimeControl;
  onBack: () => void;
  onSettings: () => void;
}

// Game Result Component
const GameResult: React.FC<{
  result: GameResult;
  onNewGame: () => void;
  onContinue: () => void;
  onGoHome: () => void;
}> = ({ result, onNewGame, onContinue, onGoHome }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-black">
      <div className="mb-6">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-3xl font-bold text-black mb-2">Game Over</h2>
        <p className="text-lg text-gray-700">
          {result.type === 'checkmate' && `Checkmate! ${result.winner} wins!`}
          {result.type === 'stalemate' && 'Stalemate - Draw'}
          {result.type === 'draw' && 'Draw'}
          {result.type === 'timeout' && `${result.winner} wins by timeout!`}
          {result.type === 'insufficient' && 'Draw - Insufficient material'}
          {result.type === 'repetition' && 'Draw - Threefold repetition'}
        </p>
        {result.reason && <p className="text-sm text-gray-600 mt-2">{result.reason}</p>}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onNewGame}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
        >
          New Game
        </button>
        <button
          onClick={onGoHome}
          className="bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Move History Component
const MoveHistory: React.FC<{
  moveHistory: GameMove[];
  onClose: () => void;
}> = ({ moveHistory, onClose }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-black max-h-96 overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-black">Move History</h3>
      <button onClick={onClose} className="text-black hover:text-gray-600">✕</button>
    </div>
    <div className="space-y-2">
      {moveHistory.map((move, index) => (
        <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
          <span className="font-semibold text-black">{Math.floor(index / 2) + 1}.</span>
          <span className="text-black">{move.move.san}</span>
          <span className="text-sm text-gray-600">{move.player}</span>
          <span className="text-xs text-gray-500">{move.timeUsed}ms</span>
        </div>
      ))}
    </div>
  </div>
);

const ChessGame: React.FC<ChessGameProps> = ({
  playerColor,
  aiDifficulty,
  timeControl,
  onBack,
  onSettings
}) => {
  // Game state
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [playerTime, setPlayerTime] = useState<PlayerTime>({ remaining: 0 });
  const [aiTime, setAiTime] = useState<PlayerTime>({ remaining: 0 });
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'finished'>('playing');
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [thinking, setThinking] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  
  // Highlight states
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  // Time control functions
  const formatTimeDisplay = (milliseconds: number) => {
    if (milliseconds <= 0) return '0:00';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const initializeTimeControl = useCallback((timeControl: TimeControl) => {
    if (timeControl.type === 'unlimited') {
      setPlayerTime({ remaining: Infinity });
      setAiTime({ remaining: Infinity });
    } else {
      const initialTime = timeControl.initialTime || 0;
      setPlayerTime({ remaining: initialTime });
      setAiTime({ remaining: initialTime });
    }
  }, []);

  const updatePlayerTime = useCallback((moveTime: number) => {
    if (timeControl.type !== 'unlimited') {
      setPlayerTime(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - moveTime),
        lastMoveTime: moveTime
      }));
    }
  }, [timeControl.type]);

  const updateAiTime = useCallback((moveTime: number) => {
    if (timeControl.type !== 'unlimited') {
      setAiTime(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - moveTime),
        lastMoveTime: moveTime
      }));
    }
  }, [timeControl.type]);

  // Check for timeout
  useEffect(() => {
    if (gameStatus === 'playing' && timeControl.type !== 'unlimited') {
      if (playerTime.remaining <= 0) {
        setGameResult({ type: 'timeout', winner: 'AI', reason: 'Player ran out of time' });
      } else if (aiTime.remaining <= 0) {
        setGameResult({ type: 'timeout', winner: 'Player', reason: 'AI ran out of time' });
      }
    }
  }, [playerTime.remaining, aiTime.remaining, gameStatus, timeControl.type]);

  // Enhanced AI Engine instance
  const aiEngine = useMemo(() => new EnhancedChessAI(aiDifficulty), [aiDifficulty]);



  // Make AI move
  const makeAIMove = useCallback(async () => {
    // Check if it's AI's turn (opposite of player's color)
    const isAITurn = game.turn() !== playerColor[0];
    if (!isAITurn || game.isGameOver()) return;

    setThinking(true);
    const startTime = Date.now();
    
    // Use AI engine to get move
    const aiMove = await aiEngine.getMove(game);
    
    if (aiMove) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(aiMove);
      
      const moveTime = Date.now() - startTime;
      updateAiTime(moveTime);
      
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, {
        move: aiMove,
        fen: gameCopy.fen(),
        player: 'AI',
        timestamp: Date.now(),
        timeUsed: moveTime
      }]);
      
      setMoveFrom(aiMove.from);
      setMoveTo(aiMove.to);
      setIsPlayerTurn(true);
    }
    
    setThinking(false);
  }, [game, playerColor, aiEngine, updateAiTime]);

  // Handle piece drop
  const onDrop = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    // Check if it's player's turn
    if (game.turn() !== playerColor[0]) return false;

    try {
      const startTime = Date.now();
      const gameCopy = new Chess(game.fen());
      
      // Get all valid moves for the source square
      const validMoves = gameCopy.moves({ square: sourceSquare as Square, verbose: true });
      const isValidMove = validMoves.some(move => move.to === targetSquare);
      
      if (!isValidMove) return false;
      
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        const moveTime = Date.now() - startTime;
        updatePlayerTime(moveTime);
        
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(prev => [...prev, {
          move,
          fen: gameCopy.fen(),
          player: 'Player',
          timestamp: Date.now(),
          timeUsed: moveTime
        }]);
        
        setMoveFrom(sourceSquare);
        setMoveTo(targetSquare);
        setOptionSquares({});
        // Turn will automatically switch to AI after this move
        
        return true;
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
    
    return false;
  }, [game, playerColor, updatePlayerTime]);

  // Handle square click for move highlighting
  const onSquareClick = useCallback((square: string) => {
    setRightClickedSquares({});

    // Only allow clicks during player's turn
    if (game.turn() !== playerColor[0]) return;

    const piece = game.get(square as Square);
    
    if (!moveFrom) {
      if (piece && piece.color === playerColor[0]) {
        setMoveFrom(square);
        
        const moves = game.moves({ square: square as Square, verbose: true });
        const newSquares: SquareStyles = {};
        moves.forEach((move: Move) => {
          newSquares[move.to] = {
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 36%, transparent 40%)',
            borderRadius: '50%'
          };
        });
        setOptionSquares(newSquares);
      }
    } else {
      if (moveFrom === square) {
        setMoveFrom('');
        setOptionSquares({});
      } else {
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
        newSquares[square] = { backgroundColor: 'rgba(255, 0, 0, 0.4)' };
      }
      return newSquares;
    });
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setGameStatus('playing');
    setGameResult(null);
    setMoveFrom('');
    setMoveTo('');
    setOptionSquares({});
    setRightClickedSquares({});
    
    initializeTimeControl(timeControl);
    // Set player turn based on color - if player is black, AI goes first
    setIsPlayerTurn(playerColor === 'white');
  }, [playerColor, timeControl, initializeTimeControl]);

  // Undo last move
  const undoMove = useCallback(() => {
    if (moveHistory.length < 2) return;
    
    const gameCopy = new Chess();
    const newHistory = moveHistory.slice(0, -2);
    
    newHistory.forEach(historyMove => {
      gameCopy.move(historyMove.move);
    });
    
    setGame(gameCopy);
    setGamePosition(gameCopy.fen());
    setMoveHistory(newHistory);
    setMoveFrom('');
    setMoveTo('');
    setOptionSquares({});
    
    initializeTimeControl(timeControl);
  }, [moveHistory, timeControl, initializeTimeControl]);

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
    // Check if it's AI's turn and game is active
    const isAITurn = game.turn() !== playerColor[0];
    if (gameStatus === 'playing' && !game.isGameOver() && isAITurn) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [gameStatus, game, playerColor, makeAIMove]);

  // Initialize time control on mount
  useEffect(() => {
    initializeTimeControl(timeControl);
  }, [timeControl, initializeTimeControl]);

  // Custom square styles
  const customSquareStyles = useMemo((): SquareStyles => {
    const styles: SquareStyles = {};
    
    if (moveFrom) {
      styles[moveFrom] = { backgroundColor: 'rgba(255, 255, 0, 0.6)' };
    }
    if (moveTo) {
      styles[moveTo] = { backgroundColor: 'rgba(255, 255, 0, 0.6)' };
    }
    
    Object.keys(optionSquares).forEach(square => {
      styles[square] = optionSquares[square];
    });
    
    Object.keys(rightClickedSquares).forEach(square => {
      styles[square] = rightClickedSquares[square];
    });
    
    if (game.inCheck()) {
      const board = game.board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type === 'k' && piece.color === game.turn()) {
            const square = String.fromCharCode(97 + j) + (8 - i);
            styles[square] = { backgroundColor: 'rgba(255, 0, 0, 0.8)' };
            break;
          }
        }
      }
    }
    
    return styles;
  }, [moveFrom, moveTo, optionSquares, rightClickedSquares, game]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Chess Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(
            #000 0deg 90deg,
            #fff 90deg 180deg,
            #000 180deg 270deg,
            #fff 270deg 360deg
          )`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Lightning Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-white to-transparent animate-pulse opacity-30 delay-1000"></div>
        <div className="absolute left-1/4 top-0 w-px h-1/2 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse opacity-30 delay-500"></div>
        <div className="absolute right-1/4 bottom-0 w-px h-1/2 bg-gradient-to-t from-transparent via-white to-transparent animate-pulse opacity-30 delay-1500"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Compact Header */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Back</span>
            </button>
            
            <h1 className="text-2xl lg:text-3xl font-black text-white">
              Chess Master
            </h1>
            
            <button
              onClick={onSettings}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20"
            >
              <Settings className="w-4 h-4" />
              <span className="font-semibold">Settings</span>
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Sidebar - Player Info */}
              <div className="lg:col-span-3 space-y-4">
                {/* Player Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg border border-black/20">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">You</h3>
                      <p className="text-sm text-gray-300 capitalize">
                        {playerColor === 'white' ? 'White' : 'Black'}
                      </p>
                    </div>
                  </div>
                  {timeControl.type !== 'unlimited' && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className={`font-mono font-bold ${
                          playerTime.remaining < 30000 ? 'text-red-600' : 
                          playerTime.remaining < 60000 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatTimeDisplay(playerTime.remaining)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg border border-black/20">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI</h3>
                      <p className="text-sm text-gray-300 capitalize">
                        {playerColor === 'white' ? 'Black' : 'White'} • {aiDifficulty}
                      </p>
                    </div>
                  </div>
                  {timeControl.type !== 'unlimited' && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className={`font-mono font-bold ${
                          aiTime.remaining < 30000 ? 'text-red-600' : 
                          aiTime.remaining < 60000 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatTimeDisplay(aiTime.remaining)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Status */}
                <div className={`rounded-xl p-4 border-2 transition-all ${
                  game.turn() === playerColor[0] 
                    ? 'bg-green-50 border-green-500' 
                    : thinking 
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-orange-50 border-orange-500'
                }`}>
                  <div className="flex items-center gap-3">
                    {game.turn() === playerColor[0] ? (
                      <>
                        <Crown className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-bold text-green-800">Your Turn</span>
                          <p className="text-xs text-green-600">Make your move</p>
                        </div>
                      </>
                    ) : thinking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                        <div>
                          <span className="font-bold text-yellow-800">AI Thinking...</span>
                          <p className="text-xs text-yellow-600">
                            {aiEngine.getThinkingMessage()}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {aiEngine.getAISources().map((source, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5 text-orange-600" />
                        <div>
                          <span className="font-bold text-orange-800">AI Turn</span>
                          <p className="text-xs text-orange-600">Waiting for AI move</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {game.inCheck() && (
                    <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-red-800">Check!</span>
                    </div>
                  )}
                  
                  {/* Game phase indicator */}
                  <div className="mt-3 text-xs text-gray-600">
                    {moveHistory.length < 6 ? 'Opening' : 
                     moveHistory.length < 20 ? 'Middlegame' : 'Endgame'}
                  </div>
                </div>
              </div>

              {/* Center - Chess Board */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
                  <div className="rounded-xl overflow-hidden border border-white/30 bg-white/5">
                    <Chessboard
                      position={gamePosition}
                      onPieceDrop={onDrop}
                      onSquareClick={onSquareClick}
                      onSquareRightClick={onSquareRightClick}
                      boardOrientation={playerColor === 'black' ? 'black' : 'white'}
                      customSquareStyles={customSquareStyles}
                      boardWidth={Math.min(500, window.innerWidth - 100)}
                      animationDuration={200}
                    />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Controls & History */}
              <div className="lg:col-span-3 space-y-4">
                {/* Game Controls */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                                      <h3 className="font-bold text-white mb-4">Game Controls</h3>
                  <div className="space-y-3">
                                          <button
                        onClick={undoMove}
                        disabled={moveHistory.length < 2}
                        className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Undo Move
                      </button>
                      
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 border border-white/20"
                      >
                        <History className="w-4 h-4" />
                        {showHistory ? 'Hide' : 'Show'} History
                      </button>
                  </div>
                </div>

                {/* Move History */}
                {showHistory && (
                  <MoveHistory
                    moveHistory={moveHistory}
                    onClose={() => setShowHistory(false)}
                  />
                )}

                {/* Game Stats */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                                      <h3 className="font-bold text-white mb-4">Game Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Moves played:</span>
                      <span className="font-bold text-white">{moveHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Game time:</span>
                      <span className="font-bold text-white">
                        {moveHistory.length > 0 
                          ? `${Math.floor((Date.now() - moveHistory[0].timestamp) / 60000)}m` 
                          : '0m'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Time control:</span>
                      <span className="font-bold text-white capitalize">{timeControl.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Controls */}
        <div className="lg:hidden bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-3">
          <div className="flex gap-3 justify-center">
            <button
              onClick={undoMove}
              disabled={moveHistory.length < 2}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 border border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
              Undo
            </button>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-white/20"
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Game Result Modal */}
      {gameResult && (
        <GameResult
          result={gameResult}
          onNewGame={startNewGame}
          onContinue={() => setGameResult(null)}
          onGoHome={onBack}
        />
      )}

      {/* Mobile Move History Overlay */}
      {showHistory && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <MoveHistory
            moveHistory={moveHistory}
            onClose={() => setShowHistory(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChessGame;