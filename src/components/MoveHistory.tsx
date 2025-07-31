"use client";

import React from 'react';
import { History, X, User, Bot, Clock, Zap, Target } from 'lucide-react';
import type { GameMove } from '../types/chess';

interface MoveHistoryProps {
  moveHistory: GameMove[];
  onClose: () => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moveHistory, onClose }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 w-full lg:w-[400px] md:w-[500px] max-h-[80vh] md:max-h-[85vh] overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-xl md:rounded-2xl border border-blue-400/30 shadow-xl">
            <History className="w-6 h-6 md:w-8 md:h-8 text-blue-400 drop-shadow-lg" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">Move History</h3>
        </div>
        <button
          onClick={onClose}
          className="group p-2 md:p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl md:rounded-2xl transition-all duration-300 border border-white/20 hover:border-red-400/50"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
      
      {/* Enhanced Move List */}
      <div className="space-y-3 md:space-y-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 md:pr-3 custom-scrollbar">
        {moveHistory.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">♟️</div>
            <p className="text-white/60 text-base md:text-lg mb-2">No moves yet</p>
            <p className="text-white/40 text-sm md:text-base">Make your first move to see the history</p>
          </div>
        ) : (
          moveHistory.map((historyMove, index) => (
            <div
              key={index}
              className={`group p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-500 hover:scale-105 ${
                historyMove.player === 'Player' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:border-blue-400/60' 
                  : 'bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-400/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all duration-300 ${
                    historyMove.player === 'Player' 
                      ? 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-400/40 group-hover:border-blue-400/60' 
                      : 'bg-gradient-to-br from-red-400/20 to-pink-500/20 border-red-400/40 group-hover:border-red-400/60'
                  }`}>
                    {historyMove.player === 'Player' ? (
                      <User className="w-4 h-4 md:w-5 md:h-5 text-blue-300 drop-shadow-lg" />
                    ) : (
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-red-300 drop-shadow-lg" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white text-base md:text-lg">{historyMove.player}</span>
                    <span className="text-white/60 text-xs md:text-sm ml-2 md:ml-3 font-mono">#{Math.floor(index / 2) + 1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-white/40 text-xs md:text-sm">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  {formatTime(historyMove.timestamp)}
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="text-white/90 font-mono text-base md:text-lg font-bold">
                  {historyMove.move.from} → {historyMove.move.to}
                </div>
                
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {historyMove.move.captured && (
                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 text-xs md:text-sm rounded-full border border-red-500/30 font-medium">
                      Capture
                    </span>
                  )}
                  {historyMove.move.promotion && (
                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 text-xs md:text-sm rounded-full border border-purple-500/30 font-medium">
                      Promotion
                    </span>
                  )}
                  {historyMove.move.flags.includes('k') && (
                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs md:text-sm rounded-full border border-yellow-500/30 font-medium">
                      Kingside Castle
                    </span>
                  )}
                  {historyMove.move.flags.includes('q') && (
                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs md:text-sm rounded-full border border-yellow-500/30 font-medium">
                      Queenside Castle
                    </span>
                  )}
                  {historyMove.timeUsed && (
                    <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs md:text-sm rounded-full border border-cyan-500/30 font-medium">
                      {historyMove.timeUsed}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Enhanced Footer */}
      {moveHistory.length > 0 && (
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
          <div className="flex justify-between items-center text-white/60 text-sm md:text-base font-medium">
            <span>Total Moves: <span className="text-white font-bold">{moveHistory.length}</span></span>
            <span>Game Progress: <span className="text-white font-bold">{Math.round((moveHistory.length / 2) * 100)}%</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
