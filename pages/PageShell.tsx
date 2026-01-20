import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { aboutMenu, primaryNav } from '../siteNav';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  sections?: { id: string; label: string }[];
};

export const PageShell: React.FC<Props> = ({ title, subtitle, children, sections }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const jumpToSection = async (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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

          <div className="hidden md:flex items-center gap-10 text-[9px] font-black tracking-[0.3em] uppercase">
            {primaryNav
              .filter((l) => l.to !== '/admin')
              .map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`transition-all ${location.pathname === l.to ? 'text-white' : 'text-purple-400/30 hover:text-white'}`}
                >
                  {l.label}
                </Link>
              ))}

            <div className="relative">
              <button
                onClick={() => setAboutOpen((v) => !v)}
                className="flex items-center gap-2 text-purple-400/30 hover:text-white transition-all"
              >
                About <ChevronDown size={12} className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute top-full mt-6 right-0 w-56 glass border border-white/5 rounded-3xl p-3 transition-all duration-300 shadow-3xl ${
                  aboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
              >
                {aboutMenu.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    onClick={() => setAboutOpen(false)}
                    className="block px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black tracking-widest text-purple-200 transition-colors"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/admin"
              className={`transition-all ${location.pathname.startsWith('/admin') ? 'text-white' : 'text-purple-400/30 hover:text-white'}`}
            >
              Admin
            </Link>
            {sections?.length ? (
              <div className="relative">
                <button
                  onClick={() => setSectionsOpen((v) => !v)}
                  className="flex items-center gap-2 text-purple-400/30 hover:text-white transition-all"
                >
                  Sections <ChevronDown size={12} className={`transition-transform ${sectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`absolute top-full mt-6 right-0 w-56 glass border border-white/5 rounded-3xl p-3 transition-all duration-300 shadow-3xl ${
                    sectionsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                  }`}
                >
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSectionsOpen(false);
                        jumpToSection(s.id);
                      }}
                      className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black tracking-widest text-purple-200 transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
              <div className="pt-2">
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
              {sections?.length ? (
                <div className="pt-2">
                  <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/20">Sections</div>
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setMobileOpen(false);
                        jumpToSection(s.id);
                      }}
                      className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              ) : null}
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
