import React from 'react';

interface FooterProps {
  onOpenHonorCode?: () => void;
  onOpenProtocol?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHonorCode,
  onOpenProtocol,
}) => {
  return (
    <footer
      id="campus-global-footer"
      className="w-full bg-[#0f0d17]/80 backdrop-blur-sm py-4 shadow-[0_-2px_0px_#050505] border-t-2 border-[#050505]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#9a8f7d]">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span className="font-label-code-sm text-[11px] text-[#d1c5b1] uppercase tracking-wider">
            © {new Date().getFullYear()} Campus Quest • All Rights Reserved
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenHonorCode}
            className="font-label-code-sm text-[11px] text-[#9a8f7d] hover:text-[#ffd166] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Honor Code
          </button>
          <button
            onClick={onOpenProtocol}
            className="font-label-code-sm text-[11px] text-[#9a8f7d] hover:text-[#ffd166] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Field Protocol
          </button>
        </div>
      </div>
    </footer>
  );
};
