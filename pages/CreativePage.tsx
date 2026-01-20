import React from 'react';
import { PageShell } from './PageShell';
import { CreativeCanvas } from '../components/CreativeCanvas';

export const CreativePage: React.FC = () => {
  return (
    <PageShell
      title="Creative Studio"
      subtitle="Unleash your imagination with our magic drawing tools"
    >
      <div className="space-y-12">
        <CreativeCanvas />

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Infinite Canvas</h3>
            <p className="text-purple-300/60 text-sm">
              Express yourself with unlimited colors and brush sizes. Your creativity has no limits.
            </p>
          </div>

          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Magic Effects</h3>
            <p className="text-purple-300/60 text-sm">
              Watch your drawings come alive with sparkles and glowing effects as you create.
            </p>
          </div>

          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Analysis</h3>
            <p className="text-purple-300/60 text-sm">
              Get instant feedback and creative insights about your artwork from our AI.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
