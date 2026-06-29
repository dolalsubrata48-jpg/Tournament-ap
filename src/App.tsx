import React, { useState, useEffect } from 'react';
import { AppProvider, useApp, MainTab } from './store';
import BattlePage from './pages/Battle';
import WalletPage from './pages/Wallet';
import PromotionPage from './pages/Promotion';

/* ============ SPLASH SCREENS ============ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => {
        if (c >= total - 1) { clearInterval(timer); setTimeout(onComplete, 600); return c; }
        return c + 1;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [onComplete]);

  const screens = [
    { emoji: '🎲', title: 'NumberStop', sub: 'Stop the Number, Win Big!', gradient: 'from-violet-900 via-[#0a0a1a] to-indigo-900' },
    { emoji: '⚔️', title: 'Join Tournaments', sub: 'Compete with players in real-time', gradient: 'from-cyan-900 via-[#0a0a1a] to-blue-900' },
    { emoji: '💰', title: 'Win Real Cash', sub: 'Stop closest to the target & win!', gradient: 'from-emerald-900 via-[#0a0a1a] to-green-900' },
  ];

  return (
    <div className="fixed inset-0 z-50 cursor-pointer" onClick={() => { if (current < total - 1) setCurrent(c => c + 1); else onComplete(); }}>
      {screens.map((s, i) => (
        <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${s.gradient} transition-all duration-700 ${i === current ? 'opacity-100 scale-100' : i < current ? 'opacity-0 scale-95 -translate-x-full' : 'opacity-0 scale-105 translate-x-full'}`}>
          {/* Decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="absolute rounded-full border border-white/5" style={{
                width: 100 + j * 80, height: 100 + j * 80,
                top: `${20 + j * 12}%`, left: `${10 + j * 15}%`,
                animationDelay: `${j * 200}ms`
              }} />
            ))}
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-white/5 rounded-full blur-2xl" />
            <span className="relative text-8xl mb-8 block animate-float">{s.emoji}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 text-center tracking-tight">{s.title}</h1>
          <p className="text-gray-300/80 text-lg text-center px-8">{s.sub}</p>
        </div>
      ))}

      {/* Progress */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2.5">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-white' : i < current ? 'w-2 bg-white/50' : 'w-2 bg-white/20'}`} />
        ))}
      </div>

      <button className="absolute top-10 right-6 text-white/30 text-sm hover:text-white/60 transition-colors" onClick={onComplete}>Skip →</button>
    </div>
  );
}

/* ============ AUTH PAGE ============ */
function AuthPage() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [refCode, setRefCode] = useState('');
  const [terms, setTerms] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const handleLogin = () => {
    if (!name.trim()) { alert('Enter your name'); return; }
    if (!email.trim() || !email.includes('@')) { alert('Enter a valid email'); return; }
    if (!terms) { alert('Accept Terms & Conditions'); return; }
    login(name.trim(), email.trim(), showRef ? refCode.trim() : undefined);
  };

  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl -bottom-10 -right-10" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-violet-600/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center mx-auto shadow-2xl shadow-violet-600/30 border border-violet-400/20">
              <span className="text-4xl">🎲</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-5 tracking-tight">NumberStop</h1>
          <p className="text-gray-500 mt-1 text-sm">Stop the Number, Win Big!</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-[10px] mb-1.5 block uppercase tracking-wider">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] mb-1.5 block uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none transition-colors" />
          </div>

          {/* Referral */}
          <div>
            <button onClick={() => setShowRef(!showRef)} className="text-violet-400/80 text-xs flex items-center gap-1.5 hover:text-violet-300 transition-colors">
              {showRef ? '▼' : '▶'} Have a referral code?
            </button>
            {showRef && (
              <div className="mt-2.5 flex gap-2 animate-slide-down">
                <input type="text" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none text-sm tracking-wider font-mono" />
                <button onClick={() => { if (refCode.length >= 4) alert('Code will be applied on login!'); }} className="px-4 py-2.5 rounded-xl bg-violet-600/80 text-white text-sm font-medium border border-violet-400/20">Submit</button>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 py-1">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-1 accent-violet-600 w-4 h-4 rounded" />
            <p className="text-[12px] leading-relaxed">
              <span className="text-gray-500">By clicking on Login with Google you are aware of our </span>
              <span className="text-amber-400 font-semibold">Terms and Conditions</span>
              <span className="text-gray-500"> and our platform policies.</span>
            </p>
          </div>

          {/* Google Sign-In */}
          <button onClick={handleLogin} disabled={!terms} className="w-full py-4 rounded-2xl bg-white text-gray-900 font-bold text-base flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-transform shadow-xl shadow-white/5 hover:shadow-white/10">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ BOTTOM NAV ============ */
function BottomNav({ tab, setTab }: { tab: MainTab; setTab: (t: MainTab) => void }) {
  const tabs: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'battle', label: 'Play Battle', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg> },
    { id: 'wallet', label: 'Wallet', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg> },
    { id: 'promotion', label: 'Promotion', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#06060f]/95 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${tab === t.id ? 'text-violet-400' : 'text-gray-600 hover:text-gray-400'}`}>
            <div className={`transition-transform duration-200 ${tab === t.id ? 'scale-110' : ''}`}>{t.icon}</div>
            <span className="text-[10px] font-semibold tracking-wide">{t.label}</span>
            {tab === t.id && <div className="w-8 h-0.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ APP CONTENT ============ */
function AppContent() {
  const { state, completeSplash, setTab } = useApp();

  if (state.screen === 'splash') return <SplashScreen onComplete={completeSplash} />;
  if (state.screen === 'auth') return <AuthPage />;

  return (
    <div className="min-h-screen bg-[#06060f] max-w-lg mx-auto relative">
      <div className="pb-20 safe-bottom">
        {state.tab === 'battle' && <BattlePage />}
        {state.tab === 'wallet' && <WalletPage />}
        {state.tab === 'promotion' && <PromotionPage />}
      </div>
      <BottomNav tab={state.tab} setTab={setTab} />
    </div>
  );
}

/* ============ ROOT ============ */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
