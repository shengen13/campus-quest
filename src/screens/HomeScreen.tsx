import React, { useState, useEffect } from 'react';
import { ScreenType, UserProfile, Quest } from '../types';
import { ASSETS } from '../data/campusData';
import {
  getDynamicGreeting,
  getAcademicTermInfo,
  getDynamicFieldStatus,
} from '../utils/dynamicDateTime';

interface HomeScreenProps {
  user: UserProfile;
  quests: Quest[];
  onNavigate: (screen: ScreenType) => void;
  onSelectQuest: (questId: string) => void;
  onClaimBounty: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  quests,
  onNavigate,
  onSelectQuest,
  onClaimBounty,
}) => {
  // Real-time ticking state for live countdown and greetings
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const greetingInfo = getDynamicGreeting(user.name);
  const termInfo = getAcademicTermInfo();
  const fieldStatus = getDynamicFieldStatus(quests);

  const activeExpedition = quests.find((q) => !q.completed) || quests[0];

  // Dynamic sprint assignments from uncompleted quests
  const uncompletedQuests = quests.filter((q) => !q.completed);
  const sprintAssignments =
    uncompletedQuests.length >= 3
      ? uncompletedQuests.slice(0, 3)
      : quests.slice(0, 3);

  // Recommended quests
  const recommendedExpeditions = quests
    .filter((q) => q.id !== activeExpedition?.id)
    .slice(0, 2);

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto pb-12">
      {/* Fall Semester Header Banner */}
      <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 relative overflow-hidden">
        {/* Decorative Tape Accents */}
        <div className="absolute -top-3 left-10 w-24 h-5 bg-[#ffd166]/80 -rotate-2 border border-[#050505] shadow-[1px_1px_0px_#050505] pointer-events-none"></div>
        <div className="absolute -bottom-2 right-12 w-28 h-5 bg-[#83D39A]/80 rotate-1 border border-[#050505] shadow-[1px_1px_0px_#050505] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-label-code-sm text-[11px] text-[#ffd166] uppercase bg-[#15121D] px-2.5 py-1 border border-[#050505] shadow-[1px_1px_0px_#050505]">
                {termInfo.semesterLabel}
              </span>
              <span className="font-label-code-sm text-[11px] text-[#9a8f7d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>{greetingInfo.timeString} • {greetingInfo.dateString}</span>
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-4xl text-[#fff2dc] uppercase font-bold tracking-tight flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffd166] text-3xl sm:text-4xl">
                {greetingInfo.icon}
              </span>
              <span>{greetingInfo.fullGreeting}</span>
            </h1>
            <p className="font-body-md text-[13px] sm:text-[14px] text-[#d1c5b1] mt-1">
              Field Status:{' '}
              <span className="text-[#83D39A] font-semibold">
                {fieldStatus.statusText}
              </span>{' '}
              • {user.college || 'your college'} progress node is connected.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('quests')}
              className="px-4 py-2.5 bg-[#ffd166] text-[#050505] font-headline-sm font-bold text-[13px] sm:text-[14px] uppercase border-[2.5px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>ALL CAMPAIGNS ({quests.length})</span>
            </button>
            <button
              onClick={onClaimBounty}
              disabled={user.bountyClaimed}
              className={`px-4 py-2.5 font-headline-sm font-bold text-[13px] sm:text-[14px] uppercase border-[2.5px] border-[#050505] brutal-shadow-button transition-all flex items-center justify-center gap-2 cursor-pointer ${
                user.bountyClaimed
                  ? 'bg-[#2c2834] text-[#83D39A] cursor-default'
                  : 'bg-[#FF746E] text-[#050505] hover:bg-[#ff8e89] active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {user.bountyClaimed ? 'task_alt' : 'bolt'}
              </span>
              <span>{user.bountyClaimed ? 'BOUNTY CLAIMED' : 'DAILY BOUNTY (+200)'}</span>
            </button>
          </div>
        </div>

        {/* User Status Ledger Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t-2 border-[#050505]">
          {/* Rank Tier */}
          <div className="bg-[#15121D] p-3.5 border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm">
            <div className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase">
              Rank Tier
            </div>
            <div className="font-headline-sm text-[17px] sm:text-[18px] text-[#fff2dc] font-bold mt-0.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166]"></span>
              <span>
                LVL 0{user.level} {user.levelTitle}
              </span>
            </div>
            <div className="font-label-code-sm text-[10px] text-[#d1c5b1] mt-1">
              {user.guild ? user.guild.split('[')[0] : 'Academic Guild'}
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-[#15121D] p-3.5 border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm">
            <div className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase">
              Daily Streak
            </div>
            <div className="font-headline-sm text-[17px] sm:text-[18px] text-[#FF746E] font-bold mt-0.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px]">
                local_fire_department
              </span>
              <span>{user.streakDays}-DAY RUN</span>
            </div>
            <div className="font-label-code-sm text-[10px] text-[#d1c5b1] mt-1">
              Personal Record: {user.bestStreak} Days
            </div>
          </div>

          {/* Term XP Gauge */}
          <div className="bg-[#15121D] p-3.5 border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm sm:col-span-2">
            <div className="flex justify-between font-label-code-sm text-[10px] text-[#9a8f7d] uppercase mb-1">
              <span>Term Progress XP ({termInfo.termName})</span>
              <span className="text-[#ffd166] font-bold">
                {user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-[#2c2834] h-3 border border-[#050505] rounded-sm overflow-hidden">
              <div
                className="bg-[#ffd166] h-full border-r border-[#050505] transition-all duration-500"
                style={{ width: `${Math.min(100, (user.xp / user.nextLevelXp) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between font-label-code-sm text-[10px] text-[#d1c5b1] mt-1.5">
              <span>+{Math.max(0, user.nextLevelXp - user.xp)} XP TO NEXT RANK</span>
              <span className="text-[#83D39A]">TOP {Math.max(1, 100 - user.accuracy)}% IN {user.college?.toUpperCase() || 'COLLEGE'}</span>
            </div>
          </div>
        </div>

        {/* Quick Metric Stamps */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="px-3 py-1 bg-[#15121D] border border-[#050505] font-label-code-sm text-[11px] text-[#d1c5b1] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#83D39A]">task_alt</span>
            <span>{user.solvedCount} SOLVED</span>
          </div>
          <div className="px-3 py-1 bg-[#15121D] border border-[#050505] font-label-code-sm text-[11px] text-[#d1c5b1] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#68B9EC]">target</span>
            <span>{user.accuracy}% ACCURACY</span>
          </div>
          <div className="px-3 py-1 bg-[#15121D] border border-[#050505] font-label-code-sm text-[11px] text-[#ffd166]">
            <span className="material-symbols-outlined text-[15px] text-[#ffd166] inline mr-1 align-text-bottom">verified</span>
            <span>{user.inkSeals} INK SEALS</span>
          </div>
        </div>
      </section>

      {/* Primary Active Expedition Card */}
      {activeExpedition && (
        <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 md:p-8 relative">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#050505] mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#83D39A] animate-ping"></span>
              <span className="font-label-code-sm text-[11px] text-[#83D39A] uppercase tracking-wider font-bold">
                ACTIVE EXPEDITION // {activeExpedition.course}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF746E] text-[#050505] font-badge-stamp text-[10px] uppercase font-bold border border-[#050505]">
                EST. TIME {activeExpedition.estTime}
              </span>
              <span className="px-2 py-0.5 bg-[#ffd166] text-[#050505] font-badge-stamp text-[10px] uppercase font-bold border border-[#050505]">
                +{activeExpedition.xp} XP REWARD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="font-label-code-sm text-[11px] text-[#ffd166] uppercase mb-1">
                {activeExpedition.categoryLabel || 'CURRICULUM VAULT'} • DIFFICULTY: {activeExpedition.difficulty?.toUpperCase() || 'STANDARD'}
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#fff2dc] uppercase font-bold tracking-tight leading-snug">
                {activeExpedition.title}
              </h2>
              <p className="font-body-md text-[13px] sm:text-[14px] text-[#d1c5b1] mt-3 leading-relaxed">
                {activeExpedition.description}
              </p>

              <div className="mt-4 p-3 bg-[#15121D] border-[2px] border-[#050505] font-label-code-sm text-[12px] text-[#68B9EC] flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  <span>LOCATION: {activeExpedition.course}</span>
                </span>
                <span className="text-[#83D39A] font-bold">
                  {activeExpedition.completed ? 'STATUS: COMPLETED' : `EST. TIME: ${activeExpedition.estTime || '25 MIN'}`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
                <button
                  id="resume-vault-btn"
                  onClick={() => {
                    onSelectQuest(activeExpedition.id);
                    onNavigate('quest_runner');
                  }}
                  className="px-5 sm:px-6 py-3 bg-[#ffd166] text-[#050505] font-headline-sm font-bold text-[14px] sm:text-[15px] uppercase border-[3px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>{activeExpedition.completed ? 'REVIEW VAULT [CODE LOG]' : 'RESUME VAULT [RUN CODE]'}</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('quests')}
                  className="px-4 py-3 bg-[#15121D] text-[#fff2dc] font-label-code-lg text-[13px] uppercase border-[2.5px] border-[#050505] shadow-[2px_2px_0px_#050505] hover:bg-[#201c2b] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">list_alt</span>
                  <span>ALL QUESTS ({quests.length})</span>
                </button>
              </div>
            </div>

            {/* Telemetry Graphic Companion */}
            <div className="lg:col-span-4 bg-[#15121D] border-[2.5px] border-[#050505] brutal-shadow-sm p-4 rounded-sm relative">
              <div className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase flex justify-between mb-2">
                <span>TELEMETRY PLOT</span>
                <span>GRID {activeExpedition.course.replace(/\s+/g, '-')}</span>
              </div>
              <div className="relative aspect-video sm:aspect-square bg-[#0f0d17] border border-[#050505] overflow-hidden flex items-center justify-center">
                <img
                  src={ASSETS.telemetryMap}
                  alt="Telemetry Radar"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d17] via-transparent to-transparent"></div>
                {/* Radar Crosshairs */}
                <div className="absolute w-8 h-8 rounded-full border-2 border-[#ffd166] flex items-center justify-center animate-ping"></div>
                <div className="absolute px-2 py-0.5 bg-[#15121D]/90 border border-[#ffd166] text-[#ffd166] font-label-code-sm text-[9px] bottom-3 left-3">
                  LIVE CAMPUS NODE
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Daily Assignments & Sprint Ledger (3 Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#050505]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd166] text-[20px]">
              assignment
            </span>
            <h2 className="font-headline-sm text-[20px] text-[#fff2dc] uppercase font-bold tracking-tight">
              Daily Assignments & Sprint Ledger
            </h2>
          </div>
          <span className="font-label-code-sm text-[11px] text-[#9a8f7d] uppercase">
            {sprintAssignments.length} ACTIVE SPRINT TARGETS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sprintAssignments.map((quest) => (
            <div
              key={quest.id}
              className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-5 flex flex-col justify-between hover:border-[#ffd166] transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-[#15121D] text-[#ffd166] font-label-code-sm text-[10px] uppercase font-bold border border-[#050505]">
                    {quest.course} // {quest.categoryLabel}
                  </span>
                  <span className="font-label-code-sm text-[11px] text-[#83D39A] font-bold">
                    +{quest.xp} XP
                  </span>
                </div>
                <h3 className="font-headline-sm text-[18px] text-[#fff2dc] uppercase font-bold tracking-tight">
                  {quest.title}
                </h3>
                <p className="font-body-sm text-[13px] text-[#d1c5b1] mt-2 leading-relaxed line-clamp-3">
                  {quest.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#050505] flex items-center justify-between">
                <div className="flex items-center gap-1 font-label-code-sm text-[10px] text-[#9a8f7d]">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>{quest.estTime}</span>
                </div>
                <button
                  onClick={() => {
                    onSelectQuest(quest.id);
                    onNavigate('quest_runner');
                  }}
                  className="px-3 py-1.5 bg-[#ffd166] text-[#050505] font-headline-sm text-[12px] font-bold uppercase border-[2px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  START SPRINT →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-Column Bottom Split: Study Expeditions & Stamps Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Study Expeditions */}
        <section className="lg:col-span-7 bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#050505] mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd166] text-[20px]">
                auto_stories
              </span>
              <h3 className="font-headline-sm text-[18px] text-[#fff2dc] uppercase font-bold">
                Recommended Expeditions
              </h3>
            </div>
            <span className="font-label-code-sm text-[11px] text-[#d1c5b1]">
              CURATED FOR @{user.callsign}
            </span>
          </div>

          <div className="space-y-3">
            {recommendedExpeditions.map((quest) => (
              <div
                key={quest.id}
                className="p-3.5 sm:p-4 bg-[#15121D] border-[2px] border-[#050505] rounded-sm shadow-[2px_2px_0px_#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#ffd166] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 bg-[#2c2834] text-[#ffd166] font-label-code-sm text-[10px] uppercase font-bold border border-[#050505]">
                      {quest.course}
                    </span>
                    <span className="font-label-code-sm text-[11px] text-[#9a8f7d]">
                      {quest.categoryLabel}
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-[15px] sm:text-[16px] text-[#fff2dc] font-bold">
                    {quest.title}
                  </h4>
                  <p className="font-body-sm text-[12px] text-[#d1c5b1] mt-0.5 max-w-md">
                    {quest.description}
                  </p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 border-[#2c2834] pt-2 sm:pt-0">
                  <span className="font-label-code-sm text-[12px] text-[#83D39A] font-bold">
                    +{quest.xp} XP
                  </span>
                  <button
                    onClick={() => {
                      onSelectQuest(quest.id);
                      onNavigate('quest_runner');
                    }}
                    className="px-3 py-1 bg-[#ffd166] text-[#050505] font-headline-sm text-[11px] font-bold uppercase border-[1.5px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] cursor-pointer"
                  >
                    ENGAGE →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stamps & Field Log */}
        <section className="lg:col-span-5 bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#050505] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffd166] text-[20px]">
                  history_edu
                </span>
                <h3 className="font-headline-sm text-[18px] text-[#fff2dc] uppercase font-bold">
                  Stamps & Field Log
                </h3>
              </div>
              <button
                onClick={() => onNavigate('achievements')}
                className="font-label-code-sm text-[11px] text-[#ffd166] hover:underline uppercase cursor-pointer"
              >
                VIEW ALL ({user.inkSeals})
              </button>
            </div>

            {/* Collectible Rubber Ink Stamps */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm text-center relative rotate-[-1deg]">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full border border-dashed border-[#83D39A] text-[#83D39A] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                </div>
                <div className="font-label-code-sm text-[10px] text-[#fff2dc] uppercase font-bold">
                  CAMPUS ARCHIVIST
                </div>
                <div className="font-label-code-sm text-[9px] text-[#83D39A]">
                  SEALED // OCT 24
                </div>
              </div>

              <div className="p-3 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm text-center relative rotate-[2deg]">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full border border-dashed border-[#ffd166] text-[#ffd166] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">code</span>
                </div>
                <div className="font-label-code-sm text-[10px] text-[#fff2dc] uppercase font-bold">
                  RECURSION MASTER
                </div>
                <div className="font-label-code-sm text-[9px] text-[#ffd166]">
                  SEALED // OCT 27
                </div>
              </div>

              <div className="p-3 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm text-center relative rotate-[1deg]">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full border border-dashed border-[#FF746E] text-[#FF746E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                </div>
                <div className="font-label-code-sm text-[10px] text-[#fff2dc] uppercase font-bold">
                  MIDNIGHT CIPHER
                </div>
                <div className="font-label-code-sm text-[9px] text-[#FF746E]">
                  SEALED // NOV 02
                </div>
              </div>

              <div className="p-3 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] rounded-sm text-center relative rotate-[-2deg]">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full border border-dashed border-[#68B9EC] text-[#68B9EC] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">directions_run</span>
                </div>
                <div className="font-label-code-sm text-[10px] text-[#fff2dc] uppercase font-bold">
                  OCTOBER RUNNER
                </div>
                <div className="font-label-code-sm text-[9px] text-[#68B9EC]">
                  SEALED // NOV 04
                </div>
              </div>
            </div>

            {/* Field Activity Log Feed */}
            <div className="space-y-2 border-t border-[#050505] pt-3">
              {quests.filter((quest) => quest.completed).slice(0, 3).map((quest) => (
                <div key={quest.id} className="flex items-center justify-between font-label-code-sm text-[11px] text-[#d1c5b1]">
                  <span>Completed: {quest.title}</span>
                  <span className="text-[#83D39A] font-bold">+{quest.xp} XP</span>
                </div>
              ))}
              {quests.every((quest) => !quest.completed) && (
                <div className="font-label-code-sm text-[11px] text-[#9a8f7d]">No completed quests yet. Your activity will appear here after your first submission.</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#050505] text-center font-label-code-sm text-[10px] text-[#9a8f7d]">
            LIVE FIRESTORE PROFILE // VERIFIED SESSION
          </div>
        </section>
      </div>
    </div>
  );
};
