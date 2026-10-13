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
