import React from 'react';
import { ScreenType } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenMenu,
}) => {
  const isQuestActive =
    currentScreen === 'quests' || currentScreen === 'quest_runner';

  const items = [
    {
      screen: 'home' as ScreenType,
      label: 'Home',
      icon: 'grid_view',
      active: currentScreen === 'home',
    },
    {
      screen: 'quests' as ScreenType,
      label: 'Quests',
      icon: 'explore',
      active: isQuestActive && currentScreen !== 'quest_runner',
    },
    {
      screen: 'quest_runner' as ScreenType,
      label: 'Runner',
      icon: 'terminal',
      active: currentScreen === 'quest_runner',
    },
    {
      screen: 'leaderboard' as ScreenType,
      label: 'Ranks',
      icon: 'military_tech',
      active: currentScreen === 'leaderboard',
    },
    {
      screen: 'profile' as ScreenType,
      label: 'Profile',
      icon: 'account_circle',
      active:
        currentScreen === 'profile' ||
        currentScreen === 'achievements' ||
        currentScreen === 'progress' ||
        currentScreen === 'settings',
      isMenu: false,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1d1a25]/95 backdrop-blur-md border-t-[2.5px] border-[#050505] brutal-shadow px-2 py-1.5 flex items-center justify-around"
      style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            onNavigate(item.screen);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-sm transition-all min-w-[58px] cursor-pointer ${
            item.active
              ? 'bg-[#ffd166] text-[#050505] border-[1.5px] border-[#050505] font-bold brutal-shadow-sm -translate-y-0.5'
              : 'text-[#d1c5b1] hover:text-[#fff2dc] hover:bg-[#2c2834]/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] leading-none mb-0.5">
            {item.icon}
          </span>
          <span className="font-label-code-sm text-[10px] uppercase tracking-wider leading-tight">
            {item.label}
          </span>
        </button>
      ))}

      {/* Quick Menu Drawer trigger button */}
      <button
        id="mobile-nav-all-menu"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-sm text-[#ffd166] hover:bg-[#2c2834]/50 min-w-[52px] cursor-pointer"
        aria-label="All Navigation Items"
      >
        <span className="material-symbols-outlined text-[20px] leading-none mb-0.5">
          menu
        </span>
        <span className="font-label-code-sm text-[10px] uppercase tracking-wider leading-tight">
          Menu
        </span>
      </button>
    </nav>
  );
};
