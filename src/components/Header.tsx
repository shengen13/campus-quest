import React from 'react';
import { ScreenType, UserProfile } from '../types';
import { ASSETS } from '../data/campusData';

interface HeaderProps {
  currentScreen: ScreenType;
  user?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  notificationsCount?: number;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  user,
  onNavigate,
  searchQuery = '',
  onSearchChange,
  notificationsCount = 0,
  mobileMenuOpen = false,
  onToggleMobileMenu,
}) => {
  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register';

  if (isAuthScreen) {
    // Unauthenticated Header for Screens 1 & 2
    return (
      <header
        id="campus-auth-header"
        className="fixed top-0 left-0 w-full z-50 bg-[#15121d]/90 backdrop-blur-md shadow-[0_4px_0px_#050505]"
      >
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo & Title */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
          >
            <img
              alt="Campus Quest Emblem"
              className="h-7 sm:h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-[16px] sm:text-[18px] text-[#e7dff0] tracking-tight uppercase leading-none font-bold">
                Campus Quest
              </span>
              <span className="font-label-code-sm text-[9px] sm:text-[10px] text-[#9a8f7d] tracking-wider uppercase mt-0.5">
                Academic Field Ledger
              </span>
            </div>
          </div>

          {/* Node Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1d1a25] rounded-sm shadow-[2px_2px_0px_#050505] border border-[#050505]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#83D39A] animate-pulse"></span>
            <span className="font-label-code-sm text-[11px] text-[#83D39A] uppercase tracking-wider font-bold">
              Firebase: Auth & Cloud DB
            </span>
          </div>

          {/* Auth Nav and Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-6">
            <nav className="flex items-center gap-2 sm:gap-4 font-label-code-lg text-[11px] sm:text-[13px] uppercase tracking-wider">
              <button
                id="header-nav-login"
                onClick={() => onNavigate('login')}
                className={`px-1.5 py-1 transition-colors cursor-pointer ${
                  currentScreen === 'login'
                    ? 'text-[#ffd166] underline font-bold'
                    : 'text-[#d1c5b1] hover:text-[#fff2dc]'
                }`}
              >
                Login
              </button>
              <button
                id="header-nav-enroll"
                onClick={() => onNavigate('register')}
                className={`px-1.5 py-1 transition-colors cursor-pointer ${
                  currentScreen === 'register'
                    ? 'text-[#ffd166] underline font-bold'
                    : 'text-[#d1c5b1] hover:text-[#fff2dc]'
                }`}
              >
                Enroll
              </button>
              <button
                id="header-nav-desk"
                onClick={() => onNavigate('home')}
                className="hidden xs:inline px-1.5 py-1 text-[#d1c5b1] hover:text-[#fff2dc] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            </nav>

            <button
              onClick={() => onNavigate('profile')}
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-[#fff2dc] flex items-center justify-center shadow-[2px_2px_0px_#050505] border border-[#050505] cursor-pointer hover:bg-[#ffd166] transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[#3f2e00] text-[18px]">
                person
              </span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Authenticated In-App Header (offset by sidebar width on desktop)
  return (
    <header
      id="campus-app-header"
      className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#1d1a25]/95 backdrop-blur-sm border-b-[2.5px] border-[#050505] brutal-shadow z-40 px-3 sm:px-8 flex items-center justify-between"
    >
      {/* Left: Mobile Menu Hamburger & Search Input */}
      <div className="flex items-center flex-1 max-w-md mr-2 sm:mr-4">
        {onToggleMobileMenu && (
          <button
            id="mobile-drawer-toggle"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden mr-2 sm:mr-3 p-1.5 bg-[#211e29] border-[2px] border-[#050505] brutal-shadow-sm rounded-sm text-[#ffd166] cursor-pointer flex-shrink-0 active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px] block">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        )}

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#d1c5b1] text-[18px] sm:text-[20px]">
            search
          </span>
          <input
            id="global-header-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-[#15121d] border-[2px] sm:border-[2.5px] border-[#050505] py-1.5 pl-8 sm:pl-10 pr-2 sm:pr-4 text-[#fff2dc] placeholder:text-[#d1c5b1] font-label-code-sm text-[11px] sm:text-[12px] rounded-sm focus:outline-none focus:border-[#ffd166] brutal-shadow-sm transition-all"
            placeholder="Search campaigns..."
          />
        </div>
      </div>

      {/* Right Stats Pills & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Streak Counter Button */}
        <div
          id="streak-status-badge"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-[#FF746E] text-[#050505] border-[2px] sm:border-[2.5px] border-[#050505] brutal-shadow-sm rounded-sm font-label-code-lg text-[11px] sm:text-[13px] font-bold"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#050505]">
            local_fire_department
          </span>
          <span>{user?.streakDays ?? 0}D</span>
          <span className="hidden sm:inline"> STREAK</span>
        </div>

        {/* Level / XP Pill */}
        <div
          id="scholar-level-badge"
          className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#2c2834] border-[2.5px] border-[#050505] brutal-shadow-sm rounded-sm font-label-code-sm text-[11px] text-[#fff2dc]"
        >
          <span className="w-2 h-2 rounded-full bg-[#ffd166] inline-block animate-pulse"></span>
          <span>L0{user?.level ?? 1} {user?.levelTitle ?? "CADET"}</span>
          <span className="text-[#9a8f7d]">•</span>
          <span className="text-[#ffd166] font-bold">{(user?.xp ?? 0).toLocaleString()} XP</span>
        </div>

        {/* Notifications Bell */}
        <button
          id="notifications-bell-btn"
          aria-label="Notifications"
          onClick={() => alert(`Station Broadcast: 3 pending field dispatches logged on DormNet.`)}
          className="relative p-1.5 sm:p-2 bg-[#211e29] border-[2px] sm:border-[2.5px] border-[#050505] brutal-shadow-sm rounded-sm text-[#fff2dc] hover:bg-[#3b3744] flex items-center justify-center cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
            notifications
          </span>
          {notificationsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ffd166] text-[#765900] border-[1.5px] border-[#050505] rounded-full font-label-code-sm text-[9px] flex items-center justify-center font-bold">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* User Avatar with Green Indicator */}
        <div
          id="header-user-avatar"
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-0.5 sm:pl-1 cursor-pointer"
        >
          <div className="relative p-0.5 bg-[#2c2834] border-[2px] sm:border-[2.5px] border-[#050505] rounded-sm brutal-shadow-sm hover:border-[#ffd166] transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fff2dc] flex items-center justify-center overflow-hidden">
              <span className="font-headline-sm text-[#3f2e00] text-[12px] font-bold">
                {(user?.name || 'U').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#83D39A] border-[1.5px] border-[#050505] rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
