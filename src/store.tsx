import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarLetter: string;
  avatarColor: string;
  referralCode: string;
  referredBy?: string;
  hasUsedReferral: boolean;
  bankDetails?: BankDetails;
  walletBalance: number;
  totalGamesPlayed: number;
}

export interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  mobileNumber: string;
}

export interface TournamentJoiner {
  userId: string;
  name: string;
  stoppedNumber: number | null;
  playCount: number;
  joinTime: number;
}

export interface TournamentResult {
  rank: number;
  userId: string;
  name: string;
  stoppedNumber: number;
  winAmount: number;
  isTie?: boolean;
  tieShare?: number;
}

export interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  maxJoins: number;
  startTime: number;
  endTime: number;
  targetNumber: number;
  joiners: TournamentJoiner[];
  results?: TournamentResult[];
  minJoiners?: number;
}

export interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  utr: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank';
  upiId?: string;
  bankDetails?: BankDetails;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: number;
}

export interface YTPromotion {
  id: string;
  userId: string;
  videoLink: string;
  viewRange: string;
  requestedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: number;
}

export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  referrerName: string;
  newUserId: string;
  newUserName: string;
  bonusAmount: number;
  createdAt: number;
}

export type MainTab = 'battle' | 'wallet' | 'promotion';

export interface AppState {
  screen: 'splash' | 'auth' | 'main';
  tab: MainTab;
  user: User | null;
  tournaments: Tournament[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  ytPromotions: YTPromotion[];
  referralRecords: ReferralRecord[];
  announcements: string[];
  referralBonus: number;
  ytTiers: { label: string; cash: number }[];
}

const AVATAR_COLORS = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6','#f97316','#6366f1','#3b82f6','#e11d48'];
const PLATFORM_FEE = 0.20;

const MOCK_NAMES = [
  'Rahul K','Priya S','Amit D','Sneha R','Vikram P','Anita M','Ravi S','Deepa N',
  'Suresh G','Meena T','Arjun B','Kavita L','Rajesh W','Pooja J','Manish F','Sunita H',
  'Devendra Q','Nisha A','Kiran V','Lakshmi Z','Sanjay C','Ritu E','Mohan I','Divya O',
  'Tarun U','Swati Y','Rohan K','Neha P','Ashok M','Bela D'
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function createMockJoiners(count: number, playedRatio: number, target?: number): TournamentJoiner[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const hasPlayed = Math.random() < playedRatio;
    let stoppedNumber: number | null = null;
    if (hasPlayed) {
      if (target !== undefined) {
        stoppedNumber = Math.max(1, Math.min(100, target + Math.floor(Math.random() * 40) - 20));
      } else {
        stoppedNumber = Math.floor(Math.random() * 100) + 1;
      }
    }
    return {
      userId: `mock_${i}_${generateId().slice(0,6)}`,
      name: MOCK_NAMES[i % MOCK_NAMES.length],
      stoppedNumber,
      playCount: hasPlayed ? 1 : 0,
      joinTime: now - (count - i) * 120000,
    };
  });
}

function buildInitialTournaments(): Tournament[] {
  const now = Date.now();
  const H = 3600000;

  const liveJoiners = createMockJoiners(33, 0.6, 39);
  const endedJoiners = createMockJoiners(25, 1.0, 55);

  const target = 55;
  const sorted = [...endedJoiners]
    .filter(j => j.stoppedNumber !== null)
    .sort((a, b) => Math.abs(a.stoppedNumber! - target) - Math.abs(b.stoppedNumber! - target));

  const totalPool = 25 * 10;
  const platformFee = totalPool * PLATFORM_FEE;
  const net = totalPool - platformFee;
  const prizes = [net * 0.6, net * 0.3, net * 0.1];

  const results: TournamentResult[] = sorted.map((j, i) => ({
    rank: i + 1,
    userId: j.userId,
    name: j.name,
    stoppedNumber: j.stoppedNumber!,
    winAmount: i < 3 ? prizes[i] : 0,
  }));

  return [
    {
      id: 't1',
      name: 'Morning Rush',
      entryFee: 20,
      maxJoins: 50,
      startTime: now - H,
      endTime: now + 2 * H,
      targetNumber: 39,
      joiners: liveJoiners,
      minJoiners: 3,
    },
    {
      id: 't2',
      name: 'Afternoon Blaze',
      entryFee: 50,
      maxJoins: 100,
      startTime: now + 2 * H,
      endTime: now + 5 * H,
      targetNumber: 73,
      joiners: createMockJoiners(12, 0, 73),
      minJoiners: 3,
    },
    {
      id: 't3',
      name: 'Night Sprint',
      entryFee: 10,
      maxJoins: 30,
      startTime: now - 4 * H,
      endTime: now - 2 * H,
      targetNumber: 55,
      joiners: endedJoiners,
      results,
      minJoiners: 3,
    },
  ];
}

