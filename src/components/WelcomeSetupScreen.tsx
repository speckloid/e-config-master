import React, { useState } from 'react';
import { Play, Atom, FileText, LayoutGrid, BookOpen, Clock, Users, Check, Sparkles } from 'lucide-react';
import { GameSettings, Player, DifficultyPeriod, RepresentationType, SpeciesMode } from '../types/chemistry';
import { soundEffects } from '../utils/audio';

interface WelcomeSetupScreenProps {
  initialSettings: GameSettings;
  initialPlayers: Player[];
  onStartGame: (settings: GameSettings, players: Player[]) => void;
}

export const WelcomeSetupScreen: React.FC<WelcomeSetupScreenProps> = ({
  initialSettings,
  initialPlayers,
  onStartGame,
}) => {
  const [settings, setSettings] = useState<GameSettings>({ ...initialSettings });
  const [players, setPlayers] = useState<Player[]>([...initialPlayers]);

  const defaultColors = ['#2563eb', '#059669', '#d97706', '#9333ea'];

  const toggleRepresentation = (type: RepresentationType) => {
    setSettings(prev => {
      const current = prev.allowedRepresentations;
      const exists = current.includes(type);
      let updated: RepresentationType[];
      if (exists) {
        if (current.length <= 1) return prev; // Keep at least 1
        updated = current.filter(t => t !== type);
      } else {
        updated = [...current, type];
      }
      return { ...prev, allowedRepresentations: updated };
    });
  };

  const applyPreset = (preset: 'shells' | 'subshells' | 'all') => {
    if (preset === 'shells') {
      setSettings(prev => ({
        ...prev,
        allowedRepresentations: ['bohr_shell', 'written_shell'],
      }));
    } else if (preset === 'subshells') {
      setSettings(prev => ({
        ...prev,
        allowedRepresentations: ['subshell_full', 'subshell_condensed', 'orbital_boxes'],
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        allowedRepresentations: ['bohr_shell', 'written_shell', 'subshell_full', 'subshell_condensed', 'orbital_boxes'],
      }));
    }
  };

  const handlePlayerCountChange = (count: number) => {
    const updated: Player[] = [];
    for (let i = 0; i < count; i++) {
      if (players[i]) {
        updated.push(players[i]);
      } else {
        updated.push({
          id: `player_${i + 1}`,
          name: `Player ${i + 1}`,
          color: defaultColors[i % defaultColors.length],
          score: 0,
          streak: 0,
          bestStreak: 0,
          correctCount: 0,
          totalAttempts: 0,
        });
      }
    }
    setPlayers(updated);
    setSettings(prev => ({ ...prev, numPlayers: count }));
  };

  const handleStart = () => {
    soundEffects.playClick();
    onStartGame(settings, players);
  };

  return (
    <div className="min-h-screen bg-[#faf8ee] flex flex-col justify-between select-none">
      {/* PhET Blue Top Header: Clean bar without superfluous subheadings */}
      <header className="w-full bg-[#205493] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-gray-950 flex items-center justify-center font-black text-lg shadow-xs">
              ⚛
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              Electronic Structure Challenge
            </h1>
          </div>
        </div>
      </header>

      {/* Main Setup Cards Container */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 my-auto space-y-5">
        {/* Simple "Setup" Title without explanatory paragraph */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Setup
          </h2>
        </div>

        {/* 2-Column Responsive Setup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Element Range (Max Period) & Species */}
          <div className="bg-[#fffef5] border-2 border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                Maximum Period
              </h3>

              <div className="space-y-2">
                {[
                  { period: 2 as DifficultyPeriod, title: 'Periods 1–2 (H – Ne)' },
                  { period: 3 as DifficultyPeriod, title: 'Periods 1–3 (H – Ar)' },
                  { period: 4 as DifficultyPeriod, title: 'Periods 1–4 (H – Kr)' },
                ].map(opt => (
                  <button
                    key={opt.period}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, maxPeriod: opt.period }))}
                    className={`w-full py-2.5 px-3.5 rounded-xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                      settings.maxPeriod === opt.period
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                        : 'border-gray-300 bg-white hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-bold">{opt.title}</span>
                    {settings.maxPeriod === opt.period && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Species Mode */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider mb-2">
                Species Included
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { mode: 'atoms_only' as SpeciesMode, label: 'Neutral Atoms Only' },
                  { mode: 'atoms_and_ions' as SpeciesMode, label: 'Atoms & Ions' },
                ].map(sp => (
                  <button
                    key={sp.mode}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, speciesMode: sp.mode }))}
                    className={`py-2 px-3 rounded-xl border-2 text-center text-xs font-bold transition cursor-pointer ${
                      settings.speciesMode === sp.mode
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Afforded Representations (Multi-select) */}
          <div className="bg-[#fffef5] border-2 border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                  Representations Afforded
                </h3>

                {/* Presets */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => applyPreset('shells')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 cursor-pointer"
                  >
                    Shells
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('subshells')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 cursor-pointer"
                  >
                    Subshells
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('all')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 cursor-pointer"
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Checkboxes List */}
              <div className="space-y-1.5">
                {[
                  {
                    type: 'bohr_shell' as RepresentationType,
                    title: '2D Bohr Shell Model',
                    icon: <Atom className="w-4 h-4 text-blue-600" />,
                  },
                  {
                    type: 'written_shell' as RepresentationType,
                    title: 'Principal Shell Configuration (2, 8, ...)',
                    icon: <FileText className="w-4 h-4 text-emerald-600" />,
                  },
                  {
                    type: 'subshell_full' as RepresentationType,
                    title: 'Full Subshell Configuration',
                    icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
                  },
                  {
                    type: 'subshell_condensed' as RepresentationType,
                    title: 'Noble-Gas Shorthand',
                    icon: <BookOpen className="w-4 h-4 text-purple-600" />,
                  },
                  {
                    type: 'orbital_boxes' as RepresentationType,
                    title: 'Orbital-Box Diagram',
                    icon: <LayoutGrid className="w-4 h-4 text-amber-600" />,
                  },
                ].map(item => {
                  const isChecked = settings.allowedRepresentations.includes(item.type);
                  return (
                    <label
                      key={item.type}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border-2 transition cursor-pointer ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRepresentation(item.type)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Multiplayer, Timer & Classroom Options */}
        <div className="bg-[#fffef5] border-2 border-gray-800 rounded-2xl p-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Players (1-4) */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Players</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handlePlayerCountChange(c)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition cursor-pointer ${
                      settings.numPlayers === c
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {c} {c === 1 ? 'P' : 'Ps'}
                  </button>
                ))}
              </div>

              {settings.numPlayers > 1 && (
                <div className="space-y-1">
                  {players.slice(0, settings.numPlayers).map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-white p-1 rounded border border-gray-200">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <input
                        type="text"
                        value={p.name}
                        onChange={e => {
                          const val = e.target.value;
                          setPlayers(prev =>
                            prev.map((item, pIdx) => (pIdx === idx ? { ...item, name: val } : item))
                          );
                        }}
                        className="text-xs font-bold text-gray-800 w-full outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timer & Round Length */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Timer &amp; Challenges</span>
              </div>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer bg-white p-2 rounded-lg border border-gray-200 mb-2">
                <span>20s timer</span>
                <input
                  type="checkbox"
                  checked={settings.timerEnabled}
                  onChange={e => setSettings(prev => ({ ...prev, timerEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <div className="flex gap-1">
                {[
                  { count: 5, label: '5' },
                  { count: 10, label: '10' },
                  { count: 0, label: 'Endless' },
                ].map(opt => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, challengesPerGame: opt.count }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition cursor-pointer ${
                      settings.challengesPerGame === opt.count
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-black'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Aids */}
            <div>
              <div className="font-extrabold text-xs text-gray-900 uppercase tracking-wider mb-2">
                Display Aids
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer bg-white p-2 rounded-lg border border-gray-200">
                  <span>Atomic numbers (Z) on table</span>
                  <input
                    type="checkbox"
                    checked={settings.showAtomicNumbersOnTable}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, showAtomicNumbersOnTable: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer bg-white p-2 rounded-lg border border-gray-200">
                  <span>Written config with Bohr model</span>
                  <input
                    type="checkbox"
                    checked={settings.showWrittenConfigWithBohr}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, showWrittenConfigWithBohr: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button: Clean, without any text below */}
        <div className="flex flex-col items-center justify-center pt-1 pb-4">
          <button
            type="button"
            onClick={handleStart}
            className="w-full max-w-sm py-3.5 px-8 rounded-xl bg-[#205493] hover:bg-blue-800 active:scale-95 text-white font-black text-lg tracking-wide shadow-lg transition flex items-center justify-center gap-2.5 border-2 border-gray-900 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Game</span>
          </button>
        </div>
      </main>
    </div>
  );
};
