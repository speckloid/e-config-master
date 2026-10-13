import React from 'react';
import { Challenge, GameSettings } from '../types/chemistry';
import { BohrAtom } from './BohrAtom';
import { OrbitalBoxDiagram } from './OrbitalBoxDiagram';
import { ConfigurationDisplay } from './ConfigurationDisplay';
import { Atom, LayoutGrid, FileText, Sparkles, BookOpen } from 'lucide-react';

interface ChallengeAreaProps {
  challenge: Challenge;
  settings: GameSettings;
}

export const ChallengeArea: React.FC<ChallengeAreaProps> = ({ challenge, settings }) => {
  const getRepInfo = () => {
    switch (challenge.representation) {
      case 'bohr_shell':
        return {
          title: '2D Bohr Shell Model',
          icon: <Atom className="w-4 h-4 text-blue-600" />,
        };
      case 'written_shell':
        return {
          title: 'Principal Shell Configuration',
          icon: <FileText className="w-4 h-4 text-emerald-600" />,
        };
      case 'subshell_full':
        return {
          title: 'Full Subshell Configuration',
          icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
        };
      case 'subshell_condensed':
        return {
          title: 'Noble-Gas Shorthand',
          icon: <BookOpen className="w-4 h-4 text-purple-600" />,
        };
      case 'orbital_boxes':
        return {
          title: 'Orbital-Box Diagram',
          icon: <LayoutGrid className="w-4 h-4 text-amber-600" />,
        };
    }
  };

  const repInfo = getRepInfo();

  return (
    <div className="w-full h-full flex flex-col bg-[#fffef5] border-2 border-gray-800 rounded-2xl shadow-sm overflow-hidden select-none">
      {/* Clean Model Header without superfluous subheadings */}
      <div className="bg-[#f0ece1] border-b border-gray-300 px-4 py-2.5 flex items-center gap-2">
        {repInfo.icon}
        <h3 className="font-extrabold text-sm text-gray-900 tracking-tight">
          {repInfo.title}
        </h3>
      </div>

      {/* Main Challenge Representation Display */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 min-h-[380px] justify-center items-center overflow-hidden">
        {challenge.representation === 'bohr_shell' && (
          <BohrAtom
            element={challenge.element}
            isIon={challenge.isIon}
            ionData={challenge.ionData}
            showWrittenAid={settings.showWrittenConfigWithBohr}
          />
        )}

        {challenge.representation === 'written_shell' && (
          <ConfigurationDisplay
            element={challenge.element}
            isIon={challenge.isIon}
            ionData={challenge.ionData}
            mode="written_shell"
          />
        )}

        {challenge.representation === 'subshell_full' && (
          <ConfigurationDisplay
            element={challenge.element}
            isIon={challenge.isIon}
            ionData={challenge.ionData}
            mode="subshell_full"
          />
        )}

        {challenge.representation === 'subshell_condensed' && (
          <ConfigurationDisplay
            element={challenge.element}
            isIon={challenge.isIon}
            ionData={challenge.ionData}
            mode="subshell_condensed"
          />
        )}

        {challenge.representation === 'orbital_boxes' && (
          <OrbitalBoxDiagram
            element={challenge.element}
            isIon={challenge.isIon}
            ionData={challenge.ionData}
          />
        )}
      </div>
    </div>
  );
};
