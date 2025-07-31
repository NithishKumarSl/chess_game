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
    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 w-full lg:w-[500px] max-h-[85vh] overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl border border-blue-400/30 shadow-xl">
            <History className="w-8 h-8 text-blue-400 drop-shadow-lg" />
          </div>
          <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">Move History</h3>
        </div>
        <button
          onClick={onClose}
          className="group p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/20 hover:border-red-400/50"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
      
      {/* Enhanced Move List */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
        {moveHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">♟️</div>
            <p className="text-white/60 text-lg mb-2">No moves yet</p>
            <p className="text-white/40 text-sm">Make your first move to see the history</p>
          </div>
        ) : (
          moveHistory.map((historyMove, index) => (
            <div
              key={index}
              className={`group p-6 rounded-3xl transition-all duration-500 hover:scale-105 ${
                historyMove.player === 'Player' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:border-blue-400/60' 
                  : 'bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-400/60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                    historyMove.player === 'Player' 
                      ? 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-blue-400/40 group-hover:border-blue-400/60' 
                      : 'bg-gradient-to-br from-red-400/20 to-pink-500/20 border-red-400/40 group-hover:border-red-400/60'
                  }`}>
                    {historyMove.player === 'Player' ? (
                      <User className="w-5 h-5 text-blue-300 drop-shadow-lg" />
                    ) : (
                      <Bot className="w-5 h-5 text-red-300 drop-shadow-lg" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white text-lg">{historyMove.player}</span>
                    <span className="text-white/60 text-sm ml-3 font-mono">#{Math.floor(index / 2) + 1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatTime(historyMove.timestamp)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-white/90 font-mono text-lg font-bold">
                  {historyMove.move.from} → {historyMove.move.to}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {historyMove.move.captured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 text-sm rounded-full border border-red-500/30 font-medium">
                      Capture
                    </span>
                  )}
                  {historyMove.move.promotion && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 font-medium">
                      Promotion
                    </span>
                  )}
                  {historyMove.move.flags.includes('k') && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-sm rounded-full border border-yellow-500/30 font-medium">
                      Kingside Castle
                    </span>
                  )}
                  {historyMove.move.flags.includes('q') && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-sm rounded-full border border-yellow-500/30 font-medium">
                      Queenside Castle
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
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex justify-between items-center text-white/60 text-base font-medium">
            <span>Total Moves: <span className="text-white font-bold">{moveHistory.length}</span></span>
            <span>Game Progress: <span className="text-white font-bold">{Math.round((moveHistory.length / 2) * 100)}%</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
