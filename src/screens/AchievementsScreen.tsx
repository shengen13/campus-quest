import React, { useEffect, useState } from 'react';
import { UserProfile, ScreenType } from '../types';
import { campusQuestApi } from '../services/api';

export interface AchievementSeal {
  id: string; title: string; description: string; category: string; icon: string; rarity: string; requirementType?: string; requirementValue?: number;
}

interface Props { user: UserProfile; onNavigate: (screen: ScreenType) => void; }
export const AchievementsScreen: React.FC<Props> = ({ user }) => {
  const [seals, setSeals] = useState<AchievementSeal[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { campusQuestApi.getSeals().then(setSeals).catch(e => setError(e instanceof Error ? e.message : 'Unable to load achievements.')); }, []);
  const unlocked = (seal: AchievementSeal) => {
    const value = Number(seal.requirementValue ?? 0); const actual = seal.requirementType === 'xp' ? user.xp : seal.requirementType === 'solvedCount' ? user.solvedCount : 0;
    return actual >= value;
  };
  return <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
    <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow p-5 sm:p-7"><p className="font-label-code-sm text-xs text-[#ffd166]">ACHIEVEMENT LEDGER</p><h1 className="font-headline-lg text-3xl sm:text-4xl text-[#fff2dc] uppercase font-bold">Achievements</h1><p className="text-sm text-[#d1c5b1] mt-1">Badges are calculated from your real stored progress.</p></section>
    {error && <div className="p-4 border-2 border-[#FF746E] text-[#FF746E]">{error}</div>}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{seals.map(seal => { const isUnlocked = unlocked(seal); const actual = seal.requirementType === 'xp' ? user.xp : user.solvedCount; return <article key={seal.id} className={`p-5 border-[3px] border-[#050505] brutal-shadow ${isUnlocked ? 'bg-[#241D30]' : 'bg-[#15121D] opacity-65'}`}><div className="flex justify-between items-center"><div className="w-12 h-12 flex items-center justify-center bg-[#ffd166] text-[#050505] border-2 border-[#050505]"><span className="material-symbols-outlined">{seal.icon}</span></div><span className={`font-label-code-sm text-[10px] px-2 py-1 border border-[#050505] ${isUnlocked ? 'bg-[#83D39A] text-[#050505]' : 'bg-[#2c2834] text-[#d1c5b1]'}`}>{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span></div><h2 className="font-headline-sm text-lg text-[#fff2dc] uppercase mt-4">{seal.title}</h2><p className="text-sm text-[#d1c5b1] mt-2">{seal.description}</p><div className="mt-5 pt-3 border-t-2 border-[#050505] font-label-code-sm text-[10px] text-[#ffd166]">REQUIREMENT: {actual}/{seal.requirementValue ?? 0} {seal.requirementType?.toUpperCase()}</div></article>})}</section>
  </div>;
};
