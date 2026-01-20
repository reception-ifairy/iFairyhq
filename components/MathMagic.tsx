import React, { useState, useEffect } from 'react';
import { Star, Trophy, Sparkles, RefreshCw, Zap } from 'lucide-react';

type MathQuestion = {
  num1: number;
  num2: number;
  operation: '+' | '-';
  answer: number;
  emoji: string;
};

const EMOJIS = ['🍎', '⭐', '🌈', '🦋', '🌸', '🐝', '🎈', '🍓', '🌻', '🐞'];

const generateQuestion = (level: 'easy' | 'medium' | 'hard'): MathQuestion => {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  
  if (level === 'easy') {
    // Addition 1-5
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    return { num1, num2, operation: '+', answer: num1 + num2, emoji };
  } else if (level === 'medium') {
    // Addition/Subtraction 1-10
    const operation = Math.random() > 0.5 ? '+' : '-';
    if (operation === '+') {
      const num1 = Math.floor(Math.random() * 6) + 1;
      const num2 = Math.floor(Math.random() * 6) + 1;
      return { num1, num2, operation, answer: num1 + num2, emoji };
    } else {
      const num1 = Math.floor(Math.random() * 8) + 3;
      const num2 = Math.floor(Math.random() * num1) + 1;
      return { num1, num2, operation, answer: num1 - num2, emoji };
    }
  } else {
    // Harder Addition/Subtraction up to 20
    const operation = Math.random() > 0.5 ? '+' : '-';
    if (operation === '+') {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      return { num1, num2, operation, answer: num1 + num2, emoji };
    } else {
      const num1 = Math.floor(Math.random() * 15) + 5;
      const num2 = Math.floor(Math.random() * num1) + 1;
      return { num1, num2, operation, answer: num1 - num2, emoji };
    }
  }
};

const generateOptions = (correctAnswer: number): number[] => {
  const options = [correctAnswer];
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 7) - 3;
    const option = correctAnswer + offset;
    if (option > 0 && option <= 20 && !options.includes(option)) {
      options.push(option);
    }
  }
  return options.sort(() => Math.random() - 0.5);
};

export const MathMagic: React.FC = () => {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion('easy'));
  const [options, setOptions] = useState<number[]>(() => generateOptions(question.answer));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAnswerClick = (answer: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setTotalAnswered(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      if (streak > 0 && (streak + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setStreak(0);
    }

    // Next question after delay
    setTimeout(() => {
      const newQuestion = generateQuestion(level);
      setQuestion(newQuestion);
      setOptions(generateOptions(newQuestion.answer));
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 1500);
  };

  const resetGame = () => {
    const newQuestion = generateQuestion(level);
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.answer));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setTotalAnswered(0);
  };

  const changeLevel = (newLevel: 'easy' | 'medium' | 'hard') => {
    setLevel(newLevel);
    const newQuestion = generateQuestion(newLevel);
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.answer));
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="glass border border-white/5 rounded-3xl p-6 space-y-6 relative overflow-hidden">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-4xl font-black text-white mb-2">Amazing!</h3>
            <p className="text-xl text-purple-200">5 in a row! 🎉</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-amber-400" size={28} />
            Math Magic
          </h3>
          <p className="text-purple-300/60 text-sm mt-1">Solve the magic number puzzles!</p>
        </div>
        <button
          onClick={resetGame}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-purple-300 hover:text-white group"
          title="New game"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Level Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => changeLevel('easy')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            level === 'easy'
              ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
              : 'bg-white/5 border border-white/10 text-purple-300/60 hover:bg-white/10'
          }`}
        >
          🌱 Easy
        </button>
        <button
          onClick={() => changeLevel('medium')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            level === 'medium'
              ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-300'
              : 'bg-white/5 border border-white/10 text-purple-300/60 hover:bg-white/10'
          }`}
        >
          ⭐ Medium
        </button>
        <button
          onClick={() => changeLevel('hard')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            level === 'hard'
              ? 'bg-purple-500/20 border-2 border-purple-500/50 text-purple-300'
              : 'bg-white/5 border border-white/10 text-purple-300/60 hover:bg-white/10'
          }`}
        >
          🚀 Hard
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
          <div className="text-2xl font-black text-purple-300">{score}</div>
          <div className="text-xs text-purple-400/60 uppercase tracking-wider font-bold">Score</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
          <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
            {streak} <Zap size={16} className="text-amber-400" />
          </div>
          <div className="text-xs text-amber-400/60 uppercase tracking-wider font-bold">Streak</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
          <div className="text-2xl font-black text-pink-300">{totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%</div>
          <div className="text-xs text-pink-400/60 uppercase tracking-wider font-bold">Accuracy</div>
        </div>
      </div>

      {/* Question Display */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-2xl border border-white/10 p-8">
        {/* Visual representation */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* First number */}
            <div className="flex flex-wrap gap-2 justify-center max-w-xs">
              {Array.from({ length: question.num1 }).map((_, i) => (
                <span key={`num1-${i}`} className="text-4xl animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  {question.emoji}
                </span>
              ))}
            </div>

            {/* Operation */}
            <div className="text-5xl font-black text-white">
              {question.operation}
            </div>

            {/* Second number */}
            <div className="flex flex-wrap gap-2 justify-center max-w-xs">
              {Array.from({ length: question.num2 }).map((_, i) => (
                <span key={`num2-${i}`} className="text-4xl animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  {question.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-center mb-6">
          <p className="text-4xl font-black text-white">
            {question.num1} {question.operation} {question.num2} = ?
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isTheCorrectAnswer = option === question.answer;
            const showResult = selectedAnswer !== null;

            let buttonClass = 'py-6 px-4 rounded-2xl text-3xl font-black transition-all duration-300 border-2 ';
            
            if (!showResult) {
              buttonClass += 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-105 hover:border-purple-500/30 active:scale-95';
            } else if (isSelected) {
              if (isCorrect) {
                buttonClass += 'bg-green-500/20 border-green-500/50 text-green-300 scale-105 animate-pulse';
              } else {
                buttonClass += 'bg-red-500/20 border-red-500/50 text-red-300';
              }
            } else if (showResult && isTheCorrectAnswer) {
              buttonClass += 'bg-green-500/10 border-green-500/30 text-green-400';
            } else {
              buttonClass += 'bg-white/5 border-white/10 text-white/30';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                {option}
                {showResult && isTheCorrectAnswer && (
                  <Star className="inline-block ml-2 text-yellow-400" size={24} />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isCorrect !== null && (
          <div className={`mt-6 text-center text-xl font-bold animate-fade-in ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}>
            {isCorrect ? (
              <span>✨ Brilliant! Well done! ✨</span>
            ) : (
              <span>🤔 Almost! The answer was {question.answer}</span>
            )}
          </div>
        )}
      </div>

      {/* Encouragement Messages */}
      <div className="text-center">
        {streak >= 3 && streak < 5 && (
          <p className="text-sm text-purple-300 animate-fade-in">
            🔥 You're on fire! Keep going!
          </p>
        )}
        {score >= 10 && (
          <p className="text-sm text-amber-300 animate-fade-in">
            🌟 You're a Math Star!
          </p>
        )}
      </div>
    </div>
  );
};
