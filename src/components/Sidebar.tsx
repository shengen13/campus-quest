import React from 'react';
import { ScreenType } from '../types';
import { ASSETS } from '../data/campusData';
import { getAcademicTermInfo } from '../utils/dynamicDateTime';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  termProgress?: number;
  onCloseMobileMenu?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  termProgress,
  onCloseMobileMenu,
  onLogout,
  isLoggedIn = true,
}) => {
  const termInfo = getAcademicTermInfo();
  const effectiveTermProgress = termProgress ?? termInfo.termProgressPercent;

  const navItems: { screen: ScreenType; label: string; icon: string }[] = [
    { screen: 'home', label: 'HOME', icon: 'grid_view' },
    { screen: 'quests', label: 'QUESTS', icon: 'explore' },
    { screen: 'leaderboard', label: 'LEADERBOARD', icon: 'military_tech' },
    { screen: 'achievements', label: 'ACHIEVEMENTS', icon: 'award_star' },
    { screen: 'progress', label: 'PROGRESS', icon: 'trending_up' },
    { screen: 'profile', label: 'PROFILE', icon: 'account_box' },
    { screen: 'settings', label: 'SETTINGS', icon: 'settings' },
  ];

  const handleItemClick = (screen: ScreenType) => {
    onNavigate(screen);
    onCloseMobileMenu?.();
  };

  return (
    <aside
      id="campus-sidebar"
      className="fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-[#1d1a25] border-r-[2.5px] border-[#050505] brutal-shadow z-50 flex flex-col justify-between overflow-y-auto"
    >
      <div className="p-4 sm:p-6">
        {/* Mobile Close Button & Header */}
        <div className="flex items-center justify-between lg:hidden pb-3 mb-4 border-b-2 border-[#050505]">
          <span className="font-label-code-sm text-[11px] text-[#ffd166] uppercase font-bold">
            NAVIGATION DIRECTORY
          </span>
          {onCloseMobileMenu && (
            <button
              id="sidebar-close-btn"
              onClick={onCloseMobileMenu}
              aria-label="Close Navigation"
              className="p-1 px-2.5 bg-[#FF746E] text-[#050505] border-[2px] border-[#050505] font-headline-sm text-[12px] font-bold brutal-shadow-sm flex items-center gap-1 cursor-pointer active:translate-x-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>CLOSE</span>
            </button>
          )}
        </div>

        {/* Branding Logo Box */}
        <div
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 pb-6 mb-6 border-b-[2.5px] border-[#050505] relative cursor-pointer"
        >
          {/* Angled decorative tape */}
          <div className="absolute -top-1 -right-2 w-12 h-3.5 bg-[#c5c0ff]/40 border border-[#050505] -rotate-6 pointer-events-none"></div>

          <img
            alt="Campus Quest Logo"
            className="h-9 w-auto object-contain border-[1.5px] border-[#050505] p-1 bg-[#2c2834] rounded-sm"
            src={ASSETS.logo}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-[20px] text-[#fff2dc] tracking-tight font-bold leading-none">
              CAMPUS QUEST
            </span>
            <span className="font-badge-stamp text-[12px] text-[#765900] bg-[#ffd166] px-1.5 py-0.5 mt-1 border-[1.5px] border-[#050505] brutal-shadow-sm inline-block self-start font-bold">
              ACADEMIC LEDGER
            </span>
          </div>
        </div>

        {/* Navigation Item Stack */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.screen ||
              (item.screen === 'quests' && currentScreen === 'quest_runner');

            return (
              <button
                key={item.screen}
                id={`nav-item-${item.screen}`}
                onClick={() => handleItemClick(item.screen)}
                className={`flex items-center px-4 py-2.5 rounded-sm transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#ffd166] text-[#251a00] font-headline-sm font-bold border-[2.5px] border-[#050505] brutal-shadow-button translate-x-1'
                    : 'border-[2.5px] border-[#050505] bg-[#292138] text-[#fff2dc] hover:border-[#ffd166] hover:text-[#ffd166] brutal-shadow-sm active:translate-x-0.5 active:translate-y-0.5'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-[20px]">
                  {item.icon}
                </span>
                <span className="font-headline-sm text-[15px] font-semibold tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 flex flex-col gap-3">
        {/* Firebase Status & Logout */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#15121D] border-[1.5px] border-[#050505] rounded-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#83D39A] inline-block animate-pulse"></span>
            <span className="font-label-code-sm text-[10px] text-[#83D39A] uppercase tracking-wider font-bold">
              FIREBASE SYNC
            </span>
          </div>
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              className="text-[#FF746E] hover:underline font-label-code-sm text-[10px] uppercase tracking-wider font-bold cursor-pointer"
            >
              SIGN OUT
            </button>
          )}
          {!isLoggedIn && (
            <button
              onClick={() => handleItemClick('login')}
              className="text-[#ffd166] hover:underline font-label-code-sm text-[10px] uppercase tracking-wider font-bold cursor-pointer"
            >
              SIGN IN
            </button>
          )}
        </div>

        {/* Bottom Progress Card */}
        <div className="p-3 bg-[#211e29] border-[2.5px] border-[#050505] brutal-shadow-sm rounded-sm relative">
          <div className="font-label-code-sm text-[11px] text-[#d1c5b1] uppercase mb-1">
            {termInfo.season} Progress • Week {termInfo.currentWeek}
          </div>
          <div className="w-full bg-[#15121d] border-[2px] border-[#050505] h-3.5 rounded-sm overflow-hidden relative">
            <div
              className="bg-[#ffd166] h-full border-r-[2px] border-[#050505] transition-all duration-500"
              style={{ width: `${effectiveTermProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between font-label-code-sm text-[11px] text-[#d1c5b1] mt-1.5">
            <span>{effectiveTermProgress}% COMPLETE</span>
            <span>{termInfo.daysRemaining} DAYS LEFT</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
