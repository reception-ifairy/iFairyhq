import React from 'react';
import type { AppConfig } from '../appConfig';
import { PageShell } from './PageShell';

type Props = { config: AppConfig };

export const VisionPage: React.FC<Props> = ({ config }) => {
  const vision = config.frontpage.vision;

  return (
    <PageShell
      title={
        <>
          Vision <span className="text-purple-400 italic font-serif">Blueprint</span>
        </>
      }
      subtitle={vision.description}
      sections={[
        { id: 'vision', label: 'Vision section' },
        { id: 'mission', label: 'Mission section' },
      ]}
    >
      <div className="glass p-10 rounded-[3rem] border border-white/5">
        <div className="text-[10px] font-black tracking-[1em] uppercase text-purple-700 mb-10">{vision.eyebrow}</div>
        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-10">
          {vision.headingLine1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-purple-500 animate-gradient-x italic font-serif text-glow">
            {vision.headingEmphasis}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {vision.bullets.slice(0, 6).map((b, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/20 transition-all">
              <div className="text-white/60 leading-relaxed">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

