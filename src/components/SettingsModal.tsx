import React from 'react';
import { X, Check, Sliders, Users, Clock, Atom, FileText, Sparkles, BookOpen, LayoutGrid } from 'lucide-react';
import { GameSettings, Player, DifficultyPeriod, RepresentationType, SpeciesMode } from '../types/chemistry';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings, newPlayers?: Player[]) => void;
  onReturnToWelcome?: () => void;
  players: Player[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onReturnToWelcome,
  players,
}) => {
  const [localSettings, setLocalSettings] = React.useState<GameSettings>({ ...settings });
  const [localPlayers, setLocalPlayers] = React.useState<Player[]>([...players]);

  React.useEffect(() => {
    setLocalSettings({ ...settings });
    setLocalPlayers([...players]);
  }, [settings, players, isOpen]);

  if (!isOpen) return null;

  const toggleRepresentation = (type: RepresentationType) => {
    setLocalSettings(prev => {
      const current = prev.allowedRepresentations;
      const exists = current.includes(type);
      let updated: RepresentationType[];
      if (exists) {
        if (current.length <= 1) return prev; // At least one
        updated = current.filter(t => t !== type);
      } else {
        updated = [...current, type];
      }
      return { ...prev, allowedRepresentations: updated };
    });
  };

  const handlePlayerCountChange = (count: number) => {
    const defaultColors = ['#2563eb', '#059669', '#d97706', '#9333ea'];
    const updated: Player[] = [];
    for (let i = 0; i < count; i++) {
      if (localPlayers[i]) {
        updated.push(localPlayers[i]);
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
    setLocalPlayers(updated);
    setLocalSettings(prev => ({ ...prev, numPlayers: count }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings, localPlayers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-[#fbf9f1] border-2 border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#205493] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-200" />
            <h2 className="text-xl font-black tracking-tight">Game Setup &amp; Options</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Maximum Period */}
          <div>
            <label className="text-sm font-extrabold text-gray-900 block mb-2">
              Maximum Period (Element Range)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { period: 2 as DifficultyPeriod, title: 'Periods 1–2', desc: 'H to Ne (Z = 1–10)' },
                { period: 3 as DifficultyPeriod, title: 'Periods 1–3', desc: 'H to Ar (Z = 1–18)' },
                { period: 4 as DifficultyPeriod, title: 'Periods 1–4', desc: 'H to Kr (Z = 1–36, 3d metals)' },
              ].map(opt => (
                <button
                  key={opt.period}
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, maxPeriod: opt.period }))}
                  className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                    localSettings.maxPeriod === opt.period
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                      : 'border-gray-300 bg-white hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="text-sm font-black flex items-center justify-between">
                    <span>{opt.title}</span>
                    {localSettings.maxPeriod === opt.period && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal mt-1 leading-snug">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Afforded Representations (Multi-select) */}
          <div>
            <label className="text-sm font-extrabold text-gray-900 block mb-1">
              Representations Afforded in Game
            </label>
            <p className="text-xs text-gray-500 mb-2.5">
              Select which representations can appear (chosen at random per challenge):
            </p>
            <div className="space-y-2">
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
                const isChecked = localSettings.allowedRepresentations.includes(item.type);
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

          {/* Section 3: Species */}
          <div>
            <label className="text-sm font-extrabold text-gray-900 block mb-2">
              Species Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { mode: 'atoms_only' as SpeciesMode, label: 'Neutral Atoms Only', desc: 'Ground-state atoms (Charge = 0)' },
                { mode: 'atoms_and_ions' as SpeciesMode, label: 'Neutral Atoms & Ions', desc: 'Includes cations & anions with Scerri rules' },
              ].map(opt => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, speciesMode: opt.mode }))}
                  className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                    localSettings.speciesMode === opt.mode
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-gray-300 bg-white hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-black flex items-center justify-between">
                    <span>{opt.label}</span>
                    {localSettings.speciesMode === opt.mode && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Multiplayer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-700" />
              <label className="text-sm font-extrabold text-gray-900">
                Number of Players (1–4)
              </label>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handlePlayerCountChange(count)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm border-2 transition cursor-pointer ${
                    localSettings.numPlayers === count
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {count} {count === 1 ? 'Player' : 'Players'}
                </button>
              ))}
            </div>

            {localSettings.numPlayers > 1 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {localPlayers.slice(0, localSettings.numPlayers).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-400 shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <input
                      type="text"
                      value={p.name}
                      onChange={e => {
                        const newName = e.target.value;
                        setLocalPlayers(prev =>
                          prev.map((item, pIdx) => (pIdx === idx ? { ...item, name: newName } : item))
                        );
                      }}
                      className="text-xs font-bold text-gray-800 w-full outline-hidden"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Classroom Aids & Timer */}
          <div className="bg-white p-4 rounded-xl border border-gray-300 space-y-3">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Classroom Options &amp; Aids
            </h4>

            <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
              <span>Show written shell counts alongside Bohr atom</span>
              <input
                type="checkbox"
                checked={localSettings.showWrittenConfigWithBohr}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, showWrittenConfigWithBohr: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
              <span>Show atomic numbers (Z) on Periodic Table cells</span>
              <input
                type="checkbox"
                checked={localSettings.showAtomicNumbersOnTable}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, showAtomicNumbersOnTable: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-600" />
                <span>Enable 20-second question timer (with speed bonus)</span>
              </span>
              <input
                type="checkbox"
                checked={localSettings.timerEnabled}
                onChange={e =>
                  setLocalSettings(prev => ({ ...prev, timerEnabled: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-300 flex items-center justify-between gap-3">
          {onReturnToWelcome && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReturnToWelcome();
              }}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 underline cursor-pointer"
            >
              Back to Welcome Screen
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[#205493] hover:bg-blue-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
