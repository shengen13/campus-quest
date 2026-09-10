import React, { useState } from 'react';
import { ScreenType } from '../types';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenHonorCode: () => void;
  onOpenProtocol: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onOpenHonorCode,
  onOpenProtocol,
}) => {
  const [tactileSounds, setTactileSounds] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto pb-12">
      <section className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow rounded-sm p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b-2 border-[#050505]">
          <div>
            <span className="font-label-code-sm text-[11px] text-[#ffd166] uppercase bg-[#15121D] px-2.5 py-1 border border-[#050505] shadow-[1px_1px_0px_#050505] inline-block mb-2">
              TERMINAL CONFIGURATION
            </span>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-[#fff2dc] uppercase font-bold tracking-tight">
              Settings & Preferences
            </h1>
            <p className="font-body-md text-[13px] sm:text-[14px] text-[#d1c5b1] mt-1">
              Configure your Campus Quest experience and accessibility preferences.
            </p>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="space-y-4">
          <div className="p-3.5 sm:p-4 bg-[#15121D] border-[2px] border-[#050505] flex items-center justify-between gap-3">
            <div>
              <div className="font-headline-sm text-[15px] sm:text-[16px] text-[#fff2dc] font-bold">
                Tactile Audio Haptics
              </div>
              <p className="font-body-sm text-[12px] text-[#d1c5b1]">
                Trigger mechanical click tones on terminal keypresses & vault unlocks.
              </p>
            </div>
            <input
              type="checkbox"
              checked={tactileSounds}
              onChange={(e) => setTactileSounds(e.target.checked)}
              className="w-5 h-5 accent-[#ffd166] cursor-pointer flex-shrink-0"
            />
          </div>

          <div className="p-3.5 sm:p-4 bg-[#15121D] border-[2px] border-[#050505] flex items-center justify-between gap-3">
            <div>
              <div className="font-headline-sm text-[15px] sm:text-[16px] text-[#fff2dc] font-bold">
                High Contrast Monochrome Overdrive
              </div>
              <p className="font-body-sm text-[12px] text-[#d1c5b1]">
                Enhance edge clarity for night expeditions and outdoor campus quads.
              </p>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-5 h-5 accent-[#ffd166] cursor-pointer flex-shrink-0"
            />
          </div>

          <div className="p-3.5 sm:p-4 bg-[#15121D] border-[2px] border-[#050505] flex items-center justify-between gap-3">
            <div>
              <div className="font-headline-sm text-[15px] sm:text-[16px] text-[#fff2dc] font-bold">
                Automatic Progress Refresh
              </div>
              <p className="font-body-sm text-[12px] text-[#d1c5b1]">
                Refresh your profile and quest progress from the Campus Quest server when you revisit a screen.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-5 h-5 accent-[#ffd166] cursor-pointer flex-shrink-0"
            />
          </div>

        </div>

        {/* Legal / Protocol Review */}
        <div className="pt-4 border-t-2 border-[#050505] flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenHonorCode}
            className="px-4 py-2.5 bg-[#15121D] text-[#ffd166] font-label-code-sm text-[11px] uppercase border border-[#050505] shadow-[2px_2px_0px_#050505] cursor-pointer text-center w-full sm:w-auto"
          >
            REVIEW HONOR CODE
          </button>
          <button
            onClick={onOpenProtocol}
            className="px-4 py-2.5 bg-[#15121D] text-[#ffd166] font-label-code-sm text-[11px] uppercase border border-[#050505] shadow-[2px_2px_0px_#050505] cursor-pointer text-center w-full sm:w-auto"
          >
            FIELD PROTOCOL SPECS
          </button>
        </div>
      </section>
    </div>
  );
};
