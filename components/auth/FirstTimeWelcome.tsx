'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useFirstTimeUser } from '@/hooks/useFirstTimeUser';

export function FirstTimeWelcome() {
  const { isFirstTime, isLoaded } = useFirstTimeUser();
  const [dismissed, setDismissed] = useState(false);

  if (!isLoaded || !isFirstTime || dismissed) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-2xl border border-indigo-500/50 p-4 max-w-md animate-slide-down">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm mb-1">Welcome to Syntropy Demo!</h3>
          <p className="text-white/90 text-xs leading-relaxed">
            You're a new user! We'll show you around with a quick tour to help you get started.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

