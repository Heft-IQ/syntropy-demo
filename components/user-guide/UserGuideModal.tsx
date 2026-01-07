'use client';

import { useState, useMemo } from 'react';
import { X, Search, BookOpen, Check } from 'lucide-react';
import { USER_GUIDE_SECTIONS, GuideSection, searchGuideContent } from '@/lib/user-guide-content';
import { UserGuideContent } from './UserGuideContent';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const [selectedSection, setSelectedSection] = useState<string>(USER_GUIDE_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return USER_GUIDE_SECTIONS;
    }
    return searchGuideContent(searchQuery);
  }, [searchQuery]);

  const currentSection = USER_GUIDE_SECTIONS.find(s => s.id === selectedSection) || USER_GUIDE_SECTIONS[0];

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('syntropy-guide-dont-show', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold text-white">User Guide</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Table of Contents */}
          <div className="w-64 border-r border-slate-800 bg-slate-950 overflow-y-auto shrink-0">
            {/* Search */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Sections List */}
            <div className="p-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                    selectedSection === section.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </button>
              ))}
              {filteredSections.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <UserGuideContent section={currentSection} />
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0">
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Don't show this guide again</span>
          </label>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

