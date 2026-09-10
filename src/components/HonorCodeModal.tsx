import React from 'react';

interface HonorCodeModalProps {
  isOpen: boolean;
  type: 'honor_code' | 'protocol';
  onClose: () => void;
}

export const HonorCodeModal: React.FC<HonorCodeModalProps> = ({
  isOpen,
  type,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="honor-code-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#050505]/85 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#241D30] border-[3.5px] border-[#050505] brutal-shadow max-w-xl w-full p-4 sm:p-6 md:p-8 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tape Accent */}
        <div className="absolute -top-3 left-8 w-24 h-5 bg-[#ffd166]/80 -rotate-2 border border-[#050505] shadow-[1px_1px_0px_#050505] pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b-2 border-[#050505] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd166] text-[20px] sm:text-[22px]">
              {type === 'honor_code' ? 'verified_user' : 'menu_book'}
            </span>
            <h3 className="font-headline-sm text-[17px] sm:text-[20px] text-[#fff2dc] uppercase font-bold tracking-tight">
              {type === 'honor_code'
                ? 'Academic Honor Code'
                : 'Campus Field Protocol #0.84'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#37333f] text-[#d1c5b1] hover:text-[#fff2dc] border border-[#050505] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="font-body-md text-[13px] sm:text-[14px] text-[#d1c5b1] space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {type === 'honor_code' ? (
            <>
              <p>
                As a sworn Questor of the <strong className="text-[#fff2dc]">Campus Quest Registry</strong>, I pledge on my collegiate honor:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#fff2dc]">
                <li>To solve cryptographic puzzles, algorithmic vaults, and sprint challenges through honest academic rigor.</li>
                <li>To preserve physical archival sites, library catacombs, and dorm infrastructure without disruptive tampering.</li>
                <li>To maintain the secrecy of active vault coordinates and never leak decrypted seeds to unverified nodes.</li>
                <li>To share computational resources and aid fellow novices in their discipline journeys.</li>
              </ul>
              <div className="p-3 bg-[#15121d] border-[2px] border-[#050505] font-label-code-sm text-[11px] text-[#83D39A] break-all">
                CAMPUS QUEST HONOR CODE // VERSION 1.0
              </div>
            </>
          ) : (
            <>
              <p>
                Field Protocol governs all tactical campus expeditions across the 14 collegiate dorm clusters and academic quads:
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-[#15121d] border border-[#050505]">
                  <strong className="text-[#ffd166] font-label-code-sm text-[11px] block">
                    01 // NOCTURNAL HOURS
                  </strong>
                  Expedition timers expire automatically at 00:00 EST. Night sprints award 2.0x XP multipliers on designated math and code vaults.
                </div>
                <div className="p-2.5 bg-[#15121d] border border-[#050505]">
                  <strong className="text-[#68B9EC] font-label-code-sm text-[11px] block">
                    02 // SQUAD SYNCHRONIZATION
                  </strong>
                  Raid nodes require minimum 3 synced questors to bypass cryptographic lockouts.
                </div>
                <div className="p-2.5 bg-[#15121d] border border-[#050505]">
                  <strong className="text-[#FF746E] font-label-code-sm text-[11px] block">
                    03 // ANTI-CHEAT TELEMETRY
                  </strong>
                  All tokenized keystrokes and algorithmic solutions are verified against Shibboleth-authenticated nodes.
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 mt-4 border-t-2 border-[#050505] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#ffd166] text-[#050505] font-headline-sm font-bold text-[13px] uppercase border-[2.5px] border-[#050505] brutal-shadow-button hover:bg-[#ffda85] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-center"
          >
            ACKNOWLEDGED // CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
