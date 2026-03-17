import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Clock, Brain } from 'lucide-react';
import { Level, Puzzle, QuestionResult } from '../types/game';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { calculateQuestionIQ, getIQClassification } from '../utils/iqCalculator';
import { updateQuestionStats } from '../utils/localStorage';
import { getPuzzleExplanation } from '../utils/puzzleExplanations';
import PatternDisplay from './PatternDisplay';

interface PuzzleGameProps {
  level: Level;
  puzzleIndex: number;
  onAnswer: (result: QuestionResult) => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ level, puzzleIndex, onAnswer }) => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [questionIQ, setQuestionIQ] = useState<number>(0);
  const [pendingResult, setPendingResult] = useState<QuestionResult | null>(null);

  const advanceTimeoutRef = useRef<number | null>(null);
  const movedRef = useRef(false);

  useEffect(() => {
    const newPuzzle = generatePuzzle(level, puzzleIndex);
    setPuzzle(newPuzzle);
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(Date.now());
    setEndTime(0);
    setQuestionIQ(0);
    setPendingResult(null);
    movedRef.current = false;

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, [level, puzzleIndex]);

  const goToNext = () => {
    if (!pendingResult || movedRef.current) return;
    movedRef.current = true;
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    onAnswer(pendingResult);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !puzzle) return;

    const endTimeStamp = Date.now();
    setEndTime(endTimeStamp);

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === puzzle.correctAnswer;
    setIsCorrect(correct);

    const iq = calculateQuestionIQ(level, correct);
    setQuestionIQ(iq);

    updateQuestionStats(correct);
    setShowResult(true);

    const timeSpent = Math.round((endTimeStamp - startTime) / 1000);
    const result: QuestionResult = {
      level,
      questionIndex: puzzleIndex,
      correct,
      timeSpent,
      iq
    };

    setPendingResult(result);

    if (correct) {
      advanceTimeoutRef.current = window.setTimeout(() => {
        goToNext();
      }, 1800);
    }
  };

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const explanation = getPuzzleExplanation(level, puzzleIndex);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          What comes next in the pattern?
        </h2>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
          {puzzle.matrix.flat().map((pattern, index) => (
            <div
              key={index}
              className={`aspect-square border-2 rounded-lg flex items-center justify-center ${
                index === 8
                  ? 'border-dashed border-blue-300 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              {pattern && index !== 8 && <PatternDisplay pattern={pattern} size={80} />}
              {index === 8 && <div className="text-3xl text-blue-400 font-bold">?</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
          Choose the correct answer:
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          {puzzle.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`aspect-square border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : showResult && index === puzzle.correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="relative">
                <PatternDisplay pattern={option} size={80} />

                {showResult && selectedAnswer === index && (
                  <div className="absolute -top-2 -right-2">
                    {isCorrect ? (
                      <Check className="w-6 h-6 text-green-600 bg-white rounded-full p-1" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 bg-white rounded-full p-1" />
                    )}
                  </div>
                )}

                {showResult && index === puzzle.correctAnswer && selectedAnswer !== index && (
                  <div className="absolute -top-2 -right-2">
                    <Check className="w-6 h-6 text-green-600 bg-white rounded-full p-1" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 text-center space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Correct!</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  <span className="font-medium">Incorrect</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                <Brain className="w-4 h-4" />
                <span className="font-medium">IQ: {questionIQ}</span>
                <span className="text-xs">({getIQClassification(questionIQ)})</span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{Math.round((endTime - startTime) / 1000)}s</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-left rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 mb-1">解説</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">{explanation.title}</p>
              <p className="text-sm text-gray-700">規則: {explanation.rule}</p>
              <p className="text-sm text-gray-700">答えの見方: {explanation.answerHint}</p>
              {explanation.caution && (
                <p className="text-sm text-amber-700 mt-1">注意: {explanation.caution}</p>
              )}
            </div>

            {!isCorrect && (
              <p className="text-sm text-red-700 font-medium">不正解時は「次へ」を押すまでこの解説を表示します</p>
            )}

            <button
              onClick={goToNext}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame;
