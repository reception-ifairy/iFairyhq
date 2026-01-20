import React from 'react';
import { PageShell } from './PageShell';
import { MathMagic } from '../components/MathMagic';

export const MathPage: React.FC = () => {
  return (
    <PageShell
      title="Math Magic"
      subtitle="Practice numbers with fun puzzles and games designed for young learners"
    >
      <div className="space-y-12">
        <MathMagic />

        {/* Learning Tips */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Start Easy</h3>
            <p className="text-purple-300/60 text-sm">
              Begin with simple addition problems with numbers 1-5. Build confidence with visual counting.
            </p>
          </div>

          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build Streaks</h3>
            <p className="text-purple-300/60 text-sm">
              Get 5 correct answers in a row to unlock special celebrations! Track your progress.
            </p>
          </div>

          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Level Up</h3>
            <p className="text-purple-300/60 text-sm">
              When you're ready, try medium and hard levels with bigger numbers and subtraction!
            </p>
          </div>
        </div>

        {/* What Children Learn */}
        <div className="glass border border-white/5 rounded-2xl p-8">
          <h3 className="text-2xl font-black text-white mb-6 text-center">What Children Learn</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔢</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Number Recognition</h4>
                  <p className="text-purple-300/60 text-sm">Identify and understand numbers 1-20</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">➕</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Addition Skills</h4>
                  <p className="text-purple-300/60 text-sm">Learn to add numbers with visual support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">➖</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Subtraction Basics</h4>
                  <p className="text-purple-300/60 text-sm">Understand taking away with friendly examples</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👁️</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Visual Learning</h4>
                  <p className="text-purple-300/60 text-sm">Count objects using colorful emojis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Problem Solving</h4>
                  <p className="text-purple-300/60 text-sm">Develop logical thinking and decision making</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💪</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Confidence Building</h4>
                  <p className="text-purple-300/60 text-sm">Positive feedback and celebration of success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Parents */}
        <div className="glass border border-purple-500/20 rounded-2xl p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧</span>
            Tips for Parents & Teachers
          </h3>
          <ul className="space-y-2 text-purple-200/80 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Let children work at their own pace - there's no time pressure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Encourage counting the emoji objects to understand the visual representation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Celebrate mistakes as learning opportunities - discuss the correct answer together</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Track progress over time and celebrate when they level up</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Use the different emojis to make connections with real-world counting</span>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
};
