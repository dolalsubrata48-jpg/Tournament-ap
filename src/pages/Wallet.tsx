import { useState, useRef } from 'react';
import { useApp, BankDetails } from '../store';

const ArrowLeftIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ArrowDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
const ArrowUpIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CheckCirc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const XCirc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-400"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const Loader = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-violet-400 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const WalletIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>;

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

function QRCode({ amount }: { amount: number }) {
  const cells = 17;
  const pattern = Array.from({ length: cells * cells }, (_, i) => ((amount * 7 + i * 13) % 17) > 7);
  return (
    <div className="bg-white p-3 rounded-2xl inline-block shadow-xl shadow-black/20">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cells}, 1fr)`, width: '168px', height: '168px' }}>
        {pattern.map((f, i) => <div key={i} className={f ? 'bg-gray-900' : 'bg-white'} />)}
      </div>
      <p className="text-gray-900 text-center text-xs font-bold mt-1.5">₹{amount} UPI</p>
    </div>
  );
}

type Sub = 'main' | 'dep-amount' | 'dep-utr' | 'dep-processing' | 'wd' | 'wd-upi' | 'wd-bank' | 'wd-bank-setup' | 'dep-hist' | 'wd-hist';

export default function WalletPage() {
  const { state, submitDeposit, submitWithdrawalUPI, submitWithdrawalBank, saveBankDetails } = useApp();
  const user = state.user;
  const [sub, setSub] = useState<Sub>('main');
  const [depAmt, setDepAmt] = useState(0);
  const [utr, setUtr] = useState('');
  const [lastDepId, setLastDepId] = useState('');
  const [wdAmt, setWdAmt] = useState('');
  const [upi1, setUpi1] = useState('');
  const [upi2, setUpi2] = useState('');
  const [bk, setBk] = useState<BankDetails>({ bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', mobileNumber: '' });
  const [bkConfirm, setBkConfirm] = useState('');
  const [bkVerifying, setBkVerifying] = useState(false);

  const depAmounts = [100, 200, 300, 500, 1000];
  const lastDep = lastDepId === 'latest' ? [...state.deposits].sort((a, b) => b.createdAt - a.createdAt)[0] : state.deposits.find(d => d.id === lastDepId);

  const handleDepTap = useDoubleTap(() => setSub('dep-hist'), () => setSub('dep-amount'));
  const handleWdTap = useDoubleTap(() => setSub('wd-hist'), () => setSub('wd'));


  const doDeposit = () => {
    if (utr.length !== 12) { alert('Enter 12-digit UTR'); return; }
    submitDeposit(depAmt, utr);
    setUtr('');
    setLastDepId('latest');
    setSub('dep-processing');
  };

  const doUPIWd = () => {
    const amt = parseInt(wdAmt);
    if (amt < 100 || amt > 10000) { alert('₹100 – ₹10,000'); return; }
    if (upi1 !== upi2) { alert('UPI IDs don\'t match'); return; }
    if (!upi1.includes('@')) { alert('Invalid UPI ID'); return; }
    submitWithdrawalUPI(amt, upi1);
    setUpi1(''); setUpi2(''); setWdAmt('');
    alert('Submitted! Auto-approved in 3s.');
    setSub('main');
  };

  const doBankWd = () => {
    const amt = parseInt(wdAmt);
    if (amt < 100 || amt > 10000) { alert('₹100 – ₹10,000'); return; }
    submitWithdrawalBank(amt);
    setWdAmt('');
    alert('Submitted! Auto-approved in 3s.');
    setSub('main');
  };

  const doBankSetup = () => {
    if (!bk.bankName || !bk.accountHolderName || !bk.ifscCode || !bk.mobileNumber) { alert('Fill all fields'); return; }
    if (bk.accountNumber !== bkConfirm) { alert('Account numbers don\'t match'); return; }
    setBkVerifying(true);
    setTimeout(() => { saveBankDetails(bk); setBkVerifying(false); setSub('wd'); }, 3000);
  };

  if (!user) return null;

  // ====== Deposit Amount Selection ======
  if (sub === 'dep-amount') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Add Money</h2></div>
      <div className="space-y-2.5">
        {depAmounts.map(a => (
          <button key={a} onClick={() => { setDepAmt(a); setSub('dep-utr'); }} className="w-full py-4 rounded-2xl glass hover:border-violet-500/20 transition-colors text-white font-bold text-lg flex items-center justify-between px-6 active:scale-[0.98]">
            <span>₹{a}</span><span className="text-violet-400/60">→</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ====== Deposit UTR ======
  if (sub === 'dep-utr') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('dep-amount')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Pay ₹{depAmt}</h2></div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-violet-600/10 rounded-3xl blur-xl" />
          <QRCode amount={depAmt} />
        </div>
        <p className="text-gray-400 text-sm mt-4">Scan QR to pay ₹{depAmt}</p>
        <div className="w-full mt-6 space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block uppercase tracking-wider">UTR / Transaction Ref (12 digits)</label>
            <input type="text" maxLength={12} value={utr} onChange={e => setUtr(e.target.value.replace(/\D/g, ''))} placeholder="000000000000" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none text-lg font-mono tracking-widest" />
          </div>
          <button onClick={doDeposit} disabled={utr.length !== 12} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] transition-transform shadow-xl shadow-violet-600/20 border border-violet-400/20">Done ✓</button>
        </div>
      </div>
    </div>
  );

  // ====== Deposit Processing ======
  if (sub === 'dep-processing' && lastDep) {
    const isPending = lastDep.status === 'pending';
    return (
      <div className="min-h-screen bg-[#06060f] flex flex-col items-center justify-center p-6">
        {isPending ? (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full border-4 border-violet-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-white font-bold mt-6 text-lg">Verifying Payment...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we verify your transaction</p>
          </div>
        ) : lastDep.status === 'approved' ? (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border-2 border-green-500/20"><CheckCirc /></div>
            <p className="text-green-400 font-bold text-xl mt-5">Payment Success!</p>
            <p className="text-gray-400 text-sm mt-2">₹{lastDep.amount} added to wallet</p>
            <button onClick={() => setSub('main')} className="mt-8 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-xl shadow-green-600/20">Back to Wallet</button>
          </div>
        ) : (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border-2 border-red-500/20"><XCirc /></div>
            <p className="text-red-400 font-bold text-xl mt-5">Payment Rejected</p>
            <p className="text-gray-400 text-sm mt-2">{lastDep.rejectReason || 'Could not verify'}</p>
            <button onClick={() => setSub('main')} className="mt-8 px-10 py-3.5 rounded-2xl bg-red-600 text-white font-bold">Back to Wallet</button>
          </div>
        )}
      </div>
    );
  }

  // ====== Deposit History ======
  if (sub === 'dep-hist') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Deposit History</h2></div>
      {!state.deposits.length ? <p className="text-gray-600 text-center mt-20">No deposits yet</p> : (
        <div className="space-y-2">{[...state.deposits].reverse().map(d => (
          <div key={d.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-white font-medium">₹{d.amount}</p><p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1"><ClockIcon />{new Date(d.createdAt).toLocaleDateString('en-IN')}</p></div>
            <div className="flex items-center gap-1.5">{d.status === 'pending' && <><Loader /><span className="text-violet-400 text-xs">Pending</span></>}{d.status === 'approved' && <><CheckCirc /><span className="text-green-400 text-xs">Success</span></>}{d.status === 'rejected' && <><XCirc /><span className="text-red-400 text-xs">Rejected</span></>}</div>
          </div>
        ))}</div>
      )}
    </div>
  );

  // ====== Withdraw Method ======
  if (sub === 'wd') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Withdraw</h2></div>
      <p className="text-gray-500 text-sm mb-4">Choose method</p>
      <div className="space-y-3">
        <button onClick={() => setSub('wd-upi')} className="w-full py-4 rounded-2xl glass text-white font-bold flex items-center justify-between px-6 hover:border-violet-500/20 transition-colors"><span>📱 UPI</span><span className="text-violet-400/60">→</span></button>
        <button onClick={() => setSub(user.bankDetails ? 'wd-bank' : 'wd-bank-setup')} className="w-full py-4 rounded-2xl glass text-white font-bold flex items-center justify-between px-6 hover:border-violet-500/20 transition-colors"><span>🏦 Bank Transfer</span><span className="text-violet-400/60">→</span></button>
      </div>
    </div>
  );

  // ====== UPI Withdraw ======
  if (sub === 'wd-upi') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('wd')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">UPI Withdrawal</h2></div>
      <div className="space-y-4">
        <div><label className="text-gray-500 text-xs mb-1.5 block uppercase tracking-wider">UPI ID</label><input type="text" value={upi1} onChange={e => setUpi1(e.target.value)} placeholder="name@upi" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" /></div>
        <div><label className="text-gray-500 text-xs mb-1.5 block uppercase tracking-wider">Confirm UPI ID</label><input type="text" value={upi2} onChange={e => setUpi2(e.target.value)} placeholder="name@upi" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" /></div>
        <div><label className="text-gray-500 text-xs mb-1.5 block uppercase tracking-wider">Amount (₹100 – ₹10,000)</label><input type="number" value={wdAmt} onChange={e => setWdAmt(e.target.value)} placeholder="Enter amount" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" /></div>
        <button onClick={doUPIWd} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg active:scale-[0.97] transition-transform shadow-xl shadow-orange-500/20">Submit</button>
      </div>
    </div>
  );

  // ====== Bank Setup ======
  if (sub === 'wd-bank-setup') {
    if (bkVerifying) return <div className="min-h-screen bg-[#06060f] flex flex-col items-center justify-center"><div className="w-20 h-20 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" /><p className="text-white font-bold mt-5">Verifying Bank Details...</p></div>;
    return (
      <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('wd')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Bank Details</h2></div>
        <div className="space-y-3">
          {[
            { v: bk.bankName, set: (v: string) => setBk({...bk, bankName: v}), p: 'Bank Name' },
            { v: bk.accountHolderName, set: (v: string) => setBk({...bk, accountHolderName: v}), p: 'Account Holder Name' },
            { v: bk.accountNumber, set: (v: string) => setBk({...bk, accountNumber: v}), p: 'Account Number' },
            { v: bkConfirm, set: setBkConfirm, p: 'Confirm Account Number' },
            { v: bk.ifscCode, set: (v: string) => setBk({...bk, ifscCode: v.toUpperCase()}), p: 'IFSC Code' },
            { v: bk.mobileNumber, set: (v: string) => setBk({...bk, mobileNumber: v}), p: 'Linked Mobile Number' },
          ].map((f, i) => <input key={i} type="text" value={f.v} onChange={e => f.set(e.target.value)} placeholder={f.p} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" />)}
          <button onClick={doBankSetup} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg active:scale-[0.97] transition-transform shadow-xl shadow-violet-600/20 border border-violet-400/20">Verify & Save</button>
        </div>
      </div>
    );
  }

  // ====== Bank Withdraw ======
  if (sub === 'wd-bank') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('wd')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Bank Withdrawal</h2></div>
      {user.bankDetails && (
        <div className="glass-violet rounded-xl p-4 mb-5">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Saved Details</p>
          <p className="text-white text-sm font-medium">{user.bankDetails.accountHolderName}</p>
          <p className="text-gray-400 text-xs mt-0.5">A/C: {user.bankDetails.accountNumber.slice(0,4)}xxxx{user.bankDetails.accountNumber.slice(-4)}</p>
          <p className="text-gray-400 text-xs">IFSC: {user.bankDetails.ifscCode}</p>
        </div>
      )}
      <div className="space-y-4">
        <div><label className="text-gray-500 text-xs mb-1.5 block uppercase tracking-wider">Amount (₹100 – ₹10,000)</label><input type="number" value={wdAmt} onChange={e => setWdAmt(e.target.value)} placeholder="Enter amount" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:border-violet-500 focus:outline-none" /></div>
        <button onClick={doBankWd} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg active:scale-[0.97] transition-transform shadow-xl shadow-orange-500/20">Submit</button>
      </div>
    </div>
  );

  // ====== Withdrawal History ======
  if (sub === 'wd-hist') return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6"><button onClick={() => setSub('main')} className="text-white/70"><ArrowLeftIcon /></button><h2 className="text-lg font-bold text-white">Withdrawal History</h2></div>
      {!state.withdrawals.length ? <p className="text-gray-600 text-center mt-20">No withdrawals yet</p> : (
        <div className="space-y-2">{[...state.withdrawals].reverse().map(w => (
          <div key={w.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-white font-medium">₹{w.amount}</p><p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1"><ClockIcon />{new Date(w.createdAt).toLocaleDateString('en-IN')} · {w.method.toUpperCase()}</p></div>
            <div className="flex items-center gap-1.5">{w.status === 'pending' && <><Loader /><span className="text-violet-400 text-xs">Pending</span></>}{w.status === 'approved' && <><CheckCirc /><span className="text-green-400 text-xs">Success</span></>}{w.status === 'rejected' && <><XCirc /><span className="text-red-400 text-xs">Rejected</span></>}</div>
          </div>
        ))}</div>
      )}
    </div>
  );

  // ====== MAIN WALLET ======
  return (
    <div className="min-h-screen bg-[#06060f] p-4 pt-8 animate-slide-up">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-violet-600/10 blur-xl animate-glow-pulse" />
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl shadow-violet-600/20 border-[3px] border-violet-500/30" style={{ backgroundColor: user.avatarColor }}>
            {user.avatarLetter}
          </div>
        </div>
        <h2 className="text-white font-bold text-xl mt-4">{user.name}</h2>
        <p className="text-gray-600 text-xs">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Games Played</p>
          <p className="text-white font-extrabold text-3xl mt-1">{user.totalGamesPlayed}</p>
        </div>
        <div className="glass-violet rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-[10px] uppercase tracking-wider">Wallet Balance</p>
          <p className="text-white font-extrabold text-3xl mt-1">₹{user.walletBalance.toFixed(0)}</p>
          <p className="text-violet-400/40 text-[10px]">{user.walletBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={handleDepTap} className="py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-xl shadow-green-600/15 border border-green-400/20">
          <ArrowDownIcon /> Deposit
        </button>
        <button onClick={handleWdTap} className="py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-xl shadow-orange-500/15 border border-orange-400/20">
          <ArrowUpIcon /> Withdraw
        </button>
      </div>
      <p className="text-gray-700 text-[10px] text-center mt-1.5">Double-tap for history</p>

      {/* Referral Code */}
      {user.referralCode && (
        <div className="mt-5 glass-violet rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Your Referral Code</p>
          <p className="text-white font-extrabold text-xl tracking-[0.3em] mt-1">{user.referralCode}</p>
          <p className="text-violet-400/40 text-[10px] mt-1">Share to earn ₹{state.referralBonus}/referral</p>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mt-5">
        <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Recent Transactions</h3>
        {[...state.deposits.filter(d => d.status === 'approved'), ...state.withdrawals.filter(w => w.status === 'approved')]
          .sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
          .map((t, i) => {
            const isD = 'utr' in t;
            return (
              <div key={i} className="glass rounded-xl p-3.5 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isD ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>{isD ? <ArrowDownIcon /> : <ArrowUpIcon />}</div>
                  <div><p className="text-white text-sm font-medium">{isD ? 'Deposit' : 'Withdrawal'}</p><p className="text-gray-600 text-xs flex items-center gap-1"><ClockIcon />{new Date(t.createdAt).toLocaleDateString('en-IN')}</p></div>
                </div>
                <span className={`font-bold ${isD ? 'text-green-400' : 'text-orange-400'}`}>{isD ? '+' : '-'}₹{t.amount}</span>
              </div>
            );
          })}
        {!state.deposits.length && !state.withdrawals.length && (
          <div className="text-center py-8">
            <div className="text-gray-700 inline-block"><WalletIcon /></div>
            <p className="text-gray-600 text-sm mt-2">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-8 mb-6 text-center">
        <button onClick={() => { if (confirm('Logout & reset all data?')) { localStorage.removeItem('numberstop_state'); window.location.reload(); } }} className="text-gray-700 text-xs underline hover:text-gray-500 transition-colors">Logout & Reset</button>
      </div>
    </div>
  );
}
