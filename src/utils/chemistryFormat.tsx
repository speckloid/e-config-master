import React from 'react';

/**
 * Chemistry formatting utilities
 */

export function getUnicodeCharge(chargeDisplay: string): string {
  switch (chargeDisplay) {
    case '+':
      return '⁺';
    case '2+':
      return '²⁺';
    case '3+':
      return '³⁺';
    case '4+':
      return '⁴⁺';
    case '−':
    case '-':
      return '⁻';
    case '2−':
    case '2-':
      return '²⁻';
    case '3−':
    case '3-':
      return '³⁻';
    default:
      return chargeDisplay;
  }
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
};

/**
 * Parses subshell configurations (e.g. "1s² 2s² 2p⁶ 3d¹⁰" or "[Ar] 3d¹⁰ 4s²")
 * and converts unicode superscripts into native standard digits inside <sup> tags
 * styled with Fira Sans for mathematically flawless rendering.
 */
export function renderFormattedSubshells(notation: string): React.ReactNode {
  // Split notation into tokens separated by spaces
  const tokens = notation.trim().split(/\s+/);

  return (
    <span className="font-math inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
      {tokens.map((token, idx) => {
        // If it's a bracketed noble gas core like [He], [Ne], [Ar], [Kr]
        if (token.startsWith('[') && token.endsWith(']')) {
          return (
            <span key={idx} className="font-math font-bold text-indigo-900">
              {token}
            </span>
          );
        }

        // Match base subshell and unicode superscripts: e.g. "3d¹⁰" -> base="3d", sups="¹⁰"
        let base = '';
        let sups = '';

        for (const char of token) {
          if (SUPERSCRIPT_MAP[char] !== undefined) {
            sups += SUPERSCRIPT_MAP[char];
          } else {
            base += char;
          }
        }

        if (sups.length > 0) {
          return (
            <span key={idx} className="font-math whitespace-nowrap inline-flex items-baseline">
              <span className="font-bold">{base}</span>
              <sup className="font-math font-bold text-[0.68em] ml-0.5 select-none relative -top-[0.45em]">
                {sups}
              </sup>
            </span>
          );
        }

        return (
          <span key={idx} className="font-math font-bold">
            {token}
          </span>
        );
      })}
    </span>
  );
}
