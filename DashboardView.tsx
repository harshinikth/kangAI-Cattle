import React from 'react';
import { CattleRecord, DecisionType, Language } from '../types';
import { getT } from '../translations';
import {
  PlusCircle,
  Sparkles,
  Mic,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  Award,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  cattleList: CattleRecord[];
  language: Language;
  onSelectAnimal: (cattle: CattleRecord) => void;
  onNewAnimal: () => void;
  onAnalyze: () => void;
  onOpenVoice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cattleList,
  language,
  onSelectAnimal,
  onNewAnimal,
  onAnalyze,
  onOpenVoice,
}) => {
  const t = getT(language);

  // Statistics calculation
  const totalAnimals = cattleList.length;
  const healthyCount = cattleList.filter(
    (c) => c.analysis?.decision === 'CONTINUE_DAIRY' || c.healthStatus === 'good' || c.healthStatus === 'excellent'
  ).length;
  const attentionCount = cattleList.filter(
    (c) => c.analysis?.decision === 'MONITOR_CLOSELY' || c.analysis?.decision === 'CONSIDER_SALE'
  ).length;
  const breedingCount = cattleList.filter(
    (c) => c.analysis?.decision === 'BREEDING_CANDIDATE' || c.purpose === 'breeding'
  ).length;

  const getDecisionBadge = (decision?: DecisionType) => {
    switch (decision) {
      case 'CONTINUE_DAIRY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {t.decisionBadges.CONTINUE_DAIRY}
          </span>
        );
      case 'BREEDING_CANDIDATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            {t.decisionBadges.BREEDING_CANDIDATE}
          </span>
        );
      case 'MONITOR_CLOSELY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            {t.decisionBadges.MONITOR_CLOSELY}
          </span>
        );
      case 'CONSIDER_SALE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            {t.decisionBadges.CONSIDER_SALE}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
            Pending Analysis
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-100 mb-3 border border-emerald-600/50">
            <Sparkles className="w-3.5 h-3.5" />
            {t.appTagline}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t.appTitle}
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mb-4 leading-relaxed font-normal">
            "{t.appSubtitle}"
          </p>
          <p className="text-xs sm:text-sm text-emerald-200/90 italic bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            👉 {t.taglineQuestion}
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 text-8xl opacity-15 select-none hidden sm:block">
          🐄
        </div>
      </div>

      {/* Quick Action Cards (As per requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <button
          id="quick-add-animal-btn"
          onClick={onNewAnimal}
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">{t.quickActions.addAnimal}</div>
              <div className="text-xs text-stone-500">{language === 'ta' ? 'புதிய பதிவு' : 'New entry form'}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          id="quick-analyze-btn"
          onClick={onAnalyze}
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">{t.quickActions.analyzeAnimal}</div>
              <div className="text-xs text-stone-500">{language === 'ta' ? 'AI மதிப்பீடு' : 'Hybrid AI evaluation'}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          id="quick-voice-btn"
          onClick={onOpenVoice}
          className="flex items-center justify-between p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">{t.quickActions.askAssistant}</div>
              <div className="text-xs text-stone-500">{language === 'ta' ? 'தமிழில் பேசலாம்' : 'Voice Q&A'}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Herd Overview (Clean summary cards) */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-700" />
          {t.dashboard.herdOverview}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs font-semibold text-stone-500 mb-1">{t.dashboard.totalAnimals}</div>
            <div className="text-2xl font-black text-stone-900">{totalAnimals}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Kangeyam Stock</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
            <div className="text-xs font-semibold text-emerald-700 mb-1">{t.dashboard.healthyStable}</div>
            <div className="text-2xl font-black text-emerald-800">{healthyCount}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">🟢 Active Dairy</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
            <div className="text-xs font-semibold text-amber-700 mb-1">{t.dashboard.needAttention}</div>
            <div className="text-2xl font-black text-amber-800">{attentionCount}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">🟡 Needs Action</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
            <div className="text-xs font-semibold text-purple-700 mb-1">{t.dashboard.breedingStock}</div>
            <div className="text-2xl font-black text-purple-800">{breedingCount}</div>
            <div className="text-[11px] text-purple-600 mt-0.5">🟣 High Lineage</div>
          </div>
        </div>
      </div>

      {/* Recent Decisions & 1-Click Test Archetypes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700" />
            {t.dashboard.recentDecisions}
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {language === 'ta' ? 'முடிவுகளைக் காண கிளிக் செய்யவும்' : 'Click to view full diagnosis'}
          </span>
        </div>

        <div className="space-y-2.5">
          {cattleList.map((cattle) => {
            const analysis = cattle.analysis;
            return (
              <div
                key={cattle.id}
                id={`cattle-card-${cattle.tagNumber}`}
                onClick={() => onSelectAnimal(cattle)}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-base text-stone-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    🐄
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-base">{cattle.tagNumber}</span>
                      {cattle.name && (
                        <span className="text-xs font-medium text-stone-500">({cattle.name})</span>
                      )}
                      <span className="text-xs text-stone-400">• {cattle.breed}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                      <span>{t.profile.age}: <strong>{cattle.ageYears.value} yrs</strong></span>
                      <span>•</span>
                      <span>
                        {t.profile.productivity}: <strong>{cattle.dailyMilkLiters.value} L/day</strong>
                        {cattle.productivityTrend === 'decreasing' && ' 📉'}
                        {cattle.productivityTrend === 'increasing' && ' 📈'}
                        {cattle.productivityTrend === 'stable' && ' ➡️'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div>{getDecisionBadge(analysis?.decision)}</div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Click Quick Demo Presets for Jury / Evaluation */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            {t.dashboard.quickStartTitle}
          </h4>
          <p className="text-xs text-stone-600 mt-0.5">
            {t.dashboard.quickStartDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {cattleList.map((c) => (
            <button
              key={`preset-${c.id}`}
              onClick={() => onSelectAnimal(c)}
              className="p-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm text-stone-900">{c.tagNumber}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                  {c.purpose}
                </span>
              </div>
              <div className="text-xs text-stone-600 line-clamp-1 mb-2 font-medium">
                {c.tagNumber === 'KC104' && (language === 'ta' ? 'பால் குறைவு (தேவை: கண்காணிப்பு)' : 'Milk decline (Need: Monitor)')}
                {c.tagNumber === 'KC108' && (language === 'ta' ? 'இனப்பெருக்க கிடாரி (Breeding)' : 'Champion Heifer (Breeding)')}
                {c.tagNumber === 'KC102' && (language === 'ta' ? 'அதிக பால் கறவை (தொடர்க)' : 'High yield dairy (Continue)')}
                {c.tagNumber === 'KC95' && (language === 'ta' ? 'நஷ்டம் & முதுமை (விற்பனை)' : 'Old age & loss (Consider Sale)')}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <span>{language === 'ta' ? 'ஆராய்க' : 'Analyze'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
