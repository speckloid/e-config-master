import React from 'react';
import { ElementData, IonData } from '../types/chemistry';

interface ConfigurationDisplayProps {
  element: ElementData;
  isIon: boolean;
  ionData?: IonData;
  mode: 'written_shell' | 'subshell_full' | 'subshell_condensed';
}

export const ConfigurationDisplay: React.FC<ConfigurationDisplayProps> = ({
  element,
  isIon,
  ionData,
  mode,
}) => {
  const shellConfig = isIon && ionData ? ionData.shellConfig : element.shellConfig;
  const totalElectrons = isIon && ionData ? ionData.totalElectrons : element.atomicNumber;

  const renderContent = () => {
    if (mode === 'written_shell') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 my-auto">
          {/* Main Principal Shell Configuration */}
          <div className="bg-white border-2 border-gray-800 rounded-2xl px-10 py-8 shadow-sm text-center">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block mb-2">
              Principal Shell Configuration
            </span>
            <div className="font-mono text-4xl sm:text-5xl font-black text-gray-900 tracking-wider flex items-center justify-center">
              {isIon && ionData ? (
                <div className="flex items-start">
                  <span>[{shellConfig.join(', ')}]</span>
                  <sup className="text-rose-600 text-2xl sm:text-3xl font-extrabold font-mono ml-1.5 -mt-2">
                    {ionData.chargeDisplay}
                  </sup>
                </div>
              ) : (
                <span>{shellConfig.join(', ')}</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (mode === 'subshell_full') {
      const notation = isIon && ionData ? ionData.fullNotation : element.fullNotation;
      return (
        <div className="flex flex-col items-center justify-center gap-4 my-auto">
          <div className="bg-white border-2 border-gray-800 rounded-2xl px-8 py-7 shadow-sm text-center max-w-xl">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block mb-2">
              Complete Subshell Configuration
            </span>
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-blue-900 tracking-normal break-words leading-relaxed flex items-center justify-center">
              {isIon && ionData ? (
                <div className="flex items-start">
                  <span>[{notation}]</span>
                  <sup className="text-rose-600 text-lg sm:text-xl font-extrabold font-mono ml-1.5 -mt-1">
                    {ionData.chargeDisplay}
                  </sup>
                </div>
              ) : (
                <span>{notation}</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Condensed noble-gas notation
    const notation = isIon && ionData ? ionData.condensedNotation : element.condensedNotation;
    return (
      <div className="flex flex-col items-center justify-center gap-4 my-auto">
        <div className="bg-white border-2 border-gray-800 rounded-2xl px-10 py-8 shadow-sm text-center max-w-lg">
          <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block mb-2">
            Noble-Gas Shorthand Configuration
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-normal flex items-center justify-center">
            {isIon && ionData ? (
              <div className="flex items-start">
                <span>[{notation}]</span>
                <sup className="text-rose-600 text-xl sm:text-2xl font-extrabold font-mono ml-1.5 -mt-1">
                  {ionData.chargeDisplay}
                </sup>
              </div>
            ) : (
              <span>{notation}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none">
      {/* Top Header: Only particle count, no redundant atom/ion badge */}
      <div className="flex items-center justify-start mb-2">
        <div className="bg-[#fff9d9] border border-gray-800 rounded px-3 py-1 text-xs font-medium text-gray-800">
          Electrons: <strong className="text-blue-900 font-mono text-sm">{totalElectrons}</strong>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};
