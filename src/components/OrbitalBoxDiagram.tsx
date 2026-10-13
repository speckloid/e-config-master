import React from 'react';
import { ElementData, IonData, SubshellBlock } from '../types/chemistry';

interface OrbitalBoxDiagramProps {
  element: ElementData;
  isIon: boolean;
  ionData?: IonData;
}

/**
 * Single-headed fish-hook (harpoon) electron vector icons
 */
const FishHookUp: React.FC<{ className?: string }> = ({ className = 'text-blue-700' }) => (
  <svg
    viewBox="0 0 12 28"
    className={`w-3.5 h-7 inline-block ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="24" x2="6" y2="4" />
    <polyline points="2,9 6,4" />
  </svg>
);

const FishHookDown: React.FC<{ className?: string }> = ({ className = 'text-rose-600' }) => (
  <svg
    viewBox="0 0 12 28"
    className={`w-3.5 h-7 inline-block ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="4" x2="6" y2="24" />
    <polyline points="10,19 6,24" />
  </svg>
);

export const OrbitalBoxDiagram: React.FC<OrbitalBoxDiagramProps> = ({
  element,
  isIon,
  ionData,
}) => {
  const subshells: SubshellBlock[] = isIon && ionData ? ionData.subshells : element.subshells;

  const getOrbitalDistributions = (subshell: SubshellBlock) => {
    const numBoxes = subshell.l === 's' ? 1 : subshell.l === 'p' ? 3 : 5;
    const boxes: { up: boolean; down: boolean }[] = Array.from({ length: numBoxes }, () => ({
      up: false,
      down: false,
    }));

    let remaining = subshell.electrons;

    // Step 1: Hund's rule - fill singly with spin-up fish-hook
    for (let i = 0; i < numBoxes && remaining > 0; i++) {
      boxes[i].up = true;
      remaining--;
    }

    // Step 2: Pauli exclusion - pair with spin-down fish-hook
    for (let i = 0; i < numBoxes && remaining > 0; i++) {
      boxes[i].down = true;
      remaining--;
    }

    return boxes;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-3 select-none">
      {/* Orbital Diagram Grid */}
      <div className="flex-1 flex flex-col justify-center gap-2.5 overflow-y-auto max-h-[380px] pr-1 py-1 my-auto">
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          {subshells.map((subshell, sIdx) => {
            const boxes = getOrbitalDistributions(subshell);

            return (
              <div
                key={`subshell-${subshell.label}-${sIdx}`}
                className="flex flex-col items-center bg-white/70 border border-gray-300 rounded-lg p-2 shadow-xs transition hover:border-blue-400"
              >
                {/* Orbital boxes container */}
                <div className="flex items-center">
                  {boxes.map((box, bIdx) => (
                    <div
                      key={`box-${subshell.label}-${bIdx}`}
                      className={`w-9 h-11 border-2 border-gray-700 bg-white flex items-center justify-center gap-0.5 relative ${
                        bIdx > 0 ? '-ml-0.5' : ''
                      }`}
                    >
                      {box.up && <FishHookUp />}
                      {box.down && <FishHookDown />}
                      {!box.up && !box.down && (
                        <span className="text-gray-200 text-xs font-mono">•</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subshell Label */}
                <div className="mt-1 text-center">
                  <span className="font-bold text-gray-900 font-mono text-sm tracking-tight">
                    {subshell.label}
                  </span>
                  <span className="text-xs text-gray-600 font-semibold align-top ml-0.5">
                    {subshell.electrons}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charge indicator placed directly underneath the orbital structure */}
        {isIon && ionData && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs font-bold text-gray-700">Ionic Charge:</span>
            <span className="font-mono text-sm font-black text-rose-600 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded shadow-2xs">
              <sup>{ionData.chargeDisplay}</sup>
            </span>
          </div>
        )}

        {/* Eric Scerri transition metal educational note */}
        {isIon && ionData?.scerriNote && (
          <div className="mt-2 text-center text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 rounded px-3 py-1 font-medium max-w-md mx-auto">
            💡 <em>Electronic structure note:</em> {ionData.scerriNote}
          </div>
        )}
      </div>
    </div>
  );
};
