
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Scroll, 
  Menu, 
  X, 
  ChevronDown,
  Globe,
  ArrowRight,
  MessageCircle,
  Send,
  Loader2,
  ShieldCheck,
  Music,
  Palette,
  Brain,
  Rocket,
  ShieldAlert,
  Stars,
  Heart,
  ChevronRight,
  Youtube,
  Image as ImageIcon,
  Lock,
  Search,
  BookOpen,
  Cpu,
  Mail,
  Users,
  Award,
  BookMarked,
  HelpCircle,
  Flame,
  Leaf,
  Scale,
  FileText,
  Download,
  Library
} from 'lucide-react';
import { Section, ChatMessage } from './types';
import { callArcaneCore, weaveDream } from './services/geminiService';
import { getGeminiApiKey, loadAppConfig, saveAppConfig, APP_CONFIG_STORAGE_KEY, type AppConfig } from './appConfig';
import { Link, useLocation } from 'react-router-dom';
import { AdminApp } from './admin/AdminApp';
import { AboutPage } from './pages/AboutPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { VisionPage } from './pages/VisionPage';
import { MissionPage } from './pages/MissionPage';
import { PurposePage } from './pages/PurposePage';
import { curriculumKeys } from './curriculumData';
import { aboutMenu } from './siteNav';

