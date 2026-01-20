import React from 'react';
import type { AppConfig } from '../appConfig';
import { PageShell } from './PageShell';
import { ArrowRight } from 'lucide-react';

type Props = { config: AppConfig };

export const MissionPage: React.FC<Props> = ({ config }) => {
  const mission = config.frontpage.mission;

  return (
    <PageShell
      title={
        <>
          Mission <span className="text-purple-400 italic font-serif">Statement</span>
        </>
      }
      subtitle={mission.description}
      sections={[
        { id: 'mission', label: 'Mission section' },
        { id: 'archive', label: 'Curriculum archive' },
      ]}
    >
      <div className="glass p-10 rounded-[3rem] border border-white/5">
        <div className="text-[10px] font-black tracking-[1em] uppercase text-purple-700 mb-10">{mission.eyebrow}</div>
        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-10">
          {mission.headingLine1}{' '}
          <span className="text-purple-400 italic font-serif text-glow">{mission.headingEmphasis}</span>
        </div>

        <a
          href={mission.primaryCtaHref}
          className="group inline-flex items-center gap-4 bg-white text-black px-14 py-7 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-700 shadow-3xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          {mission.primaryCtaLabel} <ArrowRight size={20} className="text-black group-hover:translate-x-2 transition-transform duration-500" />
        </a>
      </div>
    </PageShell>
  );
};

