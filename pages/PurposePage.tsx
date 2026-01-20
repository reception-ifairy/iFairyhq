import React from 'react';
import type { AppConfig } from '../appConfig';
import { PageShell } from './PageShell';

type Props = { config: AppConfig };

export const PurposePage: React.FC<Props> = ({ config }) => {
  const purpose = config.frontpage.purpose;

  return (
    <PageShell
      title={
        <>
          Purpose <span className="text-purple-400 italic font-serif">The Root</span>
        </>
      }
      subtitle="Why we exist: equal access to knowledge, safeguarded for home-learning families."
      sections={[
        { id: 'purpose', label: 'Purpose section' },
        { id: 'about', label: 'Manifesto' },
      ]}
    >
      <div className="glass p-10 rounded-[3rem] border border-white/5">
        <div className="inline-flex items-center gap-4 px-6 py-2 mb-10 border border-white/5 rounded-full bg-white/[0.02] backdrop-blur-3xl shadow-xl">
          <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_15px_#ea580c]"></div>
          <span className="text-[10px] font-black tracking-[0.5em] text-purple-400 uppercase">{purpose.pillText}</span>
        </div>

        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
          {purpose.headingLine1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-white to-purple-900 animate-gradient-x text-glow">
            {purpose.headingEmphasis}
          </span>
        </div>

        <div className="mt-10 space-y-8 text-white/40 text-lg md:text-xl leading-relaxed font-light max-w-4xl">
          <p className="font-serif italic text-white/90">{purpose.quote}</p>
          <p>{purpose.description}</p>
        </div>
      </div>
    </PageShell>
  );
};

