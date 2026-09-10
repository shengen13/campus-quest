import React, { useEffect, useMemo, useState } from 'react';
import { ScreenType, Scholar, UserProfile } from '../types';
import { campusQuestApi } from '../services/api';

interface Props { user: UserProfile; onNavigate: (screen: ScreenType) => void; onClaimBounty: () => void; }

export const LeaderboardScreen: React.FC<Props> = ({ user, onClaimBounty }) => {
  const [division, setDivision] = useState<'global' | 'college'>('global');
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await campusQuestApi.getLeaderboard();
      setScholars((data.standings || []).map((u: any) => ({
        rank: u.rank, name: u.name, initials: (u.name || 'U').split(/\s+/).map((p: string) => p[0]).join('').slice(0,2).toUpperCase(), callsign: u.callsign, discipline: u.guild || 'Student', house: u.college || 'College', classYear: '', tier: `LVL ${u.level || 1} ${u.levelTitle || 'CADET'}`, questsCount: u.solvedCount || 0, xp: u.xp || 0, trend: 'same', badgesCount: u.inkSeals || 0, isCurrentUser: u.isCurrentUser
      })));
    }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load leaderboard.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const processed = useMemo(() => {
    const filtered = division === 'college' ? scholars.filter(s => s.house === user.college) : scholars;
    return filtered.map((s, i) => ({ ...s, rank: i + 1, isCurrentUser: s.callsign === user.callsign }));
  }, [division, scholars, user.callsign, user.college]);

  return <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
    <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><p className="font-label-code-sm text-xs text-[#ffd166] tracking-widest">LIVE FROM CAMPUS QUEST</p><h1 className="font-headline-lg text-3xl sm:text-4xl text-[#fff2dc] uppercase font-bold">Leaderboard</h1><p className="font-body-md text-sm text-[#d1c5b1] mt-1">Every registered Campus Quest user competes using their real stored XP.</p></div>
        <button onClick={onClaimBounty} disabled={user.bountyClaimed} className="px-4 py-2 bg-[#FF746E] text-[#050505] border-2 border-[#050505] brutal-shadow-button font-bold disabled:bg-[#2c2834] disabled:text-[#83D39A]">{user.bountyClaimed ? 'BOUNTY CLAIMED' : 'CLAIM +200 XP'}</button>
      </div>
      <div className="flex gap-2 mt-6"><button onClick={() => setDivision('global')} className={`px-4 py-2 border-2 border-[#050505] font-label-code-sm ${division === 'global' ? 'bg-[#ffd166] text-[#050505]' : 'bg-[#15121D] text-[#d1c5b1]'}`}>GLOBAL</button><button onClick={() => setDivision('college')} className={`px-4 py-2 border-2 border-[#050505] font-label-code-sm ${division === 'college' ? 'bg-[#ffd166] text-[#050505]' : 'bg-[#15121D] text-[#d1c5b1]'}`}>MY COLLEGE</button><button onClick={load} className="ml-auto px-3 py-2 bg-[#15121D] text-[#ffd166] border-2 border-[#050505] font-label-code-sm">REFRESH</button></div>
    </section>
    {error && <div className="p-4 border-2 border-[#FF746E] text-[#FF746E] font-label-code-sm">{error}</div>}
    <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm overflow-hidden">
      {loading ? <div className="p-8 text-center font-label-code-sm text-[#ffd166]">LOADING REAL STANDINGS...</div> : processed.length === 0 ? <div className="p-8 text-center text-[#d1c5b1]">No registered students match this division yet.</div> : <div className="divide-y-2 divide-[#050505]">{processed.map(s => <div key={s.callsign || s.name} className={`grid grid-cols-[55px_1fr_auto] gap-3 items-center p-4 ${s.isCurrentUser ? 'bg-[#ffd166] text-[#050505]' : 'bg-[#15121D] text-[#fff2dc]'}`}><div className="font-headline-sm text-xl font-bold">#{s.rank}</div><div><div className="font-headline-sm font-bold">{s.name} {s.isCurrentUser && <span className="text-xs">(YOU)</span>}</div><div className={`font-label-code-sm text-[10px] ${s.isCurrentUser ? 'text-[#050505]' : 'text-[#9a8f7d]'}`}>@{s.callsign} · {s.house} · LVL {s.tier.split(' ')[1] || '1'}</div></div><div className="text-right"><div className="font-headline-sm font-bold">{s.xp.toLocaleString()} XP</div><div className={`font-label-code-sm text-[10px] ${s.isCurrentUser ? 'text-[#050505]' : 'text-[#83D39A]'}`}>{s.questsCount} QUESTS</div></div></div>)}</div>}
    </section>
  </div>;
};
