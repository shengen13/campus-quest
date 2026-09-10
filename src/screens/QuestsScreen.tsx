import React, { useState } from 'react';
import { ScreenType, QuestCategory, Quest } from '../types';
import { getAcademicTermInfo } from '../utils/dynamicDateTime';

interface QuestsScreenProps {
  quests: Quest[];
  searchQuery: string;
  onNavigate: (screen: ScreenType) => void;
  onSelectQuest: (questId: string) => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({
  quests,
  searchQuery,
  onNavigate,
  onSelectQuest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const termInfo = getAcademicTermInfo();

  const categories: { id: QuestCategory; label: string; count: string }[] = [
    { id: 'all', label: 'ALL', count: quests.length.toString().padStart(2, '0') },
    {
      id: 'coding',
      label: 'CODING',
      count: quests.filter((q) => q.category === 'coding').length.toString().padStart(2, '0'),
    },
    {
      id: 'logic',
      label: 'LOGIC',
      count: quests.filter((q) => q.category === 'logic').length.toString().padStart(2, '0'),
    },
    {
      id: 'memory',
      label: 'MEMORY',
      count: quests.filter((q) => q.category === 'memory').length.toString().padStart(2, '0'),
    },
    {
      id: 'problem',
      label: 'PROBLEM SOLVING',
      count: quests.filter((q) => q.category === 'problem').length.toString().padStart(2, '0'),
    },
    {
      id: 'quiz',
      label: 'QUIZ',
      count: quests.filter((q) => q.category === 'quiz').length.toString().padStart(2, '0'),
    },
  ];

  const filteredQuests = quests.filter((quest) => {
    const matchesCategory =
      selectedCategory === 'all' || quest.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuests.length / itemsPerPage) || 1;
  const paginatedQuests = filteredQuests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner & Title */}
      <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-label-code-sm text-[11px] text-[#ffd166] uppercase bg-[#15121D] px-2.5 py-1 border border-[#050505] shadow-[1px_1px_0px_#050505]">
                ACTIVE CAMPAIGN DISPATCH // {termInfo.termName.toUpperCase()}
              </span>
              <span className="font-label-code-sm text-[11px] text-[#9a8f7d]">
                WEEK {termInfo.currentWeek.toString().padStart(2, '0')} OF {termInfo.totalWeeks}
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-4xl text-[#fff2dc] uppercase font-bold tracking-tight">
              Quests Ledger
            </h1>
            <p className="font-body-md text-[13px] sm:text-[14px] text-[#d1c5b1] mt-1 max-w-2xl">
              Choose an active field dossier. Complete problems within the time budget to unlock seals and claim scholar bounties.
            </p>
          </div>

          <div className="px-3.5 py-2 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm text-left sm:text-right w-full sm:w-auto">
            <span className="font-label-code-sm text-[10px] text-[#9a8f7d] block uppercase">
              EXPEDITION CAPACITY
            </span>
            <span className="font-headline-sm text-[16px] sm:text-[18px] text-[#83D39A] font-bold">
              {completedCount} / {quests.length} SOLVED ({quests.length - completedCount} ACTIVE)
            </span>
          </div>
        </div>

        {/* Category Filters Pill Tabs (horizontal scrollable on mobile) */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 pt-5 mt-5 border-t-2 border-[#050505] pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3 sm:px-3.5 py-1.5 font-headline-sm text-[12px] sm:text-[13px] uppercase tracking-wide border-[2px] border-[#050505] transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#ffd166] text-[#050505] font-bold brutal-shadow-button -translate-y-0.5'
                  : 'bg-[#15121D] text-[#d1c5b1] hover:text-[#fff2dc] hover:bg-[#201c2b] shadow-[2px_2px_0px_#050505]'
              }`}
            >
              <span>{cat.label}</span>{' '}
              <span className="font-label-code-sm text-[10px] opacity-75">
                [{cat.count}]
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Quest */}
      {filteredQuests[0] && (
        <section className="relative bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#FF746E] text-[#050505] font-badge-stamp text-[10px] uppercase font-bold border border-[#050505]">FEATURED QUEST</span>
              <span className="px-2 py-0.5 bg-[#ffd166] text-[#050505] font-label-code-sm text-[10px] uppercase font-bold border border-[#050505]">+{filteredQuests[0].xp} XP · {filteredQuests[0].estTime}</span>
            </div>
            <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-[#fff2dc] uppercase font-bold">{filteredQuests[0].title}</h2>
            <p className="font-body-md text-sm text-[#d1c5b1] mt-2 leading-relaxed">{filteredQuests[0].description}</p>
            <button onClick={() => onSelectQuest(filteredQuests[0].id)} className="mt-5 px-5 py-3 bg-[#ffd166] text-[#050505] font-headline-sm font-bold uppercase border-[3px] border-[#050505] brutal-shadow-button">{filteredQuests[0].completed ? 'REVIEW QUEST' : 'START QUEST'} →</button>
          </div>
        </section>
      )}

      {/* Field Dossiers 3-Column Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#050505]">
          <span className="font-label-code-sm text-[12px] text-[#d1c5b1] uppercase font-bold">
            SHOWING {paginatedQuests.length} OF {filteredQuests.length} FIELD DOSSIERS
          </span>
          <span className="font-label-code-sm text-[11px] text-[#9a8f7d]">
            SORT: COURSE CODE [ASC]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedQuests.map((quest) => (
            <div
              key={quest.id}
              className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-5 flex flex-col justify-between hover:border-[#ffd166] transition-colors group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-[#15121D] text-[#ffd166] font-label-code-sm text-[11px] uppercase font-bold border border-[#050505]">
                    {quest.course}
                  </span>
                  <span className="font-label-code-sm text-[12px] text-[#83D39A] font-bold">
                    +{quest.xp} XP
                  </span>
                </div>

                <h3 className="font-headline-sm text-[18px] text-[#fff2dc] uppercase font-bold tracking-tight group-hover:text-[#ffd166] transition-colors">
                  {quest.title}
                </h3>

                <p className="font-body-sm text-[13px] text-[#d1c5b1] mt-2 leading-relaxed line-clamp-3">
                  {quest.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#050505] space-y-3">
                <div className="flex items-center justify-between font-label-code-sm text-[11px] text-[#9a8f7d]">
                  <span className="uppercase text-[#d1c5b1]">{quest.categoryLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{quest.estTime}</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#ffd166] font-bold">{quest.rank}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectQuest(quest.id);
                    onNavigate('quest_runner');
                  }}
                  className="w-full py-2.5 bg-[#ffd166] text-[#050505] font-headline-sm text-[13px] font-bold uppercase border-[2.5px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>START QUEST</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination / Ledger Navigator */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-[#050505] flex-wrap gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#15121D] disabled:opacity-40 text-[#fff2dc] font-label-code-sm text-[12px] uppercase border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] hover:bg-[#201c2b] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
        >
          ← PREVIOUS DOSSIER
        </button>

        <span className="font-label-code-sm text-[12px] text-[#ffd166] font-bold">
          PAGE 0{currentPage} / 0{totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#15121D] disabled:opacity-40 text-[#fff2dc] font-label-code-sm text-[12px] uppercase border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] hover:bg-[#201c2b] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
        >
          NEXT DOSSIER →
        </button>
      </div>
    </div>
  );
};
