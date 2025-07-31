"use client";

import React, { useState } from 'react';
import type { PlayerColor, AIDifficulty, TimeControl } from '../types/chess';
import IntroPage from '../components/IntroPage';
import GameSettings from '../components/GameSettings';
import ChessGame from '../components/ChessGame';

type GamePage = 'intro' | 'setup' | 'game';

export default function Home() {
  // Page state
  const [currentPage, setCurrentPage] = useState<GamePage>('intro');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('intermediate');
  const [timeControl, setTimeControl] = useState<TimeControl>({ type: 'unlimited' });

  // Navigation handlers
  const handleStartGame = () => setCurrentPage('setup');
  const handleBackToHome = () => setCurrentPage('intro');
  const handleGoHome = () => {
    setCurrentPage('intro');
  };

  // Start new game
  const startNewGame = () => {
    let selectedColor = playerColor;
    
    // Handle random color selection
    if (playerColor === 'random') {
      selectedColor = Math.random() < 0.5 ? 'white' : 'black';
      setPlayerColor(selectedColor);
    }
    
    setCurrentPage('game');
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
        timeControl={timeControl}
        onColorChange={setPlayerColor}
        onDifficultyChange={setAiDifficulty}
        onTimeControlChange={setTimeControl}
        onStartGame={startNewGame}
        onBack={handleBackToHome}
      />
    );
  }

  // Game page - render ChessGame component
  return (
    <ChessGame
      playerColor={playerColor}
      aiDifficulty={aiDifficulty}
      timeControl={timeControl}
      onBack={handleBackToHome}
      onSettings={() => setCurrentPage('setup')}
    />
  );
}