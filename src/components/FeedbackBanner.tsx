import React from 'react';
import { ArrowRight, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';
import { SubmissionFeedback } from '../types/chemistry';

interface FeedbackBannerProps {
  feedback: SubmissionFeedback;
  onNextChallenge: () => void;
  onTryAgain: () => void;
  onRevealAnswer: () => void;
  hasTriedOnce: boolean;
  isLastChallenge: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  feedback,
  onNextChallenge,
  onTryAgain,
  onRevealAnswer,
  hasTriedOnce,
  isLastChallenge,
}) => {
  const { isCorrect, pointsEarned, speedBonus, streakBonus, explanation, targetElement } = feedback;

  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-xl border-2 p-4 sm:p-5 shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200 ${
        isCorrect
          ? 'bg-emerald-50/95 border-emerald-500 text-emerald-950'
          : 'bg-amber-50/95 border-amber-500 text-amber-950'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Big PhET celebratory icon / smiling face */}
        <div className="shrink-0 flex items-center justify-center">
          {isCorrect ? (
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-3xl shadow-xs">
              😊
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-xs">
              🤔
            </div>
          )}
        </div>

        {/* Text details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="text-xl font-black tracking-tight">
              {isCorrect ? 'Excellent! Correct Answer!' : 'Not quite right yet!'}
            </h3>

            {isCorrect && (
              <div className="flex items-center gap-1.5 text-xs font-bold bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full">
                <span>+{pointsEarned} pts</span>
                {speedBonus > 0 && <span className="text-emerald-700 font-semibold">(+{speedBonus} speed)</span>}
                {streakBonus > 0 && <span className="text-emerald-700 font-semibold">(+{streakBonus} streak)</span>}
              </div>
            )}
          </div>

          <p className="text-sm font-medium leading-relaxed mt-1 text-gray-800">
            {explanation}
          </p>

          {!isCorrect && (
            <div className="mt-2 text-xs text-amber-900 bg-amber-100/70 border border-amber-300 rounded px-2.5 py-1">
              💡 <strong>Hint:</strong> Total electrons in this representation ={' '}
              {feedback.isIon && feedback.ionData ? feedback.ionData.totalElectrons : targetElement.atomicNumber}.
              {feedback.isIon && feedback.ionData && (
                <span>
                  {' '}With charge <sup className="font-bold font-mono text-sm">{feedback.ionData.chargeDisplay}</sup>, protons ={' '}
                  {feedback.ionData.totalElectrons} - ({feedback.ionData.charge}) = {targetElement.atomicNumber}.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0 shrink-0">
          {isCorrect ? (
            <button
              onClick={onNextChallenge}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition"
            >
              <span>{isLastChallenge ? 'See Final Results' : 'Next Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={onTryAgain}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              {hasTriedOnce && (
                <button
                  onClick={onRevealAnswer}
                  className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                  <span>Reveal &amp; Continue</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
