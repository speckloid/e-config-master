import React from 'react';
import { Volume2, VolumeX, Settings, RotateCcw, Flame, Clock, Pause, Play } from 'lucide-react';
import { Player, GameSettings } from '../types/chemistry';

interface TopStatusBarProps {
  currentChallengeIndex: number;
  totalChallenges: number;
  activePlayer: Player;
  players: Player[];
  settings: GameSettings;
  timeLeft: number;
  isTimerPaused: boolean;
  onToggleTimerPause: () => void;
  onOpenSettings: () => void;
  onStartOver: () => void;
  onToggleSound: () => void;
  isMuted: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  currentChallengeIndex,
  totalChallenges,
  activePlayer,
  players,
  settings,
  timeLeft,
  isTimerPaused,
  onToggleTimerPause,
  onOpenSettings,
  onStartOver,
  onToggleSound,
  isMuted,
}) => {
  const getLevelLabel = () => {
    switch (settings.maxPeriod) {
      case 2:
        return 'Level 1 (Periods 1–2)';
      case 3:
        return 'Level 2 (Periods 1–3)';
      case 4:
        return 'Level 3 (Periods 1–4)';
      default:
        return 'Level 1';
    }
  };

  return (
    <header className="w-full bg-[#205493] text-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left indicators: Level, Challenge, Score */}
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
          <div className="flex items-baseline gap-1.5 font-bold text-lg tracking-wide">
            <span className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Level:</span>
            <span>{getLevelLabel()}</span>
          </div>

          <div className="flex items-baseline gap-1.5 font-bold text-lg tracking-wide">
            <span className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Challenge:</span>
            <span>
              {currentChallengeIndex + 1}
              {totalChallenges > 0 ? ` of ${totalChallenges}` : ''}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 font-bold text-lg tracking-wide">
            <span className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Score:</span>
            <span className="text-amber-300 font-extrabold">{activePlayer.score}</span>
          </div>

          {activePlayer.streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-sm font-semibold border border-amber-400/30">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Streak: {activePlayer.streak}</span>
            </div>
          )}
        </div>

        {/* Center / Multiplayer Turn banner */}
        {settings.numPlayers > 1 && (
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg border border-white/20">
            <span className="text-xs text-blue-200 uppercase tracking-wider font-bold">Turn:</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: activePlayer.color }}
              />
              <span className="font-bold text-sm">{activePlayer.name}</span>
            </div>
          </div>
        )}

        {/* Right side: Timer & Actions */}
        <div className="flex items-center gap-3">
          {settings.timerEnabled && (
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-md border border-white/10">
              <Clock className="w-4 h-4 text-blue-200" />
              <span
                className={`font-mono font-bold text-sm ${
                  timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'
                }`}
              >
                {timeLeft}s
              </span>
              <button
                onClick={onToggleTimerPause}
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                className="ml-1 p-1 hover:bg-white/10 rounded transition text-blue-200 hover:text-white"
                aria-label={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition"
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Game Setup & Settings"
            className="p-1.5 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition"
            aria-label="Game Setup & Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* PhET Start Over Button */}
          <button
            onClick={onStartOver}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 font-semibold text-sm hover:from-white hover:to-gray-100 active:scale-95 transition shadow-sm border border-gray-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-700" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </header>
  );
};