const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>(() => loadAppConfig());
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === APP_CONFIG_STORAGE_KEY) setAppConfig(loadAppConfig());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const frontpage = appConfig.frontpage;
  const canUseAi = Boolean(getGeminiApiKey(appConfig));

  const navSections = useMemo(
    () =>
      Object.values(Section).filter((id) => {
        const sectionCfg = (frontpage as any)[id];
        return sectionCfg ? sectionCfg.enabled !== false : true;
      }),
    [frontpage]
  );

  const navLabel = (s: Section) =>
    s === Section.Intro
      ? 'The Frontier'
      : s === Section.Purpose
        ? 'The Root'
        : s === Section.About
          ? 'Manifesto'
          : s === Section.Archive
            ? 'Curriculum'
            : s === Section.Vision
              ? 'Vision'
              : 'Mission';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(Section.Intro);
  
  // --- UI STATE ---
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  // --- AI STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Greetings, seeker of knowledge. I am the Lighthouse Guide. How can I illuminate your home-learning path today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [supportTab, setSupportTab] = useState<'chat' | 'faq'>('faq');

  // --- GENERATOR STATE ---
  const [dreamInput, setDreamInput] = useState('');
  const [dreamEra, setDreamEra] = useState('Year 2');
  const [dreamDomain, setDreamDomain] = useState('Science');
  const [dreamResult, setDreamResult] = useState('');
  const [isDreamLoading, setIsDreamLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const eras = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
  const domains = [
    { name: 'Science', icon: Leaf, color: 'text-emerald-400' },
    { name: 'Drama', icon: Music, color: 'text-pink-400' },
    { name: 'Ethics', icon: Scale, color: 'text-amber-400' },
    { name: 'History', icon: Scroll, color: 'text-orange-400' },
    { name: 'Polish', icon: BookMarked, color: 'text-rose-400' },
    { name: 'Computing', icon: Cpu, color: 'text-sky-400' }
  ];

  const faqs = [
    { q: "Is this aligned with the UK National Curriculum?", a: "Precisely. Every Academy Spirit is tuned to the specific standards of Key Stages 1-4." },
    { q: "How is the learning personalized?", a: "Our adaptive guardians sense the emotional state and pace of the child, adjusting the magical narrative in real-time." },
    { q: "What is the AUREN Safety Core?", a: "It is our ethical bedrock—a lighthouse of safeguarding that filters every interaction for child safety." },
    { q: "Do you collect data on my child?", a: "Never. We believe in ethical AI. We do not ask for or store names, ages, or any identifying child data." }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) setIsAboutOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navSections;
      let currentSection = activeSection;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, isAdminRoute, navSections]);

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  // Handle background scroll lock
  useEffect(() => {
    if (isCurriculumOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isCurriculumOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const processChat = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    if (!canUseAi) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'model', text: 'AI is disabled (missing Gemini API key). Open /admin to configure it.' },
      ]);
      return;
    }
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setIsChatLoading(true);
    setSupportTab('chat');
    
    const historyForAPI = chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const aiMsg = await callArcaneCore(text, historyForAPI);
    
    if (aiMsg === "AUTH_REQUIRED") {
      setIsChatLoading(false);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Authorization required. Set Gemini API key in /admin.' }]);
      return;
    }

    setChatHistory(prev => [...prev, { role: 'model', text: aiMsg }]);
    setIsChatLoading(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = chatInput;
    setChatInput('');
    processChat(val);
  };

  const handleDreamGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamInput.trim() || isDreamLoading) return;
    if (!canUseAi) {
      setDreamResult('AI is disabled (missing Gemini API key). Open /admin to configure it.');
      return;
    }
    setIsDreamLoading(true);
    setDreamResult('');
    const result = await weaveDream(dreamInput, dreamEra, dreamDomain);
    
    if (result === "AUTH_REQUIRED") {
      setIsDreamLoading(false);
      setDreamResult('Authorization required. Set Gemini API key in /admin.');
      return;
    }

    setDreamResult(result);
    setIsDreamLoading(false);
  };

  if (isAdminRoute) return <AdminApp />;

  if (pathname === '/about') return <AboutPage config={appConfig} />;

  if (pathname === '/curriculum') return <CurriculumPage config={appConfig} />;

  if (pathname === '/purpose') return <PurposePage config={appConfig} />;

  if (pathname === '/vision') return <VisionPage config={appConfig} />;

  if (pathname === '/mission') return <MissionPage config={appConfig} />;

  return (
    <div className="bg-[#010103] text-purple-100 selection:bg-purple-900 selection:text-white overflow-x-hidden min-h-screen relative font-sans scroll-smooth">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Navigation */}
      <nav className={`fixed w-full z-[80] transition-all duration-700 ${isScrolled ? 'bg-[#010103]/90 backdrop-blur-3xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-4 cursor-pointer group" onClick={() => scrollToSection(Section.Intro)}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-950 to-[#010103] rounded-2xl flex items-center justify-center border border-purple-500/20 animate-glow-pulse group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="text-pink-400 w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-white leading-none">iFairy</span>
                <span className="text-[8px] font-black tracking-[0.6em] uppercase text-purple-700">Studio</span>
              </div>
           </div>

          <div className="hidden md:flex gap-12 items-center">
            <div className="flex gap-10 text-[9px] font-black tracking-[0.3em] uppercase">
                <div className="relative" ref={aboutRef}>
                  <button
                    onClick={() => setIsAboutOpen(!isAboutOpen)}
                    className="flex items-center gap-1 text-purple-400/20 hover:text-white transition-all"
                  >
                    About <ChevronDown size={10} className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full mt-6 -right-4 w-56 glass border border-white/5 rounded-3xl p-3 transition-all duration-500 shadow-3xl ${isAboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    {aboutMenu.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsAboutOpen(false)}
                        className="block px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black tracking-widest text-purple-200 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/curriculum" className="text-purple-400/20 hover:text-white transition-all">Curriculum</Link>
                {navSections.map(s => (
                  <button 
                    key={s} 
                    onClick={() => scrollToSection(s)} 
                    className={`transition-all duration-300 ${activeSection === s ? 'text-white' : 'text-purple-400/20 hover:text-purple-400'}`}
                  >
                    {navLabel(s)}
                  </button>
                ))}
                
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 text-purple-400/20 hover:text-white transition-all"
                  >
                    Portals <ChevronDown size={10} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full mt-6 -right-4 w-64 glass border border-white/5 rounded-3xl p-3 transition-all duration-500 shadow-3xl ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                     {[
                       { icon: BookMarked, label: 'Archive of Keys', color: 'text-emerald-500', action: () => scrollToSection(Section.Archive) },
                       { icon: Scroll, label: 'Curriculum Page', color: 'text-emerald-400', action: () => { window.location.href = '/curriculum'; } },
                       { icon: Library, label: 'About Page', color: 'text-purple-400', action: () => { window.location.href = '/about'; } },
                       { icon: Youtube, label: 'YouTube Lab', color: 'text-red-500', action: () => {} },
                       { icon: Rocket, label: 'Academy Alpha', color: 'text-sky-500', action: () => {} },
                       { icon: ShieldAlert, label: 'Safeguarding Portal', color: 'text-amber-500', action: () => {} }
                     ].map((p, i) => (
                       <button key={i} onClick={p.action} className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black tracking-widest text-purple-200 transition-colors flex items-center gap-4">
                          <p.icon size={16} className={p.color}/> {p.label}
                       </button>
                     ))}
                  </div>
                </div>
            </div>

            <button onClick={() => { setIsChatOpen(true); setSupportTab('chat'); }} className="px-8 py-3 bg-purple-950/20 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-purple-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500">
               Request Briefing
            </button>
          </div>
          
          <button className="md:hidden text-purple-400 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV MENU */}
      <div className={`fixed inset-0 z-[75] md:hidden transition-all ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className="absolute top-24 left-0 right-0 px-6" onClick={(e) => e.stopPropagation()}>
          <div className="glass border border-white/5 rounded-[2.5rem] p-4 space-y-2 shadow-3xl">
            <Link
              to="/curriculum"
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-purple-500/20 transition-all"
            >
              Curriculum
            </Link>
            <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/20">About</div>
            {aboutMenu.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/20">Sections</div>
            {navSections.map((s) => (
              <button
                key={s}
                onClick={() => scrollToSection(s)}
                className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all"
              >
                {navLabel(s)}
              </button>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-purple-500/20 transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* INTRO SECTION */}
      {frontpage.intro.enabled && (
        <section
          id="intro"
          className="min-h-screen relative flex flex-col items-center justify-center px-6 pt-48 pb-24 overflow-hidden bg-gradient-to-b from-[#010103] via-[#05020a] to-[#010103]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.05)_0%,_transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto w-full relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-4 px-8 py-3 mb-12 border border-purple-500/20 rounded-full bg-purple-950/10 backdrop-blur-3xl animate-fade-up">
              <Award size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.5em] text-white uppercase italic">{frontpage.intro.badgeText}</span>
            </div>
            <h1 className="text-6xl md:text-[10rem] font-black text-white mb-10 tracking-tighter leading-none animate-fade-up drop-shadow-[0_0_40px_rgba(0,0,0,1)]">
              {frontpage.intro.headingLine1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-purple-500 animate-gradient-x italic font-serif text-glow">
                {frontpage.intro.headingEmphasis}
              </span>{' '}
              <br />
              {frontpage.intro.headingLine2}{' '}
              <span className="text-purple-400">{frontpage.intro.headingAccent}</span>
            </h1>
            <p
              className="text-xl md:text-3xl text-white/40 max-w-4xl mx-auto font-light leading-relaxed mb-20 animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              {frontpage.intro.description}
            </p>
            <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mb-24 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: BookMarked, iconColor: 'text-sky-400' },
                { icon: Rocket, iconColor: 'text-rose-500' },
                { icon: Users, iconColor: 'text-indigo-400' },
              ].map((style, i) => {
                const cta = frontpage.intro.ctas[i] || { title: '', label: '' };
                const action = () => {
                  if ((cta as any).href) window.location.href = (cta as any).href;
                  else if ((cta as any).scrollTo) scrollToSection((cta as any).scrollTo);
                };
                return (
                  <button
                    key={i}
                    onClick={action}
                    className="group relative glass p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-all duration-700 shine-effect card-light text-left"
                  >
                    <div
                      className={`w-14 h-14 glass rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform bg-black/20 border border-white/5`}
                    >
                      <style.icon size={24} className={style.iconColor} />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">{cta.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-purple-600 uppercase">
                      {cta.label}{' '}
                      <ArrowRight size={12} className="text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => scrollToSection(Section.Purpose)} className="flex flex-col items-center gap-4 text-white/20 hover:text-purple-400 transition-all group animate-bounce">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{frontpage.intro.scrollHint}</span>
              <ChevronDown size={32} className="text-purple-500" />
            </button>
          </div>
        </section>
      )}

      {/* PURPOSE SECTION */}
      {frontpage.purpose.enabled && (
      <section id="purpose" className="min-h-screen relative flex items-center justify-center px-6 pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-[1200px] h-[1200px] bg-purple-950/10 rounded-full blur-[200px] animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-32 items-center relative z-10">
            <div className="text-left animate-fade-up">
                 <div className="inline-flex items-center gap-4 px-6 py-2 mb-16 border border-white/5 rounded-full bg-white/[0.02] backdrop-blur-3xl shadow-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-shadow">
                    <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_15px_#ea580c]"></div>
	                    <span className="text-[10px] font-black tracking-[0.5em] text-purple-400 uppercase">{frontpage.purpose.pillText}</span>
	                </div>
	                <h1 className="text-7xl md:text-[13rem] font-black text-white mb-16 tracking-tighter leading-[0.75]">
                    {frontpage.purpose.headingLine1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-white to-purple-900 animate-gradient-x text-glow">
                      {frontpage.purpose.headingEmphasis}
                    </span>
                  </h1>
	                <div className="space-y-14 text-2xl text-white/40 font-light leading-relaxed max-w-3xl">
	                    <p className="font-serif italic text-white/90 leading-snug">{frontpage.purpose.quote}</p>
	                    <p className="text-xl">{frontpage.purpose.description}</p>
	                </div>
	                <div className="mt-24 flex flex-wrap gap-10">
	                   <button onClick={() => scrollToSection(Section.About)} className="group flex items-center gap-6 bg-white text-black px-14 py-7 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-700 shadow-3xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                      {frontpage.purpose.primaryCtaLabel} <ArrowRight size={20} className="text-black group-hover:translate-x-4 transition-transform duration-500"/>
                     </button>
	                   <button onClick={() => { setIsChatOpen(true); setSupportTab('chat'); }} className="px-14 py-7 border border-white/5 rounded-full font-black text-[11px] uppercase tracking-widest text-white/20 hover:text-white hover:border-purple-500/30 transition-all">
                      {frontpage.purpose.secondaryCtaLabel}
                     </button>
	                </div>
	            </div>
            <div className="relative flex justify-center items-center">
                <div className="relative w-full max-w-xl aspect-square">
                    <div className="absolute inset-0 bg-purple-900/10 rounded-[5rem] rotate-12 scale-90 opacity-20 border border-white/5 animate-pulse-slow"></div>
                    <div className="relative z-10 w-full h-full glass rounded-[5rem] p-20 border border-white/5 shadow-3xl flex flex-col justify-between overflow-hidden group shine-effect card-light">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-[4s]"></div>
                        <div className="relative z-20 space-y-12">
                            <div className="flex items-center gap-6"><div className="w-16 h-1 bg-white/10 rounded-full"></div><span className="text-[10px] font-black tracking-widest uppercase text-white/20">UK Curriculum Status: Verified</span></div>
                            <h2 className="text-6xl font-serif text-white leading-tight font-bold italic">The Academy <br/>Spirit.</h2>
                            <p className="text-white/30 text-xl leading-relaxed font-light">Synthesising rigorous educational science with the magical potential of generative storytelling.</p>
                        </div>
                        <div className="flex gap-6 relative z-20">
                            {[ { Icon: ShieldCheck, color: 'text-emerald-400' }, { Icon: Brain, color: 'text-violet-400' }, { Icon: BookOpen, color: 'text-sky-400' } ].map((item, i) => (
                              <div key={i} className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-white/5 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-500 cursor-pointer shadow-xl group/icon">
                                <item.Icon size={24} className={`${item.color} group-hover/icon:scale-110 transition-transform`}/>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
	      </section>
      )}

      {/* MANIFESTO / ABOUT SECTION */}
      {frontpage.about.enabled && (
      <section id="about" className="py-56 px-6 bg-[#010102] relative overflow-hidden">
	        <div className="max-w-6xl mx-auto relative z-10">
	            <div className="flex flex-col items-center text-center mb-40">
	                <div className="w-px h-32 bg-gradient-to-b from-transparent via-purple-900 to-transparent mb-16"></div>
	                <h2 className="text-xs font-black tracking-[0.8em] uppercase text-purple-700 mb-10">{frontpage.about.eyebrow}</h2>
	                <h1 className="text-6xl md:text-9xl font-black text-white mb-14 tracking-tighter leading-none">
                    {frontpage.about.headingLine1} <br/><span className="italic font-serif text-purple-500 text-glow">{frontpage.about.headingEmphasis}</span>
                  </h1>
	            </div>
	            <div className="space-y-64">
	                <div className="max-w-4xl mx-auto text-center">
	                    <p className="text-4xl md:text-6xl font-serif text-purple-100/90 leading-tight mb-16">
                        {frontpage.about.quote.split('\n').map((line, idx, arr) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < arr.length - 1 ? <br /> : null}
                          </React.Fragment>
                        ))}
                      </p>
	                    <div className="h-px w-24 bg-purple-900/30 mx-auto mb-16 animate-pulse"></div>
	                    <p className="text-2xl text-white/30 font-light leading-relaxed">{frontpage.about.description}</p>
	                </div>
	                <div className="grid md:grid-cols-2 gap-12">
	                    {[
	                      { icon: Sparkles, color: 'border-fuchsia-500/10 hover:border-fuchsia-500/40 hover:shadow-[0_0_40px_rgba(217,70,239,0.1)]', iconColor: 'text-fuchsia-400' },
	                      { icon: Palette, color: 'border-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_0_40px_rgba(244,63,94,0.1)]', iconColor: 'text-rose-400' },
	                      { icon: Music, color: 'border-teal-500/10 hover:border-teal-500/40 hover:shadow-[0_0_40px_rgba(20,184,166,0.1)]', iconColor: 'text-teal-400' },
	                      { icon: ShieldCheck, color: 'border-green-500/10 hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(34,197,94,0.1)]', iconColor: 'text-green-400' }
	                    ].map((m, i) => {
                      const feature = frontpage.about.features[i] || { title: '', text: '' };
                      return (
                        <div key={i} className={`glass p-16 rounded-[4rem] border border-glow ${m.color} transition-all duration-700 group shadow-2xl card-light shine-effect`}>
                          <div className="w-20 h-20 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_15px_currentColor] transition-shadow"><m.icon className={m.iconColor} size={36} /></div>
                          <h4 className="text-3xl font-black text-white mb-8 group-hover:translate-x-1 transition-transform">{feature.title}</h4>
                          <p className="text-xl text-white/30 leading-relaxed font-light">{feature.text}</p>
                        </div>
                      );
                    })}
	                </div>
	            </div>
	        </div>
	      </section>
      )}

      {/* ARCHIVE OF STANDARDS SECTION */}
      {frontpage.archive.enabled && (
      <section id="archive" className="py-56 px-6 bg-black relative overflow-hidden border-t border-white/5">
	        <div className="max-w-7xl mx-auto relative z-10 text-center">
	            <h2 className="text-[10px] font-black tracking-[1em] uppercase text-emerald-800 mb-10">{frontpage.archive.eyebrow}</h2>
	            <h1 className="text-6xl md:text-9xl font-black text-white mb-16 tracking-tighter leading-none">
                {frontpage.archive.headingLine1} <span className="text-emerald-500 italic font-serif">{frontpage.archive.headingEmphasis}</span>
              </h1>
	            <p className="text-2xl text-white/20 max-w-4xl mx-auto mb-32 font-light leading-relaxed">{frontpage.archive.description}</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {curriculumKeys.map((key, i) => (
                    <div key={i} className={`group glass p-12 rounded-[4rem] border border-white/5 hover:border-emerald-500/20 transition-all duration-1000 cursor-pointer shadow-3xl flex flex-col items-center ${key.glow} card-light`} onClick={() => { setSelectedKey(i); setIsCurriculumOpen(true); }}>
                        <div className={`w-24 h-24 glass rounded-3xl flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-transform ${key.color}`}>
                            <key.icon size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">{key.title}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40 mb-10">{key.era}</span>
                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-400 transition-all">Manifest Details <Scroll size={14}/></button>
                    </div>
                ))}
            </div>
        </div>
	      </section>
      )}

      {/* VISION SECTION */}
      {frontpage.vision.enabled && (
        <section id="vision" className="py-56 px-6 bg-[#010103] relative overflow-hidden border-t border-white/5">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-[10px] font-black tracking-[1em] uppercase text-purple-700 mb-10">{frontpage.vision.eyebrow}</h2>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
                {frontpage.vision.headingLine1}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-purple-500 animate-gradient-x italic font-serif text-glow">
                  {frontpage.vision.headingEmphasis}
                </span>
              </h1>
              <p className="text-2xl text-white/20 max-w-4xl mx-auto font-light leading-relaxed">{frontpage.vision.description}</p>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              {frontpage.vision.bullets.slice(0, 4).map((b, i) => (
                <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/20 transition-all duration-700 card-light shine-effect text-left">
                  <div className="flex items-start gap-5">
                    <div className="mt-2 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
                    <div className="text-white/60 text-lg leading-relaxed font-light">{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MISSION SECTION */}
      {frontpage.mission.enabled && (
        <section id="mission" className="py-56 px-6 bg-black relative overflow-hidden border-t border-white/5">
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h2 className="text-[10px] font-black tracking-[1em] uppercase text-purple-700 mb-10">{frontpage.mission.eyebrow}</h2>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
              {frontpage.mission.headingLine1}{' '}
              <span className="text-purple-400 italic font-serif text-glow">{frontpage.mission.headingEmphasis}</span>
            </h1>
            <p className="text-2xl text-white/20 max-w-4xl mx-auto mb-16 font-light leading-relaxed">{frontpage.mission.description}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href={frontpage.mission.primaryCtaHref}
                className="group inline-flex items-center gap-4 bg-white text-black px-14 py-7 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-700 shadow-3xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                {frontpage.mission.primaryCtaLabel} <ArrowRight size={20} className="text-black group-hover:translate-x-2 transition-transform duration-500" />
              </a>
              <a
                href="/admin"
                className="px-14 py-7 border border-white/5 rounded-full font-black text-[11px] uppercase tracking-widest text-white/20 hover:text-white hover:border-purple-500/30 transition-all"
              >
                Admin
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/5 pt-48 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-32 mb-48">
               <div className="lg:col-span-2 space-y-16">
                  <div className="flex items-center gap-6 group cursor-default">
                      <div className="w-16 h-1 bg-purple-950/40 rounded-3xl flex items-center justify-center border border-purple-500/20 shadow-3xl group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"><Sparkles className="text-pink-400 group-hover:animate-pulse" size={32} /></div>
                      <span className="font-black text-5xl text-white tracking-tighter group-hover:text-glow transition-all">iFairy Studio</span>
                  </div>
                  <p className="text-2xl text-white/20 max-w-xl leading-relaxed font-light">Crafting UK curriculum-aligned Academy Spirits for the revolution of home-led mastery.</p>
                  <div className="flex gap-10">
                    <button className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:border-sky-600 hover:text-sky-600 transition-all shadow-2xl group"><Globe size={28} className="text-sky-400 group-hover:scale-110 transition-transform"/></button>
                    <button className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:border-red-600 hover:text-red-600 transition-all shadow-2xl group"><Youtube size={28} className="text-red-500 group-hover:scale-110 transition-transform"/></button>
                    <button className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:border-rose-600 hover:text-rose-600 transition-all shadow-2xl group"><Palette size={28} className="text-fuchsia-400 group-hover:scale-110 transition-transform"/></button>
                  </div>
               </div>
               <div>
                  <h5 className="text-[11px] font-black tracking-[0.5em] uppercase text-white/40 mb-12 italic">The Lab</h5>
                  <ul className="space-y-8 text-[11px] font-black tracking-[0.2em] uppercase text-white/10">
                    <li><button onClick={() => scrollToSection(Section.Intro)} className="hover:text-purple-600 transition-colors text-left w-full">The Frontier</button></li>
                    <li><button onClick={() => scrollToSection(Section.Purpose)} className="hover:text-purple-600 transition-colors text-left w-full">Purpose</button></li>
                    <li><button onClick={() => scrollToSection(Section.About)} className="hover:text-purple-600 transition-colors text-left w-full">Manifesto</button></li>
                    <li><button onClick={() => scrollToSection(Section.Archive)} className="hover:text-purple-600 transition-colors text-left w-full">Curriculum</button></li>
                    <li><button onClick={() => scrollToSection(Section.Vision)} className="hover:text-purple-600 transition-colors text-left w-full">Vision</button></li>
                    <li><button onClick={() => scrollToSection(Section.Mission)} className="hover:text-purple-600 transition-colors text-left w-full">Mission</button></li>
                  </ul>
               </div>
               <div>
                  <h5 className="text-[11px] font-black tracking-[0.5em] uppercase text-white/40 mb-12 italic">Compliance</h5>
                  <ul className="space-y-8 text-[11px] font-black tracking-[0.2em] uppercase text-white/10">
                    <li><button onClick={() => scrollToSection(Section.Archive)} className="hover:text-emerald-500 transition-colors text-left w-full">UK Curriculum Archive</button></li>
                    <li><a href="#" className="hover:text-purple-600 transition-colors">Safeguarding</a></li>
                    <li><a href="#" className="hover:text-purple-600 transition-colors">Home-Led Hub</a></li>
                    <li><a href="#" className="hover:text-purple-600 transition-colors">Ethical AI</a></li>
                  </ul>
               </div>
            </div>
            <div className="pt-24 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="flex flex-col items-center md:items-start"><span className="text-[10px] font-black tracking-[0.8em] uppercase text-white/5 mb-3 italic">Architects of individual destiny</span><span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/10">iFairy Studio &copy; 2026. Aligned with UK Education Standards.</span></div>
               <div className="flex gap-16 text-[10px] font-black tracking-[0.5em] uppercase text-white/5"><a href="#" className="hover:text-purple-900 transition-colors">Privacy</a><a href="#" className="hover:text-purple-900 transition-colors">Terms</a><a href="#" className="hover:text-purple-900 transition-colors">Oath</a></div>
            </div>
        </div>
      </footer>

      {/* CURRICULUM OVERLAY (MODAL) */}
      <div className={`fixed inset-0 z-[120] bg-[#020204]/98 backdrop-blur-3xl flex items-center justify-center p-6 transition-all duration-1000 ${isCurriculumOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 pointer-events-none'}`}>
          <div className="max-w-6xl w-full h-[90vh] flex flex-col bg-black/40 rounded-[5rem] border border-white/5 overflow-hidden shadow-3xl">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-emerald-900/5">
                  <div className="flex items-center gap-8">
                     <Library className="text-emerald-400" size={32} />
                     <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Academic Archive Detail</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-500/40">Verified Pedagogy Mapping</p>
                     </div>
                  </div>
                  <button onClick={() => setIsCurriculumOpen(false)} className="w-16 h-16 glass rounded-full flex items-center justify-center border border-white/5 text-white/20 hover:text-white transition-all"><X size={32} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-12 md:p-20 space-y-20">
                  <div className="grid lg:grid-cols-2 gap-20">
                      <div className="space-y-12">
                          <div className={`inline-flex items-center gap-4 px-6 py-2 rounded-full glass border border-white/5 ${selectedKey !== null ? curriculumKeys[selectedKey].color : 'text-white'}`}>
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{selectedKey !== null ? curriculumKeys[selectedKey].title : 'Key Stage'}</span>
                          </div>
                          <h3 className="text-5xl font-black text-white leading-tight font-serif italic">"{selectedKey !== null ? curriculumKeys[selectedKey].desc : 'Loading Archive...'}"</h3>
                          <div className="space-y-6">
                              <h4 className="text-xs font-black uppercase tracking-widest text-white/20">Manifested Study Domains</h4>
                              <div className="flex flex-wrap gap-4">
                                  {domains.slice(0, 4).map((d, i) => (
                                      <div key={i} className="px-6 py-3 glass rounded-2xl border border-white/5 flex items-center gap-3">
                                          <d.icon size={14} className={d.color} />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{d.name}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                      <div className="glass p-12 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col justify-center text-center group">
                          <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                          <Download className="mx-auto text-emerald-400 mb-8" size={48} />
                          <h4 className="text-2xl font-black text-white mb-6">Manifest Standards Guide</h4>
                          <p className="text-white/20 mb-10 text-sm font-light">Generate and download a detailed breakdown of how our Academy Spirits map to specific UK assessment points.</p>
                          <button className="bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 hover:text-white transition-all shadow-xl">Prepare Documentation</button>
                      </div>
                  </div>
                  <div className="pt-20 border-t border-white/5">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white/10 mb-12 flex items-center gap-4"><FileText size={16}/> Associated Resource Artifacts</h4>
                      <div className="grid md:grid-cols-3 gap-8">
                          {['Pedagogical Blueprint', 'Safeguarding Protocol', 'Spirit Maintenance Log'].map((item, i) => (
                              <div key={i} className="p-8 glass rounded-3xl border border-white/5 hover:border-white/20 transition-all group flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{item}</span>
                                  <Download size={16} className="text-white/20 group-hover:text-emerald-400 transition-all" />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
              <div className="p-8 bg-[#010103] border-t border-white/5 text-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">Official iFairy Studio Archive &copy; 2026</span>
              </div>
          </div>
      </div>
      
      {/* SUPPORT BUTTON REMAINS ON TOP */}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`fixed bottom-10 right-10 w-20 h-20 glass rounded-full z-[130] flex items-center justify-center border border-purple-500/30 transition-all duration-500 hover:scale-110 group ${isChatOpen ? 'rotate-90' : ''} shadow-3xl`}>
        {isChatOpen ? <X className="text-white" size={32} /> : <Wand2 className="text-pink-400" size={32} />}
      </button>

      {/* CHAT DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#020204]/98 backdrop-blur-3xl border-l border-white/5 z-[140] transform transition-transform duration-1000 cubic-bezier(0.19, 1, 0.22, 1) flex flex-col shadow-[-50px_0_150px_rgba(0,0,0,0.9)] ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 border-b border-white/5 flex flex-col gap-8 bg-gradient-to-b from-purple-900/10 to-transparent">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5"><div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse"></div><h3 className="font-black text-[12px] tracking-[0.5em] uppercase text-white">Lighthouse Support Hub</h3></div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/20 hover:text-white transition-all p-2 rounded-full hover:bg-white/5"><X size={28}/></button>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => setSupportTab('faq')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${supportTab === 'faq' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>FAQ Center</button>
                  <button onClick={() => setSupportTab('chat')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${supportTab === 'chat' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>Ask a Question</button>
              </div>
          </div>
          <div className="flex-grow overflow-y-auto p-12 space-y-12">
              {supportTab === 'faq' ? (
                <div className="space-y-6 animate-fade-up">
                  <h4 className="text-xs font-black tracking-widest uppercase text-purple-400 mb-8 flex items-center gap-3"><HelpCircle size={16} className="text-sky-400" /> Frequently Asked Inquiries</h4>
                  {faqs.map((f, i) => (
                    <div key={i} className="group glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer" onClick={() => processChat(f.q)}>
                      <h5 className="text-white font-bold text-lg mb-3 flex justify-between items-center">{f.q}<ChevronRight size={18} className="text-white/20 group-hover:text-purple-400 transition-all" /></h5>
                      <p className="text-white/30 text-sm leading-relaxed font-light">{f.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}><div className={`max-w-[85%] p-10 rounded-[2.5rem] text-[15px] leading-relaxed font-light ${msg.role === 'user' ? 'bg-purple-900/40 text-white rounded-tr-none border border-purple-500/30 shadow-xl' : 'bg-white/[0.03] text-purple-100/80 rounded-tl-none border border-white/5'}`}>{msg.text}</div></div>
                  ))}
                  {isChatLoading && (
                      <div className="flex justify-start"><div className="bg-white/5 text-purple-500 p-10 rounded-[2.5rem] rounded-tl-none border border-white/5 flex items-center gap-5"><Loader2 size={24} className="animate-spin text-pink-500" /> <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-pink-500">Academy Spirits Consulting...</span></div></div>
                  )}
                  <div ref={chatEndRef}></div>
                </>
              )}
          </div>
          <form onSubmit={handleChatSubmit} className="p-10 bg-[#010103] border-t border-white/5">
              <div className="relative">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onFocus={() => setSupportTab('chat')} placeholder="Ask about home learning, curriculum, or magic..." className="w-full bg-[#050508] border border-white/10 rounded-3xl pl-10 pr-20 py-7 text-lg text-white focus:outline-none focus:border-purple-500/40 transition-all placeholder-white/5 shadow-inner" />
                  <button type="submit" disabled={isChatLoading} className="absolute right-3 top-3 bottom-3 aspect-square bg-purple-600 rounded-2xl text-white flex items-center justify-center hover:bg-purple-500 disabled:opacity-20 transition-all group shadow-2xl"><Send size={24} className="text-indigo-200 group-hover:translate-x-1 transition-transform" /></button>
              </div>
          </form>
      </div>
    </div>
  );
};

export default App;
