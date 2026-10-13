/**
 * Chemistry & Game types for Electronic Structure Challenge
 */

export type DifficultyPeriod = 2 | 3 | 4; // Max period: 2 (H-Ne), 3 (H-Ar), 4 (H-Kr)

export type RepresentationType = 
  | 'bohr_shell'         // Bohr atom concentric dashed shells with electrons
  | 'written_shell'      // Written shell notation e.g. 2, 8, 8
  | 'subshell_full'      // Subshell notation e.g. 1s² 2s² 2p⁶ 3s² 3p⁶ 4s²
  | 'subshell_condensed' // Noble-gas notation e.g. [Ar] 4s²
  | 'orbital_boxes';     // Orbital-box diagrams with fish-hook arrows

export type RepresentationMode = RepresentationType;

export type SpeciesMode = 'atoms_only' | 'atoms_and_ions';

export interface SubshellBlock {
  label: string;       // e.g. "1s", "2p", "3d"
  n: number;           // principal quantum number (1, 2, 3, 4)
  l: 's' | 'p' | 'd';  // azimuthal quantum number
  capacity: number;    // 2 for s, 6 for p, 10 for d
  electrons: number;   // actual count in this subshell
  energyRank?: number; // relative energy order (e.g. 3d vs 4s)
}

export interface ElementData {
  atomicNumber: number; // Z
  symbol: string;
  name: string;
  period: number;       // 1-4
  group: number;        // 1-18
  category: 
    | 'reactive-nonmetal'
    | 'noble-gas'
    | 'alkali-metal'
    | 'alkaline-earth-metal'
    | 'transition-metal'
    | 'post-transition-metal'
    | 'metalloid';
  shellConfig: number[]; // e.g. [2, 8, 18, 7] for Br
  subshells: SubshellBlock[];
  condensedNotation: string; // e.g. "[Ar] 3d¹⁰ 4s² 4p⁵"
  fullNotation: string;      // e.g. "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵"
  valenceElectrons: number;
}

export interface IonData {
  id: string;
  elementZ: number;       // Atomic number of base element
  symbol: string;         // Base element symbol e.g. "Sc"
  charge: number;         // e.g. +1, +2, +3, -1, -2
  chargeDisplay: string;  // e.g. "+", "2+", "3+", "-", "2-"
  speciesName: string;    // e.g. "Scandium(III) ion", "Bromide ion"
  totalElectrons: number;
  shellConfig: number[];  // Principal shell counts for the ion
  subshells: SubshellBlock[];
  condensedNotation: string;
  fullNotation: string;
  scerriNote?: string;    // Special note on 4s removal or electron arrangement
}

export interface Challenge {
  id: string;
  element: ElementData;
  isIon: boolean;
  ionData?: IonData;
  representation: RepresentationType; // Specific representation chosen randomly from setup
  promptQuestion: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;       // Hex or Tailwind class
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  totalAttempts: number;
}

export interface GameSettings {
  maxPeriod: DifficultyPeriod;
  allowedRepresentations: RepresentationType[]; // Representations afforded by setup
  speciesMode: SpeciesMode;
  showWrittenConfigWithBohr: boolean; // Helper aid: display 2,8,8 next to Bohr model
  showAtomicNumbersOnTable: boolean;  // Display Z numbers on periodic table
  timerEnabled: boolean;
  timerDurationSeconds: number;       // Default 20
  soundEnabled: boolean;
  challengesPerGame: number;          // 5, 10, or 0 (endless)
  numPlayers: number;                 // 1-4
}

export interface SubmissionFeedback {
  isCorrect: boolean;
  selectedElement?: ElementData;
  targetElement: ElementData;
  isIon: boolean;
  ionData?: IonData;
  pointsEarned: number;
  speedBonus: number;
  streakBonus: number;
  explanation: string;
}
