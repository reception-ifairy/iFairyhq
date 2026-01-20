import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { SettingsPage } from './pages/SettingsPage';
import { ProductsPage } from './pages/ProductsPage';
import { BotsPage } from './pages/BotsPage';
import { ToolsPage } from './pages/ToolsPage';
import { ModulesPage } from './pages/ModulesPage';
import { LeadsPage } from './pages/LeadsPage';
import { CredentialsPage } from './pages/CredentialsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import AdminDashboard from '../AdminDashboard';
import { ShieldCheck, LayoutGrid, Package, Bot, Wrench, Users, Key, Settings, ArrowLeft, LogOut, Loader2 } from 'lucide-react';
import { APP_CONFIG_STORAGE_KEY, loadAppConfig, saveAppConfig, type AppConfig } from '../appConfig';

type NavItem = { to: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> };

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// Login Screen Component
const LoginScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#010103] flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-10 rounded-[3rem] border border-white/5 text-center space-y-8">
          <div>
            <div className="text-[10px] font-black tracking-[0.8em] uppercase text-white/20 mb-3">iFairy</div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              Admin <span className="text-purple-400 italic font-serif">Panel</span>
            </h1>
          </div>
          
          <p className="text-white/40 text-sm">
            Zaloguj sie, aby uzyskac dostep do panelu administracyjnego.
          </p>
          
          <div className="space-y-4">
            <a
              href="/auth/google/start"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-white text-gray-800 font-bold hover:bg-gray-100 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Zaloguj przez Google
            </a>
            
            <a
              href="/auth/github/start"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Zaloguj przez GitHub
            </a>
          </div>
          
          <div className="pt-4 text-[10px] text-white/20">
            Tylko autoryzowani administratorzy moga sie zalogowac.
          </div>
        </div>
        
        <div className="text-center mt-6">
          <a href="/" className="text-white/30 hover:text-white text-sm transition-colors">
            &#8592; Wroc na strone glowna
          </a>
        </div>
      </div>
    </div>
  );
};

// Loading Screen Component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#010103] flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
      <p className="text-white/40 text-sm">Sprawdzanie sesji...</p>
    </div>
  </div>
);

const SidebarLink: React.FC<NavItem> = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border ${
        isActive ? 'bg-purple-600/20 border-purple-500/30 text-white' : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white hover:border-purple-500/20'
      }`
    }
  >
    <Icon size={16} className="text-purple-300" />
    {label}
  </NavLink>
);

const PageShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-10">
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="text-[10px] font-black tracking-[0.8em] uppercase text-white/20 mb-3">Admin</div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
          {title} <span className="text-purple-400 italic font-serif">Console</span>
        </h1>
      </div>
    </div>
    {children}
  </div>
);

const AdminHome: React.FC<{ user: AdminUser }> = ({ user }) => (
  <PageShell title="Welcome">
    <div className="glass p-10 rounded-[3rem] border border-white/5">
      <div className="text-white/60 leading-relaxed">
        <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-white">
            Witaj, <span className="font-bold text-purple-300">{user.full_name || user.email}</span>!
          </p>
        </div>
        Ten panel laczy:
        <ul className="list-disc pl-6 mt-3 space-y-2 text-white/40">
          <li>Edytor frontpage (localStorage) - Local content editor</li>
          <li>CRUD na bazie MySQL (produkty/boty/narzedzia/moduly/leady/klucze)</li>
          <li>Integracje z Google (Drive, Docs, Sheets, YouTube) i GitHub</li>
        </ul>
      </div>
    </div>
  </PageShell>
);

export const AdminApp: React.FC = () => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(() => loadAppConfig());
  const [authState, setAuthState] = useState<'loading' | 'logged-in' | 'logged-out'>('loading');
  const [user, setUser] = useState<AdminUser | null>(null);

  // Check session on mount
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          setUser(data.user);
          setAuthState('logged-in');
        } else {
          setAuthState('logged-out');
        }
      })
      .catch(() => setAuthState('logged-out'));
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === APP_CONFIG_STORAGE_KEY) setLocalConfig(loadAppConfig());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setAuthState('logged-out');
    setUser(null);
  };

  // Show loading screen while checking session
  if (authState === 'loading') {
    return <LoadingScreen />;
  }

  // Show login screen if not authenticated
  if (authState === 'logged-out') {
    return <LoginScreen />;
  }

  const nav: NavItem[] = [
    { to: '/admin', label: 'Home', icon: ShieldCheck },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
    { to: '/admin/integrations', label: 'Integrations', icon: ShieldCheck },
    { to: '/admin/local-content', label: 'Local content', icon: LayoutGrid },
    { to: '/admin/modules', label: 'Front modules', icon: LayoutGrid },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/bots', label: 'Bots', icon: Bot },
    { to: '/admin/tools', label: 'Tools', icon: Wrench },
    { to: '/admin/leads', label: 'Leads', icon: Users },
    { to: '/admin/credentials', label: 'API keys', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-[#010103] text-purple-100 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
          <aside className="glass p-8 rounded-[3rem] border border-white/5 sticky top-8 space-y-6">
            <a
              href="/"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/30 hover:text-white hover:border-purple-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="text-purple-300" />
              Back to site
            </a>
            <div className="space-y-3">
              {nav.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>
            
            {/* User info & logout */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-[10px] text-white/40 truncate">
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                <LogOut size={14} />
                Wyloguj
              </button>
            </div>
          </aside>

          <main className="space-y-10">
            <Routes>
              <Route path="/admin" element={<AdminHome user={user!} />} />
              <Route
                path="/admin/settings"
                element={
                  <PageShell title="Settings">
                    <SettingsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/integrations"
                element={
                  <PageShell title="Integrations">
                    <IntegrationsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/local-content"
                element={
                  <AdminDashboard
                    config={localConfig}
                    onConfigChange={(next) => {
                      setLocalConfig(next);
                      saveAppConfig(next);
                    }}
                    onExit={() => {
                      window.location.href = '/';
                    }}
                  />
                }
              />
              <Route
                path="/admin/modules"
                element={
                  <PageShell title="Frontpage">
                    <ModulesPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <PageShell title="Products">
                    <ProductsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/bots"
                element={
                  <PageShell title="Bots">
                    <BotsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/tools"
                element={
                  <PageShell title="Tools">
                    <ToolsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/leads"
                element={
                  <PageShell title="Leads">
                    <LeadsPage />
                  </PageShell>
                }
              />
              <Route
                path="/admin/credentials"
                element={
                  <PageShell title="Credentials">
                    <CredentialsPage />
                  </PageShell>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};
