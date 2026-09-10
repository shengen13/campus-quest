import React from 'react';
import { UserProfile, ScreenType } from '../types';

interface ProgressScreenProps { user: UserProfile; onNavigate: (screen: ScreenType) => void; }

const categories = [
  { key: 'coding', label: 'CODING', color: '#ffd166' },
  { key: 'logic', label: 'LOGIC', color: '#83D39A' },
  { key: 'memory', label: 'MEMORY', color: '#FF746E' },
  { key: 'problem', label: 'PROBLEM SOLVING', color: '#68B9EC' },
  { key: 'quiz', label: 'QUIZ', color: '#c5c0ff' },
];

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user }) => {
  const completed = user.completedQuests?.length || 0;
  return <div className="w-full space-y-8 max-w-7xl mx-auto pb-12">
    <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6">
      <p className="font-label-code-sm text-xs text-[#ffd166]">REAL USER PROGRESS</p>
      <h1 className="font-headline-lg text-2xl sm:text-4xl text-[#fff2dc] uppercase font-bold">Progress Ledger</h1>
      <p className="font-body-md text-sm text-[#d1c5b1] mt-1">This page is calculated from your stored Campus Quest results.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[['XP', user.xp], ['LEVEL', user.level], ['SOLVED', user.solvedCount], ['ACCURACY', `${user.accuracy}%`]].map(([label, value]) => <div key={String(label)} className="p-4 bg-[#15121D] border-2 border-[#050505] shadow-[2px_2px_0px_#050505]"><span className="font-label-code-sm text-[10px] text-[#9a8f7d] block">{label}</span><strong className="font-headline-sm text-xl text-[#ffd166]">{value}</strong></div>)}
      </div>
    </section>
    <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-[#050505] pb-3"><h2 className="font-headline-sm text-lg text-[#fff2dc] uppercase">Quest Completion</h2><span className="font-label-code-sm text-xs text-[#ffd166]">{completed} COMPLETED</span></div>
      <div className="p-4 bg-[#15121D] border-2 border-[#050505]"><div className="flex justify-between font-label-code-sm text-xs text-[#d1c5b1]"><span>LEVEL {user.level}</span><span>{user.xp} / {user.nextLevelXp} XP</span></div><div className="mt-2 h-3 bg-[#2c2834] border border-[#050505]"><div className="h-full bg-[#ffd166]" style={{ width: `${Math.min(100, Math.round((user.xp / Math.max(1, user.nextLevelXp)) * 100))}%` }} /></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{categories.map(category => <div key={category.key} className="p-4 bg-[#15121D] border-2 border-[#050505]"><div className="flex justify-between mb-2"><span className="font-headline-sm text-sm text-[#fff2dc]">{category.label}</span><span className="font-label-code-sm text-xs" style={{ color: category.color }}>TRACKED LIVE</span></div><p className="text-xs text-[#9a8f7d]">Complete quests in this category to build your real progress.</p></div>)}</div>
    </section>
  </div>;
};
