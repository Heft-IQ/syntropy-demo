'use client';

import { useState, useEffect } from 'react';
import { Network, Zap, LayoutGrid, Layers } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { ArchitectureVis } from '@/components/architecture/ArchitectureVis';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { EnterpriseDashboard } from '@/components/dashboard/EnterpriseDashboard';
import { AIChatButton } from '@/components/ai-architect/AIChatButton';
import { ChatContext } from '@/types/ai-architect';
import { HelpButton } from '@/components/user-guide/HelpButton';
import { UserGuideModal } from '@/components/user-guide/UserGuideModal';
import { OnboardingTour } from '@/components/education/OnboardingTour';
import { UserButton } from '@/components/auth/UserButton';
import { SignInButton } from '@/components/auth/SignInButton';

type View = 'arch' | 'onboarding' | 'dashboard';

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [view, setView] = useState<View>('dashboard');
  const [highlightedComponents, setHighlightedComponents] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Check if user has seen tour
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const hasSeenTour = localStorage.getItem('syntropy-tour-seen') === 'true';
      if (!hasSeenTour) {
        // Show tour after a short delay
        setTimeout(() => setShowTour(true), 1000);
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex flex-col h-screen bg-black text-slate-100 font-sans overflow-hidden">
      <div className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <Layers size={20} />
          </div>
          <span className="font-bold tracking-tight text-lg">
            Syntropy<span className="text-slate-500">Demo</span>
          </span>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800" data-tour="navigation-tabs">
          <button
            onClick={() => setView('arch')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'arch'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network size={14} /> Architecture
          </button>
          <button
            onClick={() => setView('onboarding')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'onboarding'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap size={14} /> Day 0: Onboarding
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={14} /> Day 2: Enterprise
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div data-tour="help-button">
            <HelpButton onClick={() => setShowGuide(true)} />
          </div>
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton />
              )}
            </>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>System Online
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {view === 'arch' && (
          <div className="absolute inset-0 overflow-auto bg-slate-900">
            <ArchitectureVis highlightedComponents={highlightedComponents} />
          </div>
        )}
        {view === 'onboarding' && (
          <div className="absolute inset-0 overflow-auto bg-slate-950">
            <OnboardingWizard onComplete={() => setView('dashboard')} />
          </div>
        )}
        {view === 'dashboard' && (
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            <EnterpriseDashboard />
          </div>
        )}
      </div>

      <div data-tour="ai-chat-button">
        <AIChatButton
          context={{
            currentView: view,
            userRole: user?.publicMetadata?.role as string || 'Engineer',
          }}
          onHighlight={setHighlightedComponents}
        />
      </div>
      <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <OnboardingTour
        isOpen={showTour}
        onClose={() => {
          setShowTour(false);
          localStorage.setItem('syntropy-tour-seen', 'true');
        }}
        onComplete={() => {
          setShowTour(false);
          localStorage.setItem('syntropy-tour-seen', 'true');
        }}
      />
    </div>
  );
}
