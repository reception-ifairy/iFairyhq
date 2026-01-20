import React from 'react';
import type { AppConfig } from '../appConfig';
import { PageShell } from './PageShell';

type Props = { config: AppConfig };

export const AboutPage: React.FC<Props> = ({ config }) => {
  const about = config.frontpage.about;

  return (
    <PageShell
      title={
        <>
          About <span className="text-purple-400 italic font-serif">iFairy</span>
        </>
      }
      subtitle="A movement for ethical, curriculum-aligned home-learning — crafted with narrative inquiry and safeguarding first."
      sections={[
        { id: 'intro', label: 'Intro' },
        { id: 'about', label: 'Manifesto' },
        { id: 'mission', label: 'Mission' },
      ]}
    >
      <div className="glass p-10 rounded-[3rem] border border-white/5">
        <div className="text-[10px] font-black tracking-[0.8em] uppercase text-purple-700 mb-8">{about.eyebrow}</div>
        <div className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
          {about.headingLine1}{' '}
          <span className="italic font-serif text-purple-500 text-glow">{about.headingEmphasis}</span>
        </div>

        <div className="mt-10 text-xl md:text-2xl text-white/30 font-light leading-relaxed">
          {about.description}
        </div>

        <div className="mt-12 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
          <div className="text-[10px] font-black tracking-[0.6em] uppercase text-white/20 mb-6">Manifesto</div>
          <div className="text-2xl md:text-4xl font-serif text-purple-100/90 leading-tight">
            {about.quote.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          {about.features.slice(0, 4).map((f, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/20 transition-all card-light shine-effect">
              <div className="text-white font-black text-2xl mb-4">{f.title}</div>
              <div className="text-white/30 leading-relaxed">{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

