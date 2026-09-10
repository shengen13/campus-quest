import React, { useEffect, useMemo, useState } from 'react';
import { ScreenType, Quest, UserProfile } from '../types';
import { campusQuestApi } from '../services/api';

interface Props { questId?: string; quests: Quest[]; user: UserProfile; onNavigate: (screen: ScreenType) => void; onQuestCompleted: (questId: string, xpEarned: number) => Promise<void>; }

export const QuestRunnerScreen: React.FC<Props> = ({ questId, quests, user, onNavigate, onQuestCompleted }) => {
  const currentQuest = useMemo(() => quests.find(q => q.id === questId), [quests, questId]);
  const [selected, setSelected] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [hint, setHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentQuest) return;
    const match = currentQuest.estTime.match(/\d+/);
    setSeconds(match ? Number(match[0]) * 60 : 0);
    setSelected(''); setMessage(null); setSuccess(false);
  }, [currentQuest?.id]);

  useEffect(() => {
    if (seconds <= 0 || success) return;
    const timer = window.setInterval(() => setSeconds(v => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, success]);

  if (!currentQuest) return <div className="p-8 text-[#FF746E]">Quest not found. Return to the quest ledger.</div>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) { setMessage('Select an answer before submitting.'); return; }
    setLoading(true); setMessage(null);
    try {
      const result = await campusQuestApi.submitSolution({ quest_id: currentQuest.id, answer: selected });
      if (!result.success) { setMessage(result.message); return; }
      await onQuestCompleted(currentQuest.id, result.xp_awarded);
      setSuccess(true);
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Unable to submit this quest.'); }
    finally { setLoading(false); }
  };

  const minutes = Math.floor(seconds / 60); const secs = seconds % 60;
  return <div className="w-full max-w-5xl mx-auto pb-12 space-y-5">
    <button onClick={() => onNavigate('quests')} className="text-[#ffd166] font-label-code-sm text-xs uppercase">← Back to Quests</button>
    <form onSubmit={submit} className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow-lg p-5 sm:p-8">
      <div className="flex flex-wrap justify-between gap-3 border-b-2 border-[#050505] pb-5 mb-6"><div><p className="font-label-code-sm text-[#ffd166] text-xs">{currentQuest.course} · {currentQuest.categoryLabel}</p><h1 className="font-headline-lg text-2xl sm:text-4xl text-[#fff2dc] uppercase font-bold">{currentQuest.title}</h1></div><div className="bg-[#ffd166] text-[#050505] border-2 border-[#050505] px-3 py-2 font-label-code-sm font-bold">+{currentQuest.xp} XP · {String(minutes).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div></div>
      <p className="font-body-md text-[#d1c5b1] leading-relaxed">{currentQuest.problemStatement || currentQuest.description}</p>
      {currentQuest.codeSnippet && <pre className="mt-5 p-4 bg-[#0f0d17] border-2 border-[#050505] overflow-x-auto text-xs text-[#fff2dc]">{currentQuest.codeSnippet}</pre>}
      {currentQuest.options?.length ? <div className="mt-6 space-y-3">{currentQuest.options.map(option => <label key={option.id} className={`block p-4 border-2 border-[#050505] cursor-pointer ${selected === option.id ? 'bg-[#ffd166] text-[#050505] brutal-shadow-button' : 'bg-[#15121D] text-[#fff2dc]'}`}><input type="radio" name="answer" value={option.id} checked={selected === option.id} onChange={e => setSelected(e.target.value)} className="mr-3" />{option.text}</label>)}</div> : <div className="mt-6 p-4 border-2 border-[#FF746E] text-[#FF746E]">This quest has not been configured with a challenge yet.</div>}
      {hint && currentQuest.hint && <div className="mt-4 p-3 border-2 border-[#68B9EC] text-[#68B9EC]">HINT: {currentQuest.hint}</div>}
      {message && <div className="mt-4 p-3 border-2 border-[#FF746E] text-[#FF746E] font-label-code-sm text-xs">{message}</div>}
      {success && <div className="mt-5 p-5 border-2 border-[#83D39A] bg-[#83D39A]/10 text-[#83D39A]"><div className="font-headline-lg text-2xl">QUEST COMPLETE!</div><div className="mt-1">+{currentQuest.xp} XP has been recorded in your Firebase profile.</div><button type="button" onClick={() => onNavigate('quests')} className="mt-4 bg-[#ffd166] text-[#050505] px-4 py-2 border-2 border-[#050505] font-bold">CONTINUE</button></div>}
      {!success && <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setHint(v => !v)} className="px-4 py-3 bg-[#68B9EC] text-[#050505] border-2 border-[#050505] font-bold">{hint ? 'HIDE HINT' : 'HINT'}</button><button disabled={loading || !currentQuest.options?.length} className="px-5 py-3 bg-[#ffd166] text-[#050505] border-2 border-[#050505] brutal-shadow-button font-bold disabled:opacity-50">{loading ? 'VERIFYING...' : 'SUBMIT ANSWER'}</button></div>}
    </form>
  </div>;
};
