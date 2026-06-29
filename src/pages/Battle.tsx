import { useState, useEffect, useRef } from 'react';
import { useApp, Tournament } from '../store';

/* ============ SVG ICONS ============ */
const SwordIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const TrophyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const InfoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const ArrowLeftIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const MedalIcon = ({ c }: { c: string }) => <svg viewBox="0 0 24 24" fill={c} className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const TargetIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const FlameIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;

/* ============ BANNER CAROUSEL ============ */
function BannerCarousel() {
  const banners = [
    { bg: 'from-violet-700 via-purple-800 to-indigo-900', emoji: '🎲', title: 'NumberStop', sub: 'Stop the Number, Win Big!' },
    { bg: 'from-cyan-700 via-teal-800 to-blue-900', emoji: '💰', title: 'Huge Prize Pools', sub: 'More players = bigger rewards!' },
    { bg: 'from-pink-700 via-rose-800 to-red-900', emoji: '🏆', title: 'Daily Tournaments', sub: 'Play anytime, win everyday!' },
  ];
  const [cur, setCur] = useState(0);
  useEffect(() => { const t = setInterval(() => setCur(c => (c + 1) % banners.length), 3500); return () => clearInterval(t); }, [banners.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mt-3 h-40 shadow-xl shadow-violet-900/20">
      <div className="flex transition-transform duration-700 ease-out h-full" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {banners.map((b, i) => (
          <div key={i} className={`min-w-full h-full bg-gradient-to-br ${b.bg} flex flex-col items-center justify-center text-white p-5 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, j) => <div key={j} className="absolute rounded-full bg-white/20" style={{ width: 40 + j * 20, height: 40 + j * 20, top: `${10 + j * 10}%`, left: `${5 + j * 12}%` }} />)}
            </div>
            <span className="text-5xl mb-2 animate-float" style={{ animationDelay: `${i * 200}ms` }}>{b.emoji}</span>
            <h2 className="text-2xl font-extrabold tracking-tight">{b.title}</h2>
            <p className="text-sm opacity-80 mt-0.5">{b.sub}</p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => <div key={i} className={`rounded-full transition-all duration-300 ${i === cur ? 'bg-white w-6 h-2' : 'bg-white/30 w-2 h-2'}`} />)}
      </div>
    </div>
  );
}

/* ============ ANNOUNCEMENTS ============ */
function Announcements({ items }: { items: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4000); return () => clearInterval(t); }, [items.length]);

  return (
    <div className="mx-4 mt-3 glass rounded-xl px-4 py-2.5 flex items-center gap-2 overflow-hidden">
      <span className="text-amber-400 shrink-0 text-base">📢</span>
      <p className="text-amber-200/90 text-xs truncate">{items[idx]}</p>
    </div>
  );
}

/* ============ PRIZE POOL POPUP ============ */
function PrizePoolPopup({ tournament, onClose }: { tournament: Tournament; onClose: () => void }) {
  const { calculatePrizePool } = useApp();
  const pool = calculatePrizePool(tournament);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-scale-in" onClick={onClose}>
      <div className="bg-gradient-to-b from-[#1c1c3a] to-[#12122a] border border-violet-500/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-violet-900/30" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrophyIcon /> Prize Pool</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><XIcon /></button>
        </div>
        <div className="text-center mb-5 bg-gradient-to-b from-violet-600/10 to-transparent rounded-2xl py-4 border border-violet-500/10">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Total Pool</p>
          <p className="text-4xl font-extrabold text-white mt-1">₹{pool.total}</p>
          <p className="text-gray-500 text-xs mt-1.5">Platform Fee (20%): ₹{pool.platformFee}</p>
        </div>
        <div className="space-y-2.5">
          {[
            { place: '1st', color: '#facc15', bg: 'from-yellow-500/15 to-yellow-600/5', border: 'border-yellow-500/20', amount: pool.first, medal: '#facc15' },
            { place: '2nd', color: '#9ca3af', bg: 'from-gray-400/15 to-gray-500/5', border: 'border-gray-400/20', amount: pool.second, medal: '#9ca3af' },
            { place: '3rd', color: '#b45309', bg: 'from-amber-700/15 to-amber-800/5', border: 'border-amber-700/20', amount: pool.third, medal: '#b45309' },
          ].map(p => (
            <div key={p.place} className={`flex items-center justify-between bg-gradient-to-r ${p.bg} border ${p.border} rounded-xl px-4 py-3`}>
              <div className="flex items-center gap-2.5"><MedalIcon c={p.medal} /><span className="font-semibold" style={{ color: p.color }}>{p.place} Place</span></div>
              <span className="text-white font-bold text-lg">₹{p.amount}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-[10px] mt-4">Net Distributable: ₹{pool.net}</p>
      </div>
    </div>
  );
}

/* ============ HOW TO PLAY ============ */
function HowToPlay({ onClose }: { onClose: () => void }) {
  const steps = [
    { n: '1', t: 'Join a tournament by paying the entry fee from your wallet.' },
    { n: '2', t: 'When the tournament is LIVE, tap "Play" to enter the game.' },
    { n: '3', t: 'You\'ll see the target number. Tap "Start to Play" to begin.' },
    { n: '4', t: 'Numbers 1-100 will slide from top to bottom. Tap "STOP" to catch one!' },
    { n: '5', t: 'The 3 players closest to the target number win prizes!' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-scale-in" onClick={onClose}>
      <div className="bg-gradient-to-b from-[#1c1c3a] to-[#12122a] border border-violet-500/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><InfoIcon /> How to Play</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><XIcon /></button>
        </div>
        <div className="space-y-4">
          {steps.map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-violet-600/20">{s.n}</div>
              <p className="text-gray-300 text-sm leading-relaxed">{s.t}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-600/20">Got it! 🎯</button>
      </div>
    </div>
  );
}

/* ============ VERTICAL NUMBER SLIDING GAME ============ */
function NumberSlidingGame({ targetNumber, onStop, onClose, onShowHowTo }: { targetNumber: number; onStop: (n: number) => void; onClose: () => void; onShowHowTo: () => void }) {
  const [phase, setPhase] = useState<'reveal' | 'playing' | 'stopping' | 'stopped'>('reveal');
  const [stoppedNumber, setStoppedNumber] = useState<number | null>(null);
  const scrollPosRef = useRef(0);
  const speedRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const [visibleNumbers, setVisibleNumbers] = useState<number[]>([48, 49, 50, 51, 52]);
  const [stopProgress, setStopProgress] = useState(0);
  const stoppedRef = useRef(false);

  const startGame = () => {
    setPhase('playing');
    scrollPosRef.current = Math.random() * 100;
    speedRef.current = 0.4 + Math.random() * 0.2;
    stoppedRef.current = false;

    const animate = () => {
      if (stoppedRef.current) return;
      scrollPosRef.current = (scrollPosRef.current + speedRef.current) % 100;
      const center = Math.floor(scrollPosRef.current) + 1;
      const nums = [];
      for (let i = -3; i <= 3; i++) {
        let n = center + i;
        if (n < 1) n += 100;
        if (n > 100) n -= 100;
        nums.push(n);
      }
      setVisibleNumbers(nums);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleStop = () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    setPhase('stopping');
    const initialSpeed = speedRef.current;

    // Decelerate
    let currentSpeed = speedRef.current;
    const decelerate = () => {
      currentSpeed *= 0.94;
      scrollPosRef.current = (scrollPosRef.current + currentSpeed) % 100;
      const center = Math.floor(scrollPosRef.current) + 1;
      const nums = [];
      for (let i = -3; i <= 3; i++) {
        let n = center + i;
        if (n < 1) n += 100;
        if (n > 100) n -= 100;
        nums.push(n);
      }
      setVisibleNumbers(nums);
      setStopProgress(Math.min(1, 1 - currentSpeed / initialSpeed));
      setStopProgress(Math.min(1, 1 - currentSpeed / speedRef.current));

      if (currentSpeed > 0.02) {
        animFrameRef.current = requestAnimationFrame(decelerate);
      } else {
        // Final stop
        const finalNum = center;
        setStoppedNumber(finalNum);
        setPhase('stopped');
        onStop(finalNum);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(decelerate);
  };

  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  // Reveal phase
  if (phase === 'reveal') {
    return (
      <div className="fixed inset-0 z-40 bg-[#06060f] flex flex-col items-center justify-center p-6">
        <button onClick={onClose} className="absolute top-5 left-4 text-white/60 bg-white/5 rounded-full p-2 hover:bg-white/10 transition-colors"><ArrowLeftIcon /></button>

        <div className="text-center animate-slide-up">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-violet-600/20 rounded-3xl blur-xl animate-glow-pulse" />
            <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center mx-auto shadow-2xl shadow-violet-600/40 border border-violet-400/20">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent" />
              <span className="text-6xl font-extrabold text-white drop-shadow-lg">{targetNumber}</span>
            </div>
          </div>
          <p className="text-gray-300 mt-6 text-base">
            Stop the closest to <span className="text-violet-400 font-bold text-lg">#{targetNumber}</span> and win big!
          </p>
          <div className="mt-8 space-y-3 w-full max-w-xs mx-auto">
            <button onClick={startGame} className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-violet-600/30 active:scale-[0.97] transition-transform border border-violet-400/20">
              ▶ Start to Play
            </button>
            <button onClick={onShowHowTo} className="w-full py-3 rounded-2xl glass text-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <InfoIcon /> How to Play?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stopped phase
  if (phase === 'stopped' && stoppedNumber !== null) {
    const distance = Math.abs(stoppedNumber - targetNumber);
    const isClose = distance <= 5;
    const isMedium = distance <= 15;

    return (
      <div className="fixed inset-0 z-40 bg-[#06060f] flex flex-col items-center justify-center p-6">
        <div className="text-center animate-scale-in">
          {isClose && <p className="text-green-400 text-sm font-medium mb-2">🎉 Amazing Stop!</p>}
          {isMedium && !isClose && <p className="text-amber-400 text-sm font-medium mb-2">👍 Good Try!</p>}
          {!isMedium && <p className="text-red-400 text-sm font-medium mb-2">😅 Better Luck Next Time</p>}

          <div className="relative inline-block">
            <div className={`absolute -inset-4 rounded-3xl blur-xl ${isClose ? 'bg-green-500/30' : isMedium ? 'bg-amber-500/30' : 'bg-red-500/30'}`} />
            <div className={`relative w-36 h-36 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border ${isClose ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30 border-green-400/20' : isMedium ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30 border-amber-400/20' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30 border-red-400/20'}`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent" />
              <span className="text-6xl font-extrabold text-white drop-shadow-lg relative z-10">{stoppedNumber}</span>
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <p className="text-gray-400 text-sm">Target: <span className="text-violet-400 font-bold">#{targetNumber}</span></p>
            <p className={`text-sm font-medium ${isClose ? 'text-green-400' : isMedium ? 'text-amber-400' : 'text-red-400'}`}>
              Distance: {distance} {isClose ? '🔥' : isMedium ? '✨' : '💪'}
            </p>
          </div>
          <p className="text-gray-600 text-xs mt-3">Results announced after tournament ends</p>
          <button onClick={onClose} className="mt-6 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold active:scale-[0.97] transition-transform shadow-xl shadow-violet-600/20 border border-violet-400/20">
            ✓ Done
          </button>
        </div>
      </div>
    );
  }

  // Playing / Stopping phase - VERTICAL SLOT MACHINE
  return (
    <div className="fixed inset-0 z-40 bg-[#06060f] flex flex-col items-center justify-center p-6">
      {/* Target hint */}
      <div className="absolute top-6 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs flex items-center justify-center gap-1.5"><TargetIcon /> Stop closest to <span className="text-violet-400 font-bold">#{targetNumber}</span></p>
      </div>

      {/* Slot machine container */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-6 bg-violet-600/10 rounded-3xl blur-2xl" />

        {/* Slot window */}
        <div className="relative w-40 h-[280px] number-slot-container rounded-2xl border-2 border-violet-500/30 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] shadow-2xl shadow-violet-900/40">
          {/* Center highlight line */}
          <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[52px] rounded-lg border-2 border-violet-400/40 bg-violet-500/10 z-20 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400/5 via-violet-400/10 to-violet-400/5" />
            {/* Side arrows */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 text-violet-400/60 text-xs">▶</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 text-violet-400/60 text-xs">◀</div>
          </div>

          {/* Numbers */}
          <div className="flex flex-col items-center justify-center h-full py-2">
            {visibleNumbers.map((num, i) => {
              const isCenter = i === 3; // index 3 is center of 7 items
              return (
                <div key={`${num}-${i}`} className={`flex items-center justify-center transition-all duration-75 ${isCenter ? 'h-[52px] my-0' : 'h-[30px] my-0.5'}`}>
                  <span className={`font-bold transition-all duration-75 ${isCenter ? 'text-4xl text-white drop-shadow-lg' : i === 2 || i === 4 ? 'text-lg text-gray-500' : 'text-sm text-gray-700'}`}>
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STOP Button */}
      <button
        onClick={handleStop}
        disabled={phase === 'stopping'}
        className={`mt-10 px-16 py-5 rounded-2xl text-white font-extrabold text-2xl active:scale-[0.95] transition-all border ${phase === 'stopping' ? 'bg-gray-700 border-gray-600 cursor-wait' : 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400/30 shadow-2xl shadow-red-600/30 animate-pulse-glow-red'}`}
      >
        {phase === 'stopping' ? '⏳ Stopping...' : '⬛ STOP'}
      </button>

      {/* Speed indicator */}
      {phase === 'playing' && (
        <div className="mt-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/60 text-xs">Numbers sliding...</span>
        </div>
      )}
      {phase === 'stopping' && (
        <div className="mt-4 w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-100" style={{ width: `${stopProgress * 100}%` }} />
        </div>
      )}
    </div>
  );
}

/* ============ RESULTS SCREEN ============ */
function ResultsScreen({ tournament, onBack }: { tournament: Tournament; onBack: () => void }) {
  const { calculatePrizePool } = useApp();
  if (!tournament.results?.length) return (
    <div className="fixed inset-0 z-40 bg-[#06060f] p-4 pt-6">
      <div className="flex items-center gap-3 mb-4"><button onClick={onBack} className="text-white"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Results</h2></div>
      <p className="text-gray-600 text-center mt-16">Results not yet calculated</p>
    </div>
  );

  const pool = calculatePrizePool(tournament);
  return (
    <div className="fixed inset-0 z-40 bg-[#06060f] overflow-y-auto">
      <div className="p-4 pt-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack} className="text-white/70 hover:text-white"><ArrowLeftIcon /></button>
          <h2 className="text-lg font-bold text-white">🏆 {tournament.name} — Results</h2>
        </div>

        <div className="bg-gradient-to-r from-violet-600/15 to-indigo-600/15 border border-violet-500/15 rounded-2xl p-5 mb-4 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Target Number</p>
          <p className="text-4xl font-extrabold text-violet-400 mt-1">#{tournament.targetNumber}</p>
          <p className="text-gray-500 text-xs mt-1">Net Prize Pool: ₹{pool.net}</p>
        </div>

        {tournament.results.some(r => r.isTie) && (
          <div className="bg-amber-500/10 border border-amber-500/15 rounded-xl p-3 mb-4 text-center">
            <p className="text-amber-400 text-xs">⚡ Tie detected! Prize split equally.</p>
          </div>
        )}

        <div className="space-y-2">
          {tournament.results.map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${r.winAmount > 0 ? 'glass-violet' : 'glass'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/20' : i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' : i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 'bg-white/5 text-gray-500'}`}>{r.rank}</div>
                <div>
                  <p className="text-white text-sm font-medium">{r.name}</p>
                  <p className="text-gray-500 text-xs">Stopped: {r.stoppedNumber}{r.isTie ? ` (Tied ×${r.tieShare})` : ''}</p>
                </div>
              </div>
              {r.winAmount > 0 ? <p className="text-green-400 font-bold text-sm">₹{r.winAmount.toFixed(2)}</p> : <p className="text-gray-600 text-xs">—</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ TOURNAMENT CARD ============ */
function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { getTournamentStatus, getUserJoinInfo, joinTournament, calculatePrizePool, retryPlay, recordStop } = useApp();
  const [showPrizePool, setShowPrizePool] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const status = getTournamentStatus(tournament);
  const joinInfo = getUserJoinInfo(tournament.id);
  const pool = calculatePrizePool(tournament);
  const joinCount = tournament.joiners.length;

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = status === 'upcoming' ? tournament.startTime - now : status === 'live' ? tournament.endTime - now : 0;
      if (diff <= 0) { setTimeLeft(''); return; }
      const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [status, tournament.startTime, tournament.endTime]);

  const fmt = (ts: number) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => {
      const ok = joinTournament(tournament.id);
      setJoining(false);
      if (!ok) alert('Could not join. Check wallet balance or already joined.');
    }, 600);
  };

  const handleRetry = () => {
    if (retryPlay(tournament.id)) setShowRetry(false);
    else alert('Insufficient balance.');
  };

  const btnText = () => {
    if (status === 'ended') return 'Ended';
    if (!joinInfo?.joined) return `Join · ₹${tournament.entryFee}`;
    if (status === 'upcoming') return 'Joined ✓';
    if (joinInfo.played) return 'Played ✓';
    return '▶ Play Now';
  };

  const btnStyle = () => {
    if (status === 'ended') return 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5';
    if (!joinInfo?.joined) return 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 border border-violet-400/20';
    if (status === 'upcoming') return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 cursor-default';
    if (joinInfo.played) return 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default';
    return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 animate-pulse-glow-green border border-green-400/20';
  };

  return (
    <>
      <div className="mx-4 mt-3 glass rounded-2xl overflow-hidden animate-slide-up hover:border-violet-500/10 transition-colors">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-violet-400 font-extrabold text-lg">₹{tournament.entryFee}</span>
            <span className="text-gray-600 text-[10px] uppercase tracking-wider">Entry</span>
          </div>
          {status === 'live' && <span className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />Live</span>}
          {status === 'upcoming' && <span className="flex items-center gap-1 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">⏳ Upcoming</span>}
          {status === 'ended' && <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Ended</span>}
          <button onClick={() => setShowPrizePool(true)} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 text-amber-400 text-[11px] font-bold hover:bg-amber-500/15 transition-colors">
            <TrophyIcon /> ₹{pool.net}
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5">
          <h3 className="text-white font-bold text-[15px] flex items-center gap-2">
            {status === 'live' && <FlameIcon />}
            {tournament.name}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
            <span className="flex items-center gap-1"><ClockIcon /> {fmt(tournament.startTime)} – {fmt(tournament.endTime)}</span>
            <span className="flex items-center gap-1"><UsersIcon /> {joinCount}/{tournament.maxJoins}</span>
          </div>

          {status === 'live' && timeLeft && <p className="text-gray-600 text-[11px] mt-1.5">Ends in <span className="text-white/50 tabular-nums">{timeLeft}</span></p>}
          {status === 'upcoming' && timeLeft && <p className="text-cyan-400/60 text-[11px] mt-1.5">Starts in <span className="text-cyan-400 tabular-nums">{timeLeft}</span></p>}

          {/* Progress bar */}
          <div className="mt-3 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(joinCount / tournament.maxJoins) * 100}%` }} />
          </div>

          {/* Ended state */}
          {status === 'ended' && (
            <div className="mt-3">
              {tournament.results
                ? <button onClick={() => setShowResults(true)} className="w-full py-2.5 rounded-xl glass-violet text-violet-400 font-medium text-sm hover:bg-violet-500/10 transition-colors">🏆 View Results</button>
                : <p className="text-gray-600 text-xs text-center">Tournament ended, try your luck next time</p>
              }
            </div>
          )}

          {/* Action buttons */}
          {status !== 'ended' && (
            <div className="mt-3 space-y-2">
              <button
                onClick={!joinInfo?.joined ? handleJoin : joinInfo?.joined && !joinInfo.played && status === 'live' ? () => setShowGame(true) : undefined}
                disabled={(joinInfo?.joined && status === 'upcoming') || (joinInfo?.joined && joinInfo.played)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${btnStyle()} ${joining ? 'opacity-50' : ''}`}
              >
                {joining ? '⏳ Processing...' : btnText()}
              </button>
              {joinInfo?.joined && !joinInfo.played && (status === 'live' || status === 'upcoming') && (
                <button onClick={() => setShowHowTo(true)} className="w-full py-2 rounded-xl glass text-gray-500 text-xs hover:text-gray-300 transition-colors">How to Play?</button>
              )}
              {joinInfo?.joined && joinInfo.played && status === 'live' && (
                <button onClick={() => setShowRetry(true)} className="w-full py-2 rounded-xl glass-violet text-violet-400 text-xs font-medium hover:bg-violet-500/10 transition-colors">🔄 Retry Once · ₹{tournament.entryFee}</button>
              )}
            </div>
          )}
        </div>
      </div>

      {showPrizePool && <PrizePoolPopup tournament={tournament} onClose={() => setShowPrizePool(false)} />}
      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
      {showGame && <NumberSlidingGame targetNumber={tournament.targetNumber} onStop={n => recordStop(tournament.id, n)} onClose={() => setShowGame(false)} onShowHowTo={() => setShowHowTo(true)} />}
      {showResults && <ResultsScreen tournament={tournament} onBack={() => setShowResults(false)} />}
      {showRetry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-scale-in" onClick={() => setShowRetry(false)}>
          <div className="bg-gradient-to-b from-[#1c1c3a] to-[#12122a] border border-violet-500/20 rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-1">Play Again?</h3>
            <p className="text-gray-400 text-sm mb-5">₹{tournament.entryFee} will be deducted from your wallet.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowRetry(false)} className="flex-1 py-3 rounded-xl glass text-gray-300 font-medium">Cancel</button>
              <button onClick={handleRetry} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-600/20">Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============ NEXT COUNTDOWN ============ */
function NextCountdown() {
  const { state, getTournamentStatus } = useApp();
  const upcoming = state.tournaments.filter(t => getTournamentStatus(t) === 'upcoming').sort((a, b) => a.startTime - b.startTime);
  const [cd, setCd] = useState('');

  useEffect(() => {
    if (!upcoming.length) return;
    const target = upcoming[0].startTime;
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setCd('Starting!'); return; }
      const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      setCd(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [upcoming]);

  if (!upcoming.length) return null;
  return (
    <div className="mx-4 mt-4 mb-4 glass rounded-2xl p-5 text-center border-cyan-500/10">
      <p className="text-cyan-400/80 font-medium text-sm">⏳ Next Tournament In</p>
      <p className="text-white font-extrabold text-3xl mt-2 tabular-nums">{cd}</p>
      <p className="text-gray-600 text-xs mt-1">{upcoming[0].name} · ₹{upcoming[0].entryFee} Entry</p>
    </div>
  );
}

/* ============ MAIN BATTLE PAGE ============ */
export default function BattlePage() {
  const { state, setTab } = useApp();
  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#06060f]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-extrabold shadow-lg shadow-violet-600/30 border border-violet-400/20">N</div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">NumberStop</span>
            <span className="text-violet-400 text-[8px] ml-1 uppercase tracking-widest">Beta</span>
          </div>
        </div>
        <button onClick={() => setTab('wallet')} className="w-9 h-9 rounded-full overflow-hidden border-2 border-violet-500/30 shadow-lg shadow-violet-600/10 hover:border-violet-400/50 transition-colors">
          {state.user
            ? <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: state.user.avatarColor }}>{state.user.avatarLetter}</div>
            : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500"><UsersIcon /></div>
          }
        </button>
      </div>

      <BannerCarousel />
      <Announcements items={state.announcements} />

      <div className="mt-2">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-bold text-sm flex items-center gap-2 uppercase tracking-wider"><SwordIcon /> Tournaments</h2>
        </div>
        {state.tournaments.map(t => <TournamentCard key={t.id} tournament={t} />)}
        <NextCountdown />
      </div>
    </div>
  );
}