function getInitialState(): AppState {
  return {
    screen: 'splash',
    tab: 'battle',
    user: null,
    tournaments: buildInitialTournaments(),
    deposits: [],
    withdrawals: [],
    ytPromotions: [],
    referralRecords: [],
    announcements: [
      '🎉 Welcome to NumberStop! Join the Morning Rush tournament now!',
      '💰 Prize pool grows with every joiner — don\'t miss out!',
      '🏆 Stop the closest number and win real cash!',
      '⚡ New tournaments starting every hour!',
    ],
    referralBonus: 20,
    ytTiers: [
      { label: '1K+ views', cash: 100 },
      { label: '10K+ views', cash: 1000 },
    ],
  };
}

interface AppContextType {
  state: AppState;
  completeSplash: () => void;
  login: (name: string, email: string, referralCode?: string) => void;
  setTab: (tab: MainTab) => void;
  joinTournament: (tournamentId: string) => boolean;
  recordStop: (tournamentId: string, number: number) => void;
  retryPlay: (tournamentId: string) => boolean;
  submitDeposit: (amount: number, utr: string) => void;
  submitWithdrawalUPI: (amount: number, upiId: string) => void;
  submitWithdrawalBank: (amount: number) => void;
  submitYTPromotion: (videoLink: string, tierIndex: number) => void;
  saveBankDetails: (details: BankDetails) => void;
  getTournamentStatus: (t: Tournament) => 'upcoming' | 'live' | 'ended';
  getUserJoinInfo: (tournamentId: string) => { joined: boolean; played: boolean; stoppedNumber: number | null; playCount: number } | null;
  calculatePrizePool: (t: Tournament) => { total: number; platformFee: number; net: number; first: number; second: number; third: number };
  processNoShows: (tournamentId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('numberstop_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tournaments?.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return getInitialState();
  });

  useEffect(() => {
    localStorage.setItem('numberstop_state', JSON.stringify(state));
  }, [state]);

