import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { aboutMenu, primaryNav } from '../siteNav';
import { PageNavigation } from '../components/PageNavigation';
import { SectionNavigation } from '../components/SectionNavigation';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  sections?: { id: string; label: string }[];
};

export const PageShell: React.FC<Props> = ({ title, subtitle, children, sections }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-[#010103] text-purple-100 overflow-x-hidden min-h-screen relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <nav className="fixed w-full z-[80] bg-[#010103]/85 backdrop-blur-3xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-950 to-[#010103] rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
              <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.6)]"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-white leading-none">iFairy</span>
              <span className="text-[8px] font-black tracking-[0.6em] uppercase text-purple-700">Studio</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <PageNavigation />
            <div className="w-px h-8 bg-white/5"></div>
            <SectionNavigation sections={sections} />
          </div>

          <button className="md:hidden text-purple-400 p-2" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[75] md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="absolute top-20 left-0 right-0 px-6" onClick={(e) => e.stopPropagation()}>
            <div className="glass border border-white/5 rounded-[2.5rem] p-4 space-y-2 shadow-3xl">
              <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-purple-400/40">Main Menu</div>
              {primaryNav.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-purple-500/20 transition-all"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5 mt-2">
                <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/20">About</div>
                {aboutMenu.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24">
        <div className="mb-14">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{title}</h1>
          {subtitle ? <div className="text-white/30 mt-6 text-lg md:text-xl leading-relaxed max-w-3xl">{subtitle}</div> : null}
        </div>
        {children}
      </div>
    </div>
  );
};
