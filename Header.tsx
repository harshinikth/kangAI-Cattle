import React from 'react';
import { Language } from '../types';
import { getT } from '../translations';
import { Mic, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoice: () => void;
  totalCattle: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenVoice,
  totalCattle,
}) => {
  const t = getT(language);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand info mobile / title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            🐄
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 leading-tight">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3 h-3" />
                AI Assistant
              </span>
            </div>
            <p className="text-xs text-stone-700 font-medium hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Herd summary pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t.dashboard.totalAnimals}: <strong>{totalCattle}</strong></span>
          </div>

          {/* Voice trigger button */}
          <button
            id="header-voice-btn"
            onClick={onOpenVoice}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Ask Voice Assistant"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="font-semibold">{t.quickActions.askAssistant}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-300">
            <button
              id="lang-btn-ta"
              onClick={() => onLanguageChange('ta')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              தமிழ்
            </button>
            <button
              id="lang-btn-en"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
