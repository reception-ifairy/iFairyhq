import React, { useState } from 'react';
import type { AppConfig } from '../appConfig';
import { PageShell } from './PageShell';
import { curriculumKeys } from '../curriculumData';
import { X } from 'lucide-react';

type Props = { config: AppConfig };

export const CurriculumPage: React.FC<Props> = ({ config }) => {
  const archive = config.frontpage.archive;
  const [selected, setSelected] = useState<number | null>(null);
  const SelectedIcon = selected !== null ? curriculumKeys[selected].icon : null;

  return (
    <PageShell
      title={
        <>
          Curriculum <span className="text-emerald-400 italic font-serif">Keys</span>
        </>
      }
      subtitle={archive.description}
      sections={[
        { id: 'archive', label: 'Archive' },
        { id: 'vision', label: 'Vision' },
      ]}
    >
      <div className="glass p-10 rounded-[3rem] border border-white/5">
        <div className="text-[10px] font-black tracking-[1em] uppercase text-emerald-800 mb-10">{archive.eyebrow}</div>
        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-10">
          {archive.headingLine1} <span className="text-emerald-500 italic font-serif">{archive.headingEmphasis}</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {curriculumKeys.map((key, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`group glass p-10 rounded-[3rem] border border-white/5 hover:border-emerald-500/20 transition-all duration-700 cursor-pointer shadow-3xl flex flex-col items-center ${key.glow} card-light`}
            >
              <div className={`w-20 h-20 glass rounded-3xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform ${key.color}`}>
                <key.icon size={36} />
              </div>
              <div className="text-xl font-black text-white mb-2">{key.title}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40 mb-6">{key.era}</div>
              <div className="text-white/30 text-sm text-center leading-relaxed">{key.focus}</div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[120] bg-[#020204]/98 backdrop-blur-3xl flex items-center justify-center p-6 transition-all duration-300 ${
          selected !== null ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 pointer-events-none'
        }`}
      >
        {selected !== null ? (
          <div className="max-w-3xl w-full glass p-10 rounded-[3rem] border border-white/5 shadow-3xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-12 h-12 glass rounded-full flex items-center justify-center border border-white/5 text-white/20 hover:text-white transition-all"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 glass rounded-2xl flex items-center justify-center border border-white/5 ${curriculumKeys[selected].color}`}>
                {SelectedIcon ? <SelectedIcon size={28} /> : null}
              </div>
              <div>
                <div className="text-2xl font-black text-white">{curriculumKeys[selected].title}</div>
                <div className="text-white/30">{curriculumKeys[selected].era} • {curriculumKeys[selected].focus}</div>
              </div>
            </div>
            <div className="mt-8 text-white/40 leading-relaxed text-lg">{curriculumKeys[selected].desc}</div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};
