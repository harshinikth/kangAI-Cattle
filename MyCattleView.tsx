import React, { useState } from 'react';
import { CattleRecord, DecisionType, Language } from '../types';
import { getT } from '../translations';
import {
  Search,
  PlusCircle,
  Filter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
} from 'lucide-react';

interface MyCattleViewProps {
  cattleList: CattleRecord[];
  language: Language;
  onSelectAnimal: (cattle: CattleRecord) => void;
  onNewAnimal: () => void;
}

export const MyCattleView: React.FC<MyCattleViewProps> = ({
  cattleList,
  language,
  onSelectAnimal,
  onNewAnimal,
}) => {
  const t = getT(language);
  const [search, setSearch] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('ALL');

  const filteredCattle = cattleList.filter((c) => {
    const matchesSearch =
      c.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
      c.breed.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterDecision === 'ALL' || c.analysis?.decision === filterDecision;

    return matchesSearch && matchesFilter;
  });

  const getDecisionBadge = (decision?: DecisionType) => {
    switch (decision) {
      case 'CONTINUE_DAIRY':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t.decisionBadges.CONTINUE_DAIRY}
          </span>
        );
      case 'BREEDING_CANDIDATE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            {t.decisionBadges.BREEDING_CANDIDATE}
          </span>
        );
      case 'MONITOR_CLOSELY':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {t.decisionBadges.MONITOR_CLOSELY}
          </span>
        );
      case 'CONSIDER_SALE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            {t.decisionBadges.CONSIDER_SALE}
          </span>
        );
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
    if (trend === 'decreasing') return <TrendingDown className="w-3.5 h-3.5 text-rose-600" />;
    return <Minus className="w-3.5 h-3.5 text-stone-500" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.nav.myCattle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'ta'
              ? 'உங்கள் பண்ணை மாடுகளின் விவரங்கள் மற்றும் AI பகுப்பாய்வு'
              : 'Registered Kangeyam cattle profiles and intelligent recommendations'}
          </p>
        </div>

        <button
          onClick={onNewAnimal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.quickActions.addAnimal}</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ta' ? 'மாடு எண் அல்லது பெயர் மூலம் தேடுக...' : 'Search by Tag ID (e.g. KC104)...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1 hidden sm:block" />
          {[
            { key: 'ALL', labelEn: 'All Cattle', labelTa: 'அனைத்தும்' },
            { key: 'CONTINUE_DAIRY', labelEn: 'Dairy', labelTa: 'பால்' },
            { key: 'BREEDING_CANDIDATE', labelEn: 'Breeding', labelTa: 'இனப்பெருக்கம்' },
            { key: 'MONITOR_CLOSELY', labelEn: 'Monitor', labelTa: 'கண்காணிப்பு' },
            { key: 'CONSIDER_SALE', labelEn: 'Sale', labelTa: 'விற்பனை' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterDecision(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterDecision === f.key
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {language === 'ta' ? f.labelTa : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Cattle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCattle.map((cattle) => {
          const analysis = cattle.analysis;
          const conf = analysis?.confidence;

          return (
            <div
              key={cattle.id}
              onClick={() => onSelectAnimal(cattle)}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-800 group-hover:scale-105 transition-transform">
                      🐄
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-stone-900">{cattle.tagNumber}</span>
                        {cattle.name && (
                          <span className="text-xs font-bold text-stone-600">({cattle.name})</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 font-medium">
                        {cattle.breed} • {cattle.ageYears.value} yrs • {cattle.gender}
                      </div>
                    </div>
                  </div>

                  {/* Confidence pill */}
                  {conf && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      conf === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : conf === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {conf === 'HIGH' ? 'High Conf' : conf === 'MEDIUM' ? 'Med Conf' : 'Low Conf'}
                    </span>
                  )}
                </div>

                {/* Key Metrics row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-4">
                  <div>
                    <div className="text-[10px] text-stone-600 font-semibold">{t.profile.productivity}</div>
                    <div className="font-bold text-stone-900 flex items-center gap-1 mt-0.5">
                      <span>{cattle.dailyMilkLiters.value} L/day</span>
                      {getTrendIcon(cattle.productivityTrend)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-600 font-semibold">{t.profile.health}</div>
                    <div className="font-bold text-stone-900 capitalize mt-0.5">
                      {cattle.healthStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-600 font-semibold">{t.profile.netMargin}</div>
                    <div className={`font-bold mt-0.5 ${
                      (analysis?.financials.dailyNetProfitRs || 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      ₹{analysis?.financials.dailyNetProfitRs || 0}/day
                    </div>
                  </div>
                </div>

                {/* Decision Badge & Why snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      {t.profile.recommendedDecision}
                    </span>
                  </div>
                  <div>{getDecisionBadge(analysis?.decision)}</div>

                  {analysis?.reasons && analysis.reasons.length > 0 && (
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 font-medium bg-stone-50 p-2 rounded-lg border border-stone-100">
                      • {language === 'ta' ? analysis.reasons[0].ta : analysis.reasons[0].en}
                    </p>
                  )}
                </div>
              </div>

              {/* Action trigger */}
              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-700">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'ta' ? 'முழு விபரம் மற்றும் பரிந்துரைகள்' : 'View Recommendations & Advice'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
