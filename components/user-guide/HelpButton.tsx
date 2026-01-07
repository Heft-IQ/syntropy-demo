'use client';

import { HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HelpButtonProps {
  onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem('syntropy-guide-seen') === 'true';
    if (!hasSeenGuide) {
      setShowBadge(true);
    }
  }, []);

  const handleClick = () => {
    onClick();
    // Mark guide as seen when opened
    localStorage.setItem('syntropy-guide-seen', 'true');
    setShowBadge(false);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
      title="User Guide"
    >
      <HelpCircle size={18} />
      <span className="hidden sm:inline">Help</span>
      {showBadge && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
      )}
    </button>
  );
}