  // Auto-approve deposits after 3s
  const depositTimers = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    state.deposits.filter(d => d.status === 'pending').forEach(d => {
      if (!depositTimers.current.has(d.id)) {
        depositTimers.current.set(d.id, window.setTimeout(() => {
          setState(prev => ({
            ...prev,
            deposits: prev.deposits.map(dep => dep.id === d.id ? { ...dep, status: 'approved' as const } : dep),
            user: prev.user ? { ...prev.user, walletBalance: prev.user.walletBalance + d.amount } : prev.user,
          }));
          depositTimers.current.delete(d.id);
        }, 3000));
      }
    });
    return () => { depositTimers.current.forEach(t => clearTimeout(t)); };
  }, [state.deposits]);

  // Auto-approve withdrawals after 3s
  const withdrawalTimers = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    state.withdrawals.filter(w => w.status === 'pending').forEach(w => {
      if (!withdrawalTimers.current.has(w.id)) {
        withdrawalTimers.current.set(w.id, window.setTimeout(() => {
          setState(prev => ({
            ...prev,
            withdrawals: prev.withdrawals.map(wd => wd.id === w.id ? { ...wd, status: 'approved' as const } : wd),
          }));
          withdrawalTimers.current.delete(w.id);
        }, 3000));
      }
    });
    return () => { withdrawalTimers.current.forEach(t => clearTimeout(t)); };
  }, [state.withdrawals]);

  const completeSplash = useCallback(() => setState(p => ({ ...p, screen: 'auth' })), []);

  const login = useCallback((name: string, email: string, referralCode?: string) => {
    const userId = generateId();
    const newUser: User = {
      id: userId, name, email,
      avatarLetter: name.charAt(0).toUpperCase(),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      referralCode: generateReferralCode(),
      hasUsedReferral: false, walletBalance: 0, totalGamesPlayed: 0,
    };

    setState(prev => {
      let bonus = 0;
      if (referralCode && referralCode.trim().length >= 4) {
        bonus = prev.referralBonus;
        newUser.hasUsedReferral = true;
        newUser.referredBy = referralCode;
      }
      newUser.walletBalance = bonus;
      return { ...prev, screen: 'main', user: { ...newUser, walletBalance: newUser.walletBalance + bonus } };
    });
  }, []);

  const setTab = useCallback((tab: MainTab) => setState(p => ({ ...p, tab })), []);

  const getTournamentStatus = useCallback((t: Tournament): 'upcoming' | 'live' | 'ended' => {
    const now = Date.now();
    if (now < t.startTime) return 'upcoming';
    if (now <= t.endTime) return 'live';
    return 'ended';
  }, []);

  const getUserJoinInfo = useCallback((tournamentId: string) => {
    if (!state.user) return null;
    const tournament = state.tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;
    const entries = tournament.joiners.filter(j => j.userId === state.user!.id);
    if (entries.length === 0) return { joined: false, played: false, stoppedNumber: null, playCount: 0 };
    const hasUnplayedEntry = entries.some(j => j.stoppedNumber === null);
    const bestStopped = entries
      .filter(j => j.stoppedNumber !== null && j.stoppedNumber > 0)
      .sort((a, b) => Math.abs(a.stoppedNumber! - tournament.targetNumber) - Math.abs(b.stoppedNumber! - tournament.targetNumber))[0]?.stoppedNumber ?? null;
    return { joined: true, played: !hasUnplayedEntry, stoppedNumber: bestStopped, playCount: entries.reduce((s, j) => s + j.playCount, 0) };
  }, [state.user, state.tournaments]);

  const calculatePrizePool = useCallback((t: Tournament) => {
    const total = t.joiners.length * t.entryFee;
    const platformFee = total * PLATFORM_FEE;
    const net = total - platformFee;
    return { total, platformFee: Math.round(platformFee * 100) / 100, net: Math.round(net * 100) / 100, first: Math.round(net * 0.6 * 100) / 100, second: Math.round(net * 0.3 * 100) / 100, third: Math.round(net * 0.1 * 100) / 100 };
  }, []);

  const joinTournament = useCallback((tournamentId: string): boolean => {
    if (!state.user) return false;
    const tournament = state.tournaments.find(t => t.id === tournamentId);
    if (!tournament || state.user.walletBalance < tournament.entryFee || tournament.joiners.length >= tournament.maxJoins) return false;
    if (tournament.joiners.some(j => j.userId === state.user!.id)) return false;

    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, walletBalance: prev.user.walletBalance - tournament.entryFee } : prev.user,
      tournaments: prev.tournaments.map(t => t.id === tournamentId ? { ...t, joiners: [...t.joiners, { userId: prev.user!.id, name: prev.user!.name, stoppedNumber: null, playCount: 0, joinTime: Date.now() }] } : t),
    }));
    return true;
  }, [state.user, state.tournaments]);

  const recordStop = useCallback((tournamentId: string, number: number) => {
    if (!state.user) return;
    setState(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t => {
        if (t.id !== tournamentId) return t;
        let foundFirst = false;
        return { ...t, joiners: t.joiners.map(j => {
          if (j.userId !== prev.user!.id || foundFirst || j.stoppedNumber !== null) return j;
          foundFirst = true;
          return { ...j, stoppedNumber: number, playCount: j.playCount + 1 };
        })};
      }),
      user: prev.user ? { ...prev.user, totalGamesPlayed: prev.user.totalGamesPlayed + 1 } : prev.user,
    }));
  }, [state.user]);

  const retryPlay = useCallback((tournamentId: string): boolean => {
    if (!state.user) return false;
    const tournament = state.tournaments.find(t => t.id === tournamentId);
    if (!tournament || state.user.walletBalance < tournament.entryFee) return false;

    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, walletBalance: prev.user.walletBalance - tournament.entryFee } : prev.user,
      tournaments: prev.tournaments.map(t => t.id !== tournamentId ? t : { ...t, joiners: [...t.joiners, { userId: prev.user!.id, name: prev.user!.name, stoppedNumber: null, playCount: 0, joinTime: Date.now() }] }),
    }));
    return true;
  }, [state.user, state.tournaments]);

  const submitDeposit = useCallback((amount: number, utr: string) => {
    if (!state.user) return;
    setState(prev => ({ ...prev, deposits: [...prev.deposits, { id: generateId(), userId: prev.user!.id, amount, utr, status: 'pending', createdAt: Date.now() }] }));
  }, [state.user]);

  const submitWithdrawalUPI = useCallback((amount: number, upiId: string) => {
    if (!state.user || state.user.walletBalance < amount) return;
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, walletBalance: prev.user.walletBalance - amount } : prev.user,
      withdrawals: [...prev.withdrawals, { id: generateId(), userId: prev.user!.id, amount, method: 'upi' as const, upiId, status: 'pending', createdAt: Date.now() }],
    }));
  }, [state.user]);

  const submitWithdrawalBank = useCallback((amount: number) => {
    if (!state.user || state.user.walletBalance < amount || !state.user.bankDetails) return;
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, walletBalance: prev.user.walletBalance - amount } : prev.user,
      withdrawals: [...prev.withdrawals, { id: generateId(), userId: prev.user!.id, amount, method: 'bank' as const, bankDetails: prev.user!.bankDetails, status: 'pending', createdAt: Date.now() }],
    }));
  }, [state.user]);

  const submitYTPromotion = useCallback((videoLink: string, tierIndex: number) => {
    if (!state.user) return;
    const tier = state.ytTiers[tierIndex];
    if (!tier) return;
    setState(prev => ({ ...prev, ytPromotions: [...prev.ytPromotions, { id: generateId(), userId: prev.user!.id, videoLink, viewRange: tier.label, requestedAmount: tier.cash, status: 'pending', createdAt: Date.now() }] }));
  }, [state.user, state.ytTiers]);

  const saveBankDetails = useCallback((details: BankDetails) => {
    setState(prev => ({ ...prev, user: prev.user ? { ...prev.user, bankDetails: details } : prev.user }));
  }, []);

  const processNoShows = useCallback((tournamentId: string) => {
    setState(prev => {
      const tournament = prev.tournaments.find(t => t.id === tournamentId);
      if (!tournament) return prev;
      const noShowRefunds: { userId: string; amount: number }[] = [];
      const updatedJoiners = tournament.joiners.map(j => {
        if (j.stoppedNumber === null && j.playCount === 0) {
          noShowRefunds.push({ userId: j.userId, amount: tournament.entryFee * 0.5 });
          return { ...j, stoppedNumber: -1 };
        }
        return j;
      });
      const played = updatedJoiners.filter(j => j.stoppedNumber !== null && j.stoppedNumber > 0);
      const sorted = [...played].sort((a, b) => Math.abs(a.stoppedNumber! - tournament.targetNumber) - Math.abs(b.stoppedNumber! - tournament.targetNumber));
      const totalPool = tournament.joiners.length * tournament.entryFee;
      const net = totalPool - totalPool * PLATFORM_FEE;
      const prizeShares = [0.6, 0.3, 0.1];
      const results: TournamentResult[] = [];
      let i = 0, prizeIndex = 0;
      while (i < sorted.length && prizeIndex < 3) {
        const dist = Math.abs(sorted[i].stoppedNumber! - tournament.targetNumber);
        const tied = [sorted[i]];
        while (i + 1 < sorted.length && Math.abs(sorted[i + 1].stoppedNumber! - tournament.targetNumber) === dist) { tied.push(sorted[i + 1]); i++; }
        const totalShare = prizeShares.slice(prizeIndex, prizeIndex + tied.length).reduce((a, b) => a + b, 0);
        const perPerson = (net * totalShare) / tied.length;
        tied.forEach(u => results.push({ rank: prizeIndex + 1, userId: u.userId, name: u.name, stoppedNumber: u.stoppedNumber!, winAmount: Math.round(perPerson * 100) / 100, isTie: tied.length > 1, tieShare: tied.length }));
        prizeIndex += tied.length; i++;
      }
      for (; i < sorted.length; i++) results.push({ rank: results.length + 1, userId: sorted[i].userId, name: sorted[i].name, stoppedNumber: sorted[i].stoppedNumber!, winAmount: 0 });
      let updatedUser = prev.user;
      if (updatedUser) {
        const refund = noShowRefunds.find(r => r.userId === updatedUser!.id);
        if (refund) updatedUser = { ...updatedUser, walletBalance: updatedUser.walletBalance + refund.amount };
        const winning = results.find(r => r.userId === updatedUser!.id && r.winAmount > 0);
        if (winning) updatedUser = { ...updatedUser, walletBalance: updatedUser.walletBalance + winning.winAmount };
      }
      return { ...prev, user: updatedUser, tournaments: prev.tournaments.map(t => t.id === tournamentId ? { ...t, joiners: updatedJoiners, results } : t) };
    });
  }, []);

  return <AppContext.Provider value={{ state, completeSplash, login, setTab, joinTournament, recordStop, retryPlay, submitDeposit, submitWithdrawalUPI, submitWithdrawalBank, submitYTPromotion, saveBankDetails, getTournamentStatus, getUserJoinInfo, calculatePrizePool, processNoShows }}>{children}</AppContext.Provider>;
}
