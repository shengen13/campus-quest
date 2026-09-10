import React from 'react';
import { UserProfile, ScreenType } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onNavigate,
  onLogout,
}) => {
  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto pb-12">
      {/* Dossier Card */}
      <section className="bg-[#241D30] border-[3.5px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-[#050505]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 w-full md:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-[#ffd166] overflow-hidden bg-[#15121D] shadow-[3px_3px_0px_#050505] flex-shrink-0 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-headline-lg text-2xl sm:text-3xl text-[#ffd166] font-bold">
                  {(user.name || 'Q').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-headline-lg text-2xl sm:text-3xl text-[#fff2dc] uppercase font-bold">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 bg-[#ffd166] text-[#050505] font-badge-stamp text-[11px] font-bold uppercase border border-[#050505]">
                  LVL 0{user.level} {user.levelTitle}
                </span>
              </div>
              <p className="font-label-code-lg text-[12px] sm:text-[13px] text-[#ffd166] mt-1 font-bold">
                @{user.callsign} • {user.email}
              </p>
              <p className="font-body-sm text-[12px] sm:text-[13px] text-[#d1c5b1] mt-0.5">
                {user.guild} • {user.college} College Division
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2.5 bg-[#15121D] text-[#fff2dc] font-headline-sm text-[12px] sm:text-[13px] uppercase border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505] hover:bg-[#201c2b] cursor-pointer text-center"
            >
              TERMINAL SETTINGS
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-[#FF746E] text-[#050505] font-headline-sm font-bold text-[12px] sm:text-[13px] uppercase border-[2px] border-[#050505] brutal-shadow-button hover:bg-[#ff8e89] cursor-pointer text-center"
            >
              DISENGAGE / LOGOUT
            </button>
          </div>
        </div>

        {/* Questor Credentials Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505]">
            <span className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase block">
              LIFETIME MERIT XP
            </span>
            <span className="font-headline-sm text-[22px] text-[#ffd166] font-bold">
              {user.xp.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505]">
            <span className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase block">
              SOLVED VAULTS
            </span>
            <span className="font-headline-sm text-[22px] text-[#83D39A] font-bold">
              {user.solvedCount}
            </span>
          </div>

          <div className="p-4 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505]">
            <span className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase block">
              SOLVING ACCURACY
            </span>
            <span className="font-headline-sm text-[22px] text-[#68B9EC] font-bold">
              {user.accuracy}%
            </span>
          </div>

          <div className="p-4 bg-[#15121D] border-[2px] border-[#050505] shadow-[2px_2px_0px_#050505]">
            <span className="font-label-code-sm text-[10px] text-[#9a8f7d] uppercase block">
              RUBBER SEALS
            </span>
            <span className="font-headline-sm text-[22px] text-[#c5c0ff] font-bold">
              {user.inkSeals}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
