import React from 'react';
import { Trophy, RotateCcw, Sliders, Flame, CheckCircle2 } from 'lucide-react';
import { Player, GameSettings } from '../types/chemistry';

interface GameOverModalProps {
  isOpen: boolean;
  players: Player[];
  settings: GameSettings;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  players,
  settings,
  onPlayAgain,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isMultiplayer = players.length > 1;
  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#fbf9f1] border-2 border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Banner */}
        <div className="bg-[#205493] text-white p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg mb-3">
            <Trophy className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Round Completed!</h2>
          <p className="text-blue-200 text-xs mt-1">
            {settings.challengesPerGame} challenges mastered across Periods 1–{settings.maxPeriod}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isMultiplayer ? (
            <div>
              <div className="text-base font-extrabold text-gray-900 mb-3">
                🏆 Winner: <span style={{ color: winner.color }}>{winner.name}</span> with {winner.score} points!
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white rounded-xl border border-gray-300 divide-y divide-gray-200 overflow-hidden shadow-xs">
                {sortedPlayers.map((player, rank) => (
                  <div key={player.id} className="flex items-center justify-between p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-gray-400 w-5">#{rank + 1}</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-bold text-gray-800">{player.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold" title="Best Streak">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{player.bestStreak}</span>
                      </div>
                      <div className="font-mono font-black text-blue-900 text-base">
                        {player.score} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-4xl font-black text-blue-900 font-mono">
                {players[0].score} <span className="text-lg text-gray-500 font-sans font-bold">points</span>
              </div>
              <div className="flex justify-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{players[0].correctCount} / {players[0].totalAttempts} Correct</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Best Streak: {players[0].bestStreak}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#205493] hover:bg-blue-800 active:scale-95 text-white font-bold text-sm shadow-md transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-700 font-bold text-sm transition"
            >
              <Sliders className="w-4 h-4" />
              <span>Change Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
