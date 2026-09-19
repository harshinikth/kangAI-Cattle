import React from 'react';
import { Language } from '../types';
import { getT } from '../translations';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  FileCheck2,
  SlidersHorizontal,
  BookOpen,
  Mic,
  Languages,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'myCattle'
  | 'analyzeAnimal'
  | 'recommendations'
  | 'whatIf'
  | 'knowledgeAssistant'
  | 'voiceAssistant';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  hasSelectedAnimal: boolean;
  selectedTagNumber?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  hasSelectedAnimal,
  selectedTagNumber,
}) => {
  const t = getT(language);

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: t.nav.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'myCattle' as NavTab,
      label: t.nav.myCattle,
      icon: Layers,
    },
    {
      id: 'analyzeAnimal' as NavTab,
      label: t.nav.analyzeAnimal,
      icon: PlusCircle,
    },
    {
      id: 'recommendations' as NavTab,
      label: hasSelectedAnimal && selectedTagNumber ? `${t.nav.recommendations} (${selectedTagNumber})` : t.nav.recommendations,
      icon: FileCheck2,
      badge: hasSelectedAnimal ? 'Active' : undefined,
    },
    {
      id: 'whatIf' as NavTab,
      label: t.nav.whatIf,
      icon: SlidersHorizontal,
    },
    {
      id: 'knowledgeAssistant' as NavTab,
      label: t.nav.knowledgeAssistant,
      icon: BookOpen,
    },
    {
      id: 'voiceAssistant' as NavTab,
      label: t.nav.voiceAssistant,
      icon: Mic,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-stone-50 border-r border-stone-200 flex flex-col justify-between shrink-0">
      <div className="p-4">
        {/* Brand header */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
            🐄
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm leading-snug">
              Kangeyam AI
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold">
              காங்கேயம் கால்நடை AI
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Language and Quick Info */}
      <div className="p-4 border-t border-stone-200 bg-white/70 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-stone-500" />
            {t.nav.language}:
          </span>
          <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                language === 'ta' ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                language === 'en' ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed">
          <strong className="font-semibold block mb-0.5 text-emerald-900">
            {language === 'ta' ? 'அறிவுசார் நெறிமுறை:' : 'AI Core Philosophy:'}
          </strong>
          {language === 'ta'
            ? 'தவறான அனுமானங்களை தவிர்த்து, உண்மையான தரவுகளின் அடிப்படையில் விவசாயிக்கு வழிகாட்டுகிறது.'
            : 'Uncertainty-aware hybrid engine guiding farmers without false certainty.'}
        </div>
      </div>
    </aside>
  );
};
