'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';

interface TourStep {
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="architecture-components"]',
    title: 'Clickable Architecture Components',
    content: 'Every component in the architecture diagram is clickable! Click any component to see detailed information about its role, data flows, and examples. Try clicking "Cube Gateway" or "FalkorDB Graph" to explore.',
    position: 'bottom',
  },
  {
    target: '[data-tour="flow-simulation"]',
    title: 'Flow Simulation',
    content: 'Use these buttons to simulate data flows through the system. Click "Simulate Ingestion (ELT)" to see how data flows from ERP → dlt Worker → S3 → Tinybird. Notice the ELT approach - data is loaded first, then transformed!',
    position: 'bottom',
  },
  {
    target: '[data-tour="ai-chat-button"]',
    title: 'AI Architect Assistant',
    content: 'Click this floating button to open the AI Architect chat. Ask questions about architecture, data flows, or components. The AI can explain how the system works and even generate interactive diagrams!',
    position: 'left',
  },
  {
    target: '[data-tour="navigation-tabs"]',
    title: 'Navigation Between Views',
    content: 'Switch between Architecture, Onboarding, and Enterprise Dashboard views. Each view provides different insights into the system.',
    position: 'bottom',
  },
  {
    target: '[data-tour="help-button"]',
    title: 'User Guide',
    content: 'Click the Help button anytime to access the comprehensive user guide. It covers all features, keyboard shortcuts, and tips for using the platform effectively.',
    position: 'bottom',
  },
];

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) {
      onComplete();
      return;
    }

    // Find the target element
    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      setHighlightedElement(null);
    };
  }, [isOpen, currentStep, onComplete]);

  if (!isOpen) return null;

  const currentStepData = TOUR_STEPS[currentStep];
  if (!currentStepData) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 z-[100]">
        {/* Spotlight effect */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-indigo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] pointer-events-none"
            style={{
              top: highlightedElement.offsetTop - 8,
              left: highlightedElement.offsetLeft - 8,
              width: highlightedElement.offsetWidth + 16,
              height: highlightedElement.offsetHeight + 16,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[101] bg-slate-900 border-2 border-indigo-500 rounded-xl shadow-2xl p-6 max-w-md"
        style={{
          top: highlightedElement
            ? currentStepData.position === 'bottom'
              ? highlightedElement.offsetTop + highlightedElement.offsetHeight + 20
              : currentStepData.position === 'top'
              ? highlightedElement.offsetTop - 200
              : highlightedElement.offsetTop + highlightedElement.offsetHeight / 2
            : '50%',
          left: highlightedElement
            ? currentStepData.position === 'right'
              ? highlightedElement.offsetLeft + highlightedElement.offsetWidth + 20
              : currentStepData.position === 'left'
              ? highlightedElement.offsetLeft - 400
              : highlightedElement.offsetLeft + highlightedElement.offsetWidth / 2 - 200
            : '50%',
          transform: highlightedElement
            ? currentStepData.position === 'top' || currentStepData.position === 'bottom'
              ? 'translateX(-50%)'
              : 'translateY(-50%)'
            : 'translate(-50%, -50%)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-indigo-400">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{currentStepData.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{currentStepData.content}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <SkipForward size={14} /> Skip tour
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

