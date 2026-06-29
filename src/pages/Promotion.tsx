import { useState, useRef } from 'react';
import { useApp } from '../store';

const ArrowLeftIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ShareIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 8l6 4-6 4V8z"/></svg>;
const GiftIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>;
const CopyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400"><polyline points="20 6 9 17 4 12"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Loader = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-violet-400 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

function useDoubleTap(double: () => void, single: () => void, delay = 300) {
  const lastTap = useRef(0);
  const timer = useRef<number | null>(null);
  return () => {
    const now = Date.now();
    if (now - lastTap.current < delay) { if (timer.current) clearTimeout(timer.current); double(); }
    else { timer.current = window.setTimeout(single, delay); }
    lastTap.current = now;
  };
}

type Sub = 'main' | 'yt' | 'yt-hist' | 'refer' | 'refer-hist';

export default function PromotionPage() {
  const { state, submitYTPromotion } = useApp();
  const user = state.user;
  const [sub, setSub] = useState<Sub>('main');
  const [link, setLink] = useState('');
  const [tier, setTier] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const submitYT = () => {
    if (!link.trim() || (!link.includes('youtube.com') && !link.includes('youtu.be'))) { alert('Enter a valid YouTube link'); return; }
    submitYTPromotion(link, tier);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setLink(''); setSub('main'); }, 2000);
  };

  const copyCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {
      const ta = document.createElement('textarea'); ta.value = user.referralCode; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareApp = () => {
    const data = { title: 'NumberStop', text: `Join NumberStop & win real money! Code: ${user?.referralCode || ''}`, url: window.location.href };
    if (navigator.share) navigator.share(data).catch(() => {}); else { navigator.clipboard.writeText(`${data.text} ${data.url}`); alert('Link copied!'); }
  };

  const handleYTTap = useDoubleTap(() => setSub('yt-hist'), () => setSub('yt'));
  const handleRefTap = useDoubleTap(() => setSub('refer-hist'), () => setSub('refer'));

  // YT History
  if (sub === 'yt-hist') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">YT Promotion History</h2></div>
      {!state.ytPromotions.length ? <p className="text-gray-600 text-center mt-20">No promotions yet</p> : (
        <div className="space-y-2">{[...state.ytPromotions].reverse().map(p => (
          <div key={p.id} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between"><p className="text-white text-sm font-medium truncate max-w-[200px]">{p.videoLink}</p>
              <div className="flex items-center gap-1.5">{p.status === 'pending' && <><Loader /><span className="text-violet-400 text-xs">Pending</span></>}{p.status === 'approved' && <><CheckIcon /><span className="text-green-400 text-xs">+₹{p.requestedAmount}</span></>}{p.status === 'rejected' && <span className="text-red-400 text-xs">Rejected</span>}</div>
            </div>
            <p className="text-gray-600 text-xs mt-1 flex items-center gap-1"><ClockIcon />{new Date(p.createdAt).toLocaleDateString('en-IN')} · {p.viewRange}</p>
          </div>
        ))}</div>
      )}
    </div>
  );

  // YT Promo
  if (sub === 'yt') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white flex items-center gap-2"><PlayIcon /> YouTube Promotion</h2></div>
      {submitted ? (
        <div className="text-center mt-20 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20"><CheckIcon /></div>
          <p className="text-green-400 font-bold mt-4">Submitted!</p>
          <p className="text-gray-500 text-sm mt-1">Admin will review your video</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-5">Promote NumberStop on YouTube & earn cash rewards!</p>
          <div className="space-y-2.5 mb-6">
            {state.ytTiers.map((t, i) => (
              <button key={i} onClick={() => setTier(i)} className={`w-full py-4 rounded-2xl border flex items-center justify-between px-5 transition-all ${tier === i ? 'glass-violet border-violet-500/30' : 'glass border-white/5 text-gray-400 hover:border-white/10'}`}>
                <span className="font-medium text-sm">🎬 {t.label}</span><span className="font-bold text-green-400">+₹{t.cash}</span>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="Paste YouTube video link" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" />
            <button onClick={submitYT} className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg active:scale-[0.97] transition-transform shadow-xl shadow-red-600/20 border border-red-400/20">🎬 Submit for Review</button>
          </div>
        </>
      )}
    </div>
  );

  // Referral History
  if (sub === 'refer-hist') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Referral History</h2></div>
      {!state.referralRecords.filter(r => r.referrerUserId === user?.id).length ? <p className="text-gray-600 text-center mt-20">No referrals yet. Share your code!</p> : (
        <div className="space-y-2">{state.referralRecords.filter(r => r.referrerUserId === user?.id).map(r => (
          <div key={r.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-white text-sm font-medium">{r.newUserName}</p><p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1"><ClockIcon />{new Date(r.createdAt).toLocaleDateString('en-IN')}</p></div>
            <span className="text-green-400 font-bold text-sm">+₹{r.bonusAmount}</span>
          </div>
        ))}</div>
      )}
    </div>
  );

  // Refer & Earn
  if (sub === 'refer') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white flex items-center gap-2"><GiftIcon /> Refer & Earn</h2></div>
      <div className="text-center">
        <div className="glass-violet rounded-2xl p-6">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Your Referral Code</p>
          <div className="mt-3 bg-[#06060f] rounded-xl px-6 py-4 inline-block border border-violet-500/20">
            <p className="text-2xl font-extrabold text-white tracking-[0.3em]">{user?.referralCode || '--------'}</p>
          </div>
          <button onClick={copyCode} className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium active:scale-[0.97] transition-transform shadow-lg shadow-violet-600/20 border border-violet-400/20">
            {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy Code</>}
          </button>
        </div>
        <div className="mt-6 glass rounded-2xl p-5 text-left">
          <p className="text-white font-bold text-sm mb-3">How it works</p>
          {['Share your referral code with friends', 'They enter your code during sign-up', `Both of you get ₹${state.referralBonus} instantly!`].map((s, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 last:mb-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{i + 1}</div>
              <p className="text-gray-400 text-sm">{s}</p>
            </div>
          ))}
        </div>
        <button onClick={shareApp} className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-xl shadow-violet-600/20 border border-violet-400/20">
          <ShareIcon /> Share & Invite Friends
        </button>
      </div>
    </div>
  );

  // ====== MAIN ======
  return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-8 animate-slide-up">
      <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <span className="text-2xl">💎</span> Promotion
      </h2>

      {/* Share & Download */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={shareApp} className="py-5 rounded-2xl glass-violet flex flex-col items-center gap-2 active:scale-[0.97] transition-transform hover:border-violet-500/20">
          <ShareIcon /><span className="text-white font-medium text-sm">Share App</span>
        </button>
        <button onClick={() => alert('Download coming soon!')} className="py-5 rounded-2xl glass flex flex-col items-center gap-2 active:scale-[0.97] transition-transform border-cyan-500/10 hover:border-cyan-500/20">
          <DownloadIcon /><span className="text-white font-medium text-sm">New Version</span>
        </button>
      </div>

      {/* YouTube Card */}
      <button onClick={handleYTTap} className="w-full glass rounded-2xl p-5 text-left active:scale-[0.98] transition-transform mb-4 hover:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/10"><PlayIcon /></div>
          <div><h3 className="text-white font-bold text-sm">YouTube Promotion</h3><p className="text-gray-500 text-xs">Earn cash promoting us</p></div>
        </div>
        <div className="flex gap-2">
          {state.ytTiers.map((t, i) => (
            <div key={i} className="flex-1 bg-white/[0.03] rounded-xl py-2.5 px-3 text-center border border-white/5">
              <p className="text-white text-xs font-medium">{t.label}</p>
              <p className="text-green-400 text-sm font-bold mt-0.5">₹{t.cash}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-700 text-[10px] mt-3">Tap once → submit · Double-tap → history</p>
      </button>

      {/* Refer Card */}
      <button onClick={handleRefTap} className="w-full glass rounded-2xl p-5 text-left active:scale-[0.98] transition-transform hover:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/10"><GiftIcon /></div>
          <div><h3 className="text-white font-bold text-sm">Refer & Earn</h3><p className="text-gray-500 text-xs">₹{state.referralBonus} per referral</p></div>
        </div>
        <div className="bg-white/[0.03] rounded-xl py-3 px-4 flex items-center justify-between border border-white/5">
          <div><p className="text-gray-600 text-[10px] uppercase tracking-wider">Your Code</p><p className="text-white font-bold tracking-[0.2em]">{user?.referralCode || '--------'}</p></div>
          <span className="text-violet-400/40 text-xs">→</span>
        </div>
        <p className="text-gray-700 text-[10px] mt-3">Tap once → share · Double-tap → history</p>
      </button>
    </div>
  );
}
