import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ElementData, GameSettings, Player, SubmissionFeedback, Challenge } from './types/chemistry';
import { TopStatusBar } from './components/TopStatusBar';
import { ChallengeArea } from './components/ChallengeArea';
import { PeriodicTable } from './components/PeriodicTable';
import { FeedbackBanner } from './components/FeedbackBanner';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { WelcomeSetupScreen } from './components/WelcomeSetupScreen';
import { generateChallenge } from './utils/challengeGenerator';
import { soundEffects } from './utils/audio';
import { getUnicodeCharge } from './utils/chemistryFormat';

const INITIAL_SETTINGS: GameSettings = {
  maxPeriod: 3, // Level 2: Periods 1-3 by default
  allowedRepresentations: ['bohr_shell', 'written_shell'], // Afforded by default
  speciesMode: 'atoms_only',
  showWrittenConfigWithBohr: true,
  showAtomicNumbersOnTable: true,
  timerEnabled: true,
  timerDurationSeconds: 20,
  soundEnabled: true,
  challengesPerGame: 5, // PhET standard: 5 challenges per game
  numPlayers: 1,
};

const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player_1',
    name: 'Player 1',
    color: '#2563eb', // Blue
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    totalAttempts: 0,
  },
];

export default function App() {
  // Game screen state: welcome setup screen is shown first!
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');

  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(() => generateChallenge(INITIAL_SETTINGS));
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  // Challenge attempt state
  const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);
  const [hasTriedOnce, setHasTriedOnce] = useState(false);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(INITIAL_SETTINGS.timerDurationSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePlayer = players[activePlayerIndex] || players[0];

  // Start new challenge
  const startNewChallenge = useCallback(
    (customSettings?: GameSettings, prevZ?: number) => {
      const activeSettings = customSettings || settings;
      setSelectedElement(null);
      setFeedback(null);
      setHasTriedOnce(false);
      setTimeLeft(activeSettings.timerDurationSeconds);
      setIsTimerPaused(false);
      const nextCh = generateChallenge(activeSettings, prevZ);
      setChallenge(nextCh);
    },
    [settings]
  );

  // Timer countdown hook
  useEffect(() => {
    if (gameState !== 'playing' || !settings.timerEnabled || feedback !== null || isRoundOver || isTimerPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, settings.timerEnabled, feedback, isRoundOver, isTimerPaused, currentChallengeIndex]);

  // Handle element selection from Periodic Table
  const handleSelectElement = (element: ElementData) => {
    if (feedback?.isCorrect) return; // Prevent changing after correct submission
    soundEffects.playClick();
    setSelectedElement(element);
  };

  // Submit and verify answer (PhET Check button)
  const handleCheckAnswer = () => {
    if (!selectedElement) return;

    const isCorrect = selectedElement.atomicNumber === challenge.element.atomicNumber;
    const targetElement = challenge.element;

    if (isCorrect) {
      soundEffects.playPing();

      // Calculate speed bonus: up to +50 points if timer is enabled and answered fast
      let speedBonus = 0;
      if (settings.timerEnabled) {
        const ratio = Math.max(0, timeLeft / settings.timerDurationSeconds);
        speedBonus = Math.round(ratio * 50);
      }

      // Calculate streak bonus
      const currentStreak = activePlayer.streak + 1;
      let streakBonus = 0;
      if (currentStreak >= 5) streakBonus = 50;
      else if (currentStreak >= 3) streakBonus = 25;

      const basePoints = 100;
      const totalPoints = basePoints + speedBonus + streakBonus;

      // Build pedagogical explanation
      let explanation = '';
      if (challenge.isIon && challenge.ionData) {
        const uCharge = getUnicodeCharge(challenge.ionData.chargeDisplay);
        explanation = `Correct! ${challenge.ionData.speciesName} (${targetElement.symbol}${uCharge}) has ${challenge.ionData.totalElectrons} electrons and a ${uCharge} charge. Protons = ${challenge.ionData.totalElectrons} - (${challenge.ionData.charge}) = ${targetElement.atomicNumber}, which is ${targetElement.name} (${targetElement.symbol}) in Period ${targetElement.period}, Group ${targetElement.group}.`;
      } else {
        explanation = `Correct! ${targetElement.name} (${targetElement.symbol}, Z = ${targetElement.atomicNumber}) has ${targetElement.atomicNumber} protons and ${targetElement.atomicNumber} electrons. Occupied principal shells: ${targetElement.shellConfig.length} (Period ${targetElement.period}), valence electrons: ${targetElement.valenceElectrons} (Group ${targetElement.group}).`;
      }

      setFeedback({
        isCorrect: true,
        selectedElement,
        targetElement,
        isIon: challenge.isIon,
        ionData: challenge.ionData,
        pointsEarned: totalPoints,
        speedBonus,
        streakBonus,
        explanation,
      });

      // Update active player's stats
      setPlayers(prev =>
        prev.map((p, idx) => {
          if (idx !== activePlayerIndex) return p;
          const newStreak = p.streak + 1;
          return {
            ...p,
            score: p.score + totalPoints,
            streak: newStreak,
            bestStreak: Math.max(p.bestStreak, newStreak),
            correctCount: p.correctCount + 1,
            totalAttempts: p.totalAttempts + 1,
          };
        })
      );
    } else {
      // Incorrect choice
      soundEffects.playBoing();
      setHasTriedOnce(true);

      const explanation = `Not quite! You selected ${selectedElement.name} (${selectedElement.symbol}, Z = ${selectedElement.atomicNumber}). Look closely at the electron count and occupied shells on the left, then select the matching element on the periodic table.`;

      setFeedback({
        isCorrect: false,
        selectedElement,
        targetElement,
        isIon: challenge.isIon,
        ionData: challenge.ionData,
        pointsEarned: 0,
        speedBonus: 0,
        streakBonus: 0,
        explanation,
      });

      // Reset streak for active player
      setPlayers(prev =>
        prev.map((p, idx) => {
          if (idx !== activePlayerIndex) return p;
          return {
            ...p,
            streak: 0,
            totalAttempts: p.totalAttempts + 1,
          };
        })
      );
    }
  };

  // Next challenge or complete round
  const handleNextChallenge = () => {
    const nextIdx = currentChallengeIndex + 1;

    // Check if round is finished (e.g. 5 or 10 challenges)
    if (settings.challengesPerGame > 0 && nextIdx >= settings.challengesPerGame) {
      soundEffects.playFanfare();
      setIsRoundOver(true);
      return;
    }

    setCurrentChallengeIndex(nextIdx);

    // If multiplayer, advance turn to next player
    if (settings.numPlayers > 1) {
      setActivePlayerIndex((activePlayerIndex + 1) % settings.numPlayers);
    }

    startNewChallenge(settings, challenge.element.atomicNumber);
  };

  // Try again on incorrect answer
  const handleTryAgain = () => {
    setFeedback(null);
  };

  // Reveal correct answer and continue
  const handleRevealAnswer = () => {
    setSelectedElement(challenge.element);
    handleNextChallenge();
  };

  // Start Over full game
  const handleStartOver = () => {
    soundEffects.playClick();
    setCurrentChallengeIndex(0);
    setActivePlayerIndex(0);
    setIsRoundOver(false);
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctCount: 0,
        totalAttempts: 0,
      }))
    );
    startNewChallenge(settings);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const newMuted = !soundEffects.isMuted();
    soundEffects.setMuted(newMuted);
    setSettings(prev => ({ ...prev, soundEnabled: !newMuted }));
  };

  // Start game from welcome setup screen
  const handleStartGameFromSetup = (newSettings: GameSettings, newPlayers: Player[]) => {
    setSettings(newSettings);
    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setCurrentChallengeIndex(0);
    setIsRoundOver(false);
    startNewChallenge(newSettings);
    setGameState('playing');
  };

  // Save new settings from modal
  const handleSaveSettings = (newSettings: GameSettings, newPlayers?: Player[]) => {
    setSettings(newSettings);
    if (newPlayers) {
      setPlayers(newPlayers);
      if (activePlayerIndex >= newPlayers.length) {
        setActivePlayerIndex(0);
      }
    }
    setCurrentChallengeIndex(0);
    setIsRoundOver(false);
    startNewChallenge(newSettings);
  };

  // Return to welcome setup
  const handleReturnToWelcome = () => {
    setGameState('welcome');
    setIsRoundOver(false);
  };

  // If in welcome screen, render WelcomeSetupScreen
  if (gameState === 'welcome') {
    return (
      <WelcomeSetupScreen
        initialSettings={settings}
        initialPlayers={players}
        onStartGame={handleStartGameFromSetup}
      />
    );
  }

  const isCheckDisabled = !selectedElement || (feedback !== null && feedback.isCorrect);

  return (
    <div className="min-h-screen bg-[#faf8ee] text-gray-900 flex flex-col font-sans select-none antialiased">
      {/* Top PhET Navigation and Status Bar */}
      <TopStatusBar
        currentChallengeIndex={currentChallengeIndex}
        totalChallenges={settings.challengesPerGame}
        activePlayer={activePlayer}
        players={players}
        settings={settings}
        timeLeft={timeLeft}
        isTimerPaused={isTimerPaused}
        onToggleTimerPause={() => setIsTimerPaused(!isTimerPaused)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartOver={handleStartOver}
        onToggleSound={handleToggleSound}
        isMuted={soundEffects.isMuted()}
      />

      {/* Main Educational Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-between gap-4">
        {/* Two-Column Core Layout: Atomic Structure on Left, Periodic Table on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* Left Side: Atomic representation challenge (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col min-h-[420px]">
            <ChallengeArea challenge={challenge} settings={settings} />
          </div>

          {/* Right Side: Periodic Table element selection (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#fffef5] border-2 border-gray-800 rounded-2xl p-3 sm:p-5 shadow-sm">
            <PeriodicTable
              selectedZ={selectedElement ? selectedElement.atomicNumber : null}
              onSelectElement={handleSelectElement}
              maxPeriod={settings.maxPeriod}
              showAtomicNumbers={settings.showAtomicNumbersOnTable}
              disabled={feedback?.isCorrect}
            />

            {/* Bottom check button area (when no feedback is showing) */}
            {!feedback && (
              <div className="flex flex-col items-center justify-center pt-4 mt-auto">
                {selectedElement && (
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    Selected Element:{' '}
                    <span className="font-extrabold text-blue-900 text-sm">
                      {selectedElement.name} ({selectedElement.symbol}, Z={selectedElement.atomicNumber})
                    </span>
                  </div>
                )}

                {/* PhET Styled Check Button */}
                <button
                  type="button"
                  disabled={isCheckDisabled}
                  onClick={handleCheckAnswer}
                  className={`px-10 py-3 rounded-xl font-black text-base uppercase tracking-wider transition-all duration-150 shadow-md ${
                    isCheckDisabled
                      ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-200 hover:to-yellow-300 text-gray-900 border-2 border-gray-800 active:scale-95 cursor-pointer ring-2 ring-yellow-400/50'
                  }`}
                >
                  Check
                </button>
              </div>
            )}

            {/* In-place Feedback Banner after submission */}
            {feedback && (
              <div className="mt-4">
                <FeedbackBanner
                  feedback={feedback}
                  onNextChallenge={handleNextChallenge}
                  onTryAgain={handleTryAgain}
                  onRevealAnswer={handleRevealAnswer}
                  hasTriedOnce={hasTriedOnce}
                  isLastChallenge={
                    settings.challengesPerGame > 0 &&
                    currentChallengeIndex + 1 >= settings.challengesPerGame
                  }
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Return to Setup Link */}
      <footer className="w-full bg-[#f0ece1] border-t border-gray-300 px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={handleReturnToWelcome}
          className="hover:text-blue-900 font-semibold hover:underline cursor-pointer"
        >
          ← Setup
        </button>
      </footer>

      {/* Settings / Options Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onReturnToWelcome={handleReturnToWelcome}
        players={players}
      />

      {/* Game Over / Results Modal */}
      <GameOverModal
        isOpen={isRoundOver}
        players={players}
        settings={settings}
        onPlayAgain={handleStartOver}
        onOpenSettings={handleReturnToWelcome}
      />
    </div>
  );
}
