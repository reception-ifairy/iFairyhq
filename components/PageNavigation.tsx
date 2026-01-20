import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { aboutMenu, primaryNav } from '../siteNav';

export const PageNavigation: React.FC = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex items-center gap-10 text-[9px] font-black tracking-[0.3em] uppercase">
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
    </div>
  );
};
