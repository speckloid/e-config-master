import React, { useState } from 'react';
import { ElementData, IonData } from '../types/chemistry';
import { Play, Pause } from 'lucide-react';

interface BohrAtomProps {
  element: ElementData;
  isIon: boolean;
  ionData?: IonData;
  showWrittenAid?: boolean;
}

export const BohrAtom: React.FC<BohrAtomProps> = ({
  element,
  isIon,
  ionData,
  showWrittenAid = false,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  // Active electron counts per principal shell
  const shellConfig = isIon && ionData ? ionData.shellConfig : element.shellConfig;
  const totalElectrons = shellConfig.reduce((a, b) => a + b, 0);

  // Radius for concentric shells
  const maxShells = 4;
  const shellRadii = [60, 100, 140, 180]; // n = 1, 2, 3, 4

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-2 select-none relative">
      {/* Top Legend Panel: particle key only */}
      <div className="w-full flex items-center justify-between gap-2 mb-1">
        <div className="bg-[#fff9d9] border border-gray-800 rounded-md px-3 py-1.5 shadow-xs text-xs font-medium text-gray-800 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Protons:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-rose-700 shadow-xs border border-red-700/60 inline-block" />
              <span className="font-bold text-gray-900 font-mono text-xs">?</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Electrons:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-blue-700 shadow-xs border border-blue-700/60 inline-block" />
              <span className="font-bold text-blue-900 font-mono text-xs">{totalElectrons}</span>
            </div>
          </div>
        </div>

        {/* Animation Toggle */}
        <button
          onClick={() => setIsSpinning(!isSpinning)}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white border border-gray-300 px-2.5 py-1 rounded transition cursor-pointer"
          title="Toggle electron orbit rotation"
        >
          {isSpinning ? <Pause className="w-3 h-3 text-blue-600" /> : <Play className="w-3 h-3 text-blue-600" />}
          <span>{isSpinning ? 'Pause' : 'Animate'}</span>
        </button>
      </div>

      {/* 2D Concentric Bohr Atom with square brackets and deconflicted charge for ions */}
      <div className="relative flex items-center justify-center my-auto w-full max-w-[340px] px-2">
        <svg
          viewBox={isIon && ionData ? "-215 -220 485 440" : "-210 -210 420 420"}
          className="w-full h-full drop-shadow-xs overflow-visible"
        >
          {/* Subtle central aura */}
          <circle cx="0" cy="0" r="28" fill="rgba(239, 68, 68, 0.12)" />

          {/* Concentric dashed electron shell rings */}
          {shellRadii.slice(0, Math.max(element.period, shellConfig.length)).map((radius, idx) => {
            const shellNum = idx + 1;
            const electronsInShell = shellConfig[idx] || 0;
            const isOccupied = electronsInShell > 0;

            return (
              <g key={`shell-ring-${shellNum}`}>
                {/* Thin, bright blue dashed circle matching PhET */}
                <circle
                  cx="0"
                  cy="0"
                  r={radius}
                  fill="none"
                  stroke={isOccupied ? '#0284c7' : '#94a3b8'}
                  strokeWidth={isOccupied ? '1.8' : '1.2'}
                  strokeDasharray="5 5"
                  className="transition-colors duration-300"
                />

                {/* Subtle shell label n=1, 2, 3, 4 */}
                <text
                  x={radius - 6}
                  y="-8"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isOccupied ? '#0369a1' : '#94a3b8'}
                  textAnchor="end"
                  opacity="0.75"
                >
                  n={shellNum}
                </text>
              </g>
            );
          })}

          {/* Central Nucleus (Protons & Neutrons Cluster) */}
          <g>
            <defs>
              <radialGradient id="nucleusGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <radialGradient id="electronGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="45%" stopColor="#38bdf8" />
                <stop offset="85%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>
            </defs>

            <circle
              cx="0"
              cy="0"
              r="22"
              fill="url(#nucleusGrad)"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            <circle cx="-6" cy="-6" r="6" fill="#ffffff" opacity="0.35" />
            <text
              x="0"
              y="4.5"
              fill="#ffffff"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              className="font-math tracking-tight"
            >
              +?
            </text>
          </g>

          {/* Electrons placed evenly along each shell */}
          {shellConfig.map((count, shellIdx) => {
            if (count <= 0) return null;
            const radius = shellRadii[shellIdx];
            const shellNum = shellIdx + 1;
            const spinClass = isSpinning
              ? (shellIdx % 2 === 0 ? 'animate-spin' : 'animate-[spin_12s_linear_infinite_reverse]')
              : '';

            return (
              <g
                key={`electrons-shell-${shellNum}`}
                className={spinClass}
                style={{
                  transformOrigin: '0 0',
                  animationDuration: `${14 + shellIdx * 6}s`,
                }}
              >
                {Array.from({ length: count }).map((_, eIdx) => {
                  const angle = (2 * Math.PI * eIdx) / count - Math.PI / 2;
                  const cx = radius * Math.cos(angle);
                  const cy = radius * Math.sin(angle);

                  return (
                    <g key={`e-${shellNum}-${eIdx}`}>
                      <circle cx={cx} cy={cy} r="6.5" fill="rgba(2, 132, 199, 0.25)" />
                      <circle
                        cx={cx}
                        cy={cy}
                        r="5.5"
                        fill="url(#electronGrad)"
                        stroke="#0369a1"
                        strokeWidth="1"
                      />
                      <circle cx={cx - 1.8} cy={cy - 1.8} r="1.6" fill="#ffffff" opacity="0.8" />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Large Square Brackets and Deconflicted Charge for Ions */}
          {isIon && ionData && (
            <g className="ion-brackets-group">
              {/* Left square bracket: top hook, vertical stem, bottom hook */}
              <path
                d="M -180 -195 L -195 -195 L -195 195 L -180 195"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Right square bracket: top hook, vertical stem, bottom hook */}
              <path
                d="M 180 -195 L 195 -195 L 195 195 L 180 195"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Ionic Charge: clearly outside the right bracket, safely within viewBox frame */}
              <text
                x="206"
                y="-175"
                textAnchor="start"
                fill="#e11d48"
                fontSize="32"
                fontWeight="900"
                fontFamily="'Fira Sans', system-ui, sans-serif"
                className="font-math select-none"
              >
                {ionData.chargeDisplay}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Optional Shell count aid (e.g. 2, 8, 8, 1) */}
      {showWrittenAid && (
        <div className="mt-1 w-full max-w-sm bg-blue-50/80 border border-blue-200 rounded px-3 py-1 text-center">
          <div className="text-[11px] font-semibold text-blue-800">
            Principal Shell Configuration:
          </div>
          <div className="font-math font-bold text-sm text-blue-950 tracking-wider">
            {isIon && ionData ? (
              <span>
                [{shellConfig.join(', ')}]
                <sup className="text-rose-600 text-sm font-extrabold ml-0.5">{ionData.chargeDisplay}</sup>
              </span>
            ) : (
              shellConfig.join(', ')
            )}
          </div>
        </div>
      )}
    </div>
  );
};
