import React from 'react';
import { ElementData, DifficultyPeriod } from '../types/chemistry';
import { ELEMENTS_1_TO_36, ELEMENT_BY_Z } from '../data/elements';

interface PeriodicTableProps {
  selectedZ: number | null;
  onSelectElement: (element: ElementData) => void;
  maxPeriod: DifficultyPeriod;
  showAtomicNumbers: boolean;
  disabled?: boolean;
}

// 18 columns, 4 rows grid mapping
// Period 1: H (col 1), He (col 18)
// Period 2: Li (col 1), Be (col 2), B (col 13), C (14), N (15), O (16), F (17), Ne (18)
// Period 3: Na (col 1), Mg (col 2), Al (col 13), Si (14), P (15), S (16), Cl (17), Ar (18)
// Period 4: K (col 1), Ca (col 2), Sc-Zn (cols 3-12), Ga-Kr (cols 13-18)

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  selectedZ,
  onSelectElement,
  maxPeriod,
  showAtomicNumbers,
  disabled = false,
}) => {
  // Build a 4x18 grid of elements or null for empty gaps
  const grid: (ElementData | null)[][] = [
    // Period 1
    Array.from({ length: 18 }, (_, col) => {
      if (col === 0) return ELEMENT_BY_Z[1]; // H
      if (col === 17) return ELEMENT_BY_Z[2]; // He
      return null;
    }),
    // Period 2
    Array.from({ length: 18 }, (_, col) => {
      if (col === 0) return ELEMENT_BY_Z[3]; // Li
      if (col === 1) return ELEMENT_BY_Z[4]; // Be
      if (col >= 12 && col <= 17) return ELEMENT_BY_Z[5 + (col - 12)]; // B..Ne (Z=5..10)
      return null;
    }),
    // Period 3
    Array.from({ length: 18 }, (_, col) => {
      if (col === 0) return ELEMENT_BY_Z[11]; // Na
      if (col === 1) return ELEMENT_BY_Z[12]; // Mg
      if (col >= 12 && col <= 17) return ELEMENT_BY_Z[13 + (col - 12)]; // Al..Ar (Z=13..18)
      return null;
    }),
    // Period 4
    Array.from({ length: 18 }, (_, col) => {
      return ELEMENT_BY_Z[19 + col]; // K (19) to Kr (36)
    }),
  ];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* PhET Element Selection Prompt */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3 text-center">
        Find the element:
      </h2>

      {/* PhET Pink Outer Frame around Periodic Table */}
      <div className="w-full p-2.5 sm:p-3 rounded-lg border-3 border-pink-400 bg-pink-50/20 shadow-xs max-w-[680px]">
        {/* Responsive Grid Table */}
        <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-[3px] sm:gap-1 w-full aspect-[18/5.5]">
          {grid.map((row, rowIdx) => {
            const periodNum = rowIdx + 1;
            const isPeriodEnabled = periodNum <= maxPeriod;

            return row.map((cell, colIdx) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${rowIdx}-${colIdx}`}
                    className="w-full h-full pointer-events-none"
                  />
                );
              }

              const isSelected = selectedZ === cell.atomicNumber;
              const isCellEnabled = isPeriodEnabled && !disabled;

              return (
                <button
                  key={`el-${cell.atomicNumber}`}
                  type="button"
                  disabled={!isCellEnabled}
                  onClick={() => onSelectElement(cell)}
                  className={`relative flex flex-col items-center justify-center rounded-xs transition-all duration-150 touch-manipulation cursor-pointer ${
                    isSelected
                      ? 'bg-yellow-300 text-gray-950 font-black shadow-md ring-2 ring-pink-500 ring-offset-1 z-10 scale-105'
                      : isCellEnabled
                      ? 'bg-[#e9ecef] hover:bg-yellow-100 text-gray-900 font-bold border border-gray-400 hover:border-gray-700 active:scale-95'
                      : 'bg-gray-100/60 text-gray-300 border border-gray-200 cursor-not-allowed opacity-40'
                  }`}
                  style={{ minHeight: '36px' }}
                  title={`${cell.name} (Z=${cell.atomicNumber})`}
                  aria-label={`${cell.name}, atomic number ${cell.atomicNumber}`}
                >
                  {/* Optional atomic number indicator */}
                  {showAtomicNumbers && (
                    <span
                      className={`text-[9px] sm:text-[10px] leading-none absolute top-0.5 left-1 font-mono ${
                        isSelected ? 'text-gray-900 font-bold' : isCellEnabled ? 'text-gray-500' : 'text-gray-300'
                      }`}
                    >
                      {cell.atomicNumber}
                    </span>
                  )}

                  {/* Main Chemical Symbol */}
                  <span
                    className={`text-xs sm:text-sm md:text-base font-extrabold ${
                      showAtomicNumbers ? 'mt-1 sm:mt-1.5' : ''
                    }`}
                  >
                    {cell.symbol}
                  </span>
                </button>
              );
            });
          })}
        </div>

        {/* Legend / Category Bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-600 mt-2.5 pt-2 border-t border-pink-200/60 px-1 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#e9ecef] border border-gray-400 rounded-xs inline-block" />
              <span>Available Elements</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-yellow-300 border border-pink-500 rounded-xs inline-block" />
              <span>Your Selection</span>
            </span>
          </div>

          <span className="text-gray-500 font-medium">
            Active: Periods 1–{maxPeriod} (Z = 1–{maxPeriod === 2 ? 10 : maxPeriod === 3 ? 18 : 36})
          </span>
        </div>
      </div>
    </div>
  );
};
