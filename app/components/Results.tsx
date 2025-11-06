'use client';
import { useState } from 'react';
import { Play, Star, Users, Clock, RotateCcw } from 'lucide-react';
import { QuizResults, GameRecommendation } from '../../types/game';

interface ResultsProps {
  results: QuizResults;
  onRestart: () => void;
}

export default function Results({ results, onRestart }: ResultsProps) {
  const [selectedGame, setSelectedGame] = useState<GameRecommendation | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Personality Summary */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Your Gaming Personality Revealed! 🎮</h1>
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">{results.personality.playstyle}</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {results.personality.primaryTraits.map((trait: string, index: number) => (
              <span key={trait} className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/30">
                {trait}
              </span>
            ))}
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Based on your answers, you enjoy games that are {results.personality.primaryTraits.join(', ')}. Here are some perfect matches for your
            playstyle!
          </p>
        </div>
      </div>

      {/* Game Recommendations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {results.recommendations.map((game: GameRecommendation, index: number) => (
          <div
            key={game.name}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 group cursor-pointer"
            onClick={() => setSelectedGame(game)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300">{game.name}</h3>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-bold">{game.rating}</span>
            </div>

            <p className="text-slate-300 mb-4 text-sm">{game.description}</p>

            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {game.timeRequired}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {game.players}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} />
                {game.genre}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-slate-400 text-sm">Why it matches:</span>
              <p className="text-blue-300 text-sm">{game.matchReason}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(game.store_url, '_blank');
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group/btn"
            >
              <Play size={16} />
              View on Steam
            </button>
          </div>
        ))}
      </div>

      {/* Game Detail Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700/50">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedGame.name}</h2>
              <button onClick={() => setSelectedGame(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-300 mb-6">{selectedGame.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Genre:</span>
                    <span className="text-white">{selectedGame.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Required:</span>
                    <span className="text-white">{selectedGame.timeRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Players:</span>
                    <span className="text-white">{selectedGame.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating:</span>
                    <span className="text-green-400 font-semibold">{selectedGame.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Perfect Match Because:</h3>
                <p className="text-blue-300 mb-6">{selectedGame.matchReason}</p>

                <h3 className="text-lg font-semibold text-white mb-3">Similar Games:</h3>
                <p className="text-slate-300 text-sm mb-6">{selectedGame.similarGames}</p>

                <button
                  onClick={() => window.open(selectedGame.store_url, '_blank')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Play size={16} />
                  View on Steam Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto group"
        >
          <RotateCcw size={16} />
          Take the Test Again
        </button>
      </div>
    </div>
  );
}
