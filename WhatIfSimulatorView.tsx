import React, { useState, useMemo } from 'react';
import { CattleRecord, DecisionType, Language } from '../types';
import { getT } from '../translations';
import { simulateWhatIf } from '../services/decisionEngine';
import {
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Zap,
  DollarSign,
  Scale,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface WhatIfSimulatorViewProps {
  cattleList: CattleRecord[];
  selectedCattleId?: string;
  language: Language;
  onSelectAnimalForProfile: (cattle: CattleRecord) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  cattleList,
  selectedCattleId,
  language,
  onSelectAnimalForProfile,
}) => {
  const t = getT(language);

  const [activeAnimalId, setActiveAnimalId] = useState<string>(
    selectedCattleId || (cattleList.length > 0 ? cattleList[0].id : '')
  );

  // Simulation Sliders State
  const [milkPercent, setMilkPercent] = useState<number>(0);
  const [feedCostPercent, setFeedCostPercent] = useState<number>(0);
  const [medicalChangeRs, setMedicalChangeRs] = useState<number>(0);

  const activeCattle = useMemo(() => {
    return cattleList.find((c) => c.id === activeAnimalId) || cattleList[0];
  }, [cattleList, activeAnimalId]);

  const simulation = useMemo(() => {
    if (!activeCattle) return null;
    return simulateWhatIf(activeCattle, {
      milkPercentChange: milkPercent,
      feedCostPercentChange: feedCostPercent,
      medicalExpenseChangeRs: medicalChangeRs,
    });
  }, [activeCattle, milkPercent, feedCostPercent, medicalChangeRs]);

  const handleReset = () => {
    setMilkPercent(0);
    setFeedCostPercent(0);
    setMedicalChangeRs(0);
  };

  const applyPreset = (milk: number, feed: number, med: number) => {
    setMilkPercent(milk);
    setFeedCostPercent(feed);
    setMedicalChangeRs(med);
  };

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case 'CONTINUE_DAIRY':
        return (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-center gap-3">
            <span className="text-2xl">🟢</span>
            <div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                {language === 'ta' ? 'முடிவு' : 'Decision'}
              </div>
              <div className="text-base font-black">
                {t.decisionTypes.CONTINUE_DAIRY}
              </div>
            </div>
          </div>
        );
      case 'BREEDING_CANDIDATE':
        return (
          <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-400 text-purple-950 flex items-center gap-3">
            <span className="text-2xl">🟣</span>
            <div>
              <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                {language === 'ta' ? 'முடிவு' : 'Decision'}
              </div>
              <div className="text-base font-black">
                {t.decisionTypes.BREEDING_CANDIDATE}
              </div>
            </div>
          </div>
        );
      case 'MONITOR_CLOSELY':
        return (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-center gap-3">
            <span className="text-2xl">🟡</span>
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {language === 'ta' ? 'முடிவு' : 'Decision'}
              </div>
              <div className="text-base font-black">
                {t.decisionTypes.MONITOR_CLOSELY}
              </div>
            </div>
          </div>
        );
      case 'CONSIDER_SALE':
        return (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-950 flex items-center gap-3">
            <span className="text-2xl">🔴</span>
            <div>
              <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                {language === 'ta' ? 'முடிவு' : 'Decision'}
              </div>
              <div className="text-base font-black">
                {t.decisionTypes.CONSIDER_SALE}
              </div>
            </div>
          </div>
        );
    }
  };

  if (!activeCattle || !simulation) {
    return null;
  }

  const isSimulatedModified = milkPercent !== 0 || feedCostPercent !== 0 || medicalChangeRs !== 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t.whatIf.title}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.whatIf.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {t.whatIf.subtitle}
          </p>
        </div>

        {/* Animal Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-stone-700 whitespace-nowrap">
            {t.whatIf.selectAnimal}:
          </label>
          <select
            value={activeAnimalId}
            onChange={(e) => {
              setActiveAnimalId(e.target.value);
              handleReset();
            }}
            className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            {cattleList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tagNumber} ({c.name || c.breed}) - {c.dailyMilkLiters.value}L
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Instant Scenario Quick Presets */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            {language === 'ta' ? 'விரைவு மதிப்பீட்டு மாதிரிகள் (Quick Presets):' : 'Instant Scenario Presets:'}
          </span>
          {isSimulatedModified && (
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.whatIf.resetSliders}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset(25, -10, 0)}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-emerald-900/60 border border-stone-700 hover:border-emerald-500 text-left transition-all cursor-pointer"
          >
            <div className="text-xs font-bold text-emerald-300">🌿 {language === 'ta' ? 'தீவன வளர்ச்சி' : 'Feed Boost'}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">+25% Milk, -10% Feed</div>
          </button>

          <button
            onClick={() => applyPreset(0, 35, 0)}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-amber-900/60 border border-stone-700 hover:border-amber-500 text-left transition-all cursor-pointer"
          >
            <div className="text-xs font-bold text-amber-300">🌾 {language === 'ta' ? 'தீவன விலை ஏற்றம்' : 'Feed Inflation'}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">+35% Feed Cost</div>
          </button>

          <button
            onClick={() => applyPreset(-30, 0, 400)}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 border border-stone-700 hover:border-rose-500 text-left transition-all cursor-pointer"
          >
            <div className="text-xs font-bold text-rose-300">⚠️ {language === 'ta' ? 'பால் குறைவு' : 'Yield Drop'}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">-30% Milk, +₹400 Med</div>
          </button>

          <button
            onClick={() => applyPreset(-20, 20, 1000)}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-rose-950 border border-stone-700 hover:border-rose-400 text-left transition-all cursor-pointer"
          >
            <div className="text-xs font-bold text-rose-400">🏥 {language === 'ta' ? 'அவசர சிகிச்சை' : 'Stress & Illness'}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">-20% Milk, +₹1k Vet</div>
          </button>
        </div>
      </div>

      {/* Decision Shift Comparison Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current State */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-600">
              {t.whatIf.currentStatus}
            </h3>
            <span className="text-xs font-bold text-stone-700">
              {activeCattle.tagNumber} ({activeCattle.breed})
            </span>
          </div>

          {getDecisionBadge(simulation.baseResult.decision)}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-stone-600 font-semibold">{t.whatIf.originalYield}</div>
              <div className="font-extrabold text-stone-900 text-sm">
                {activeCattle.dailyMilkLiters.value} L/day
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-stone-600 font-semibold">{t.whatIf.originalNet}</div>
              <div className={`font-extrabold text-sm ${
                simulation.baseResult.financials.dailyNetProfitRs >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                ₹{simulation.baseResult.financials.dailyNetProfitRs}/day
              </div>
            </div>
          </div>
        </div>

        {/* Simulated State */}
        <div className={`p-5 rounded-2xl bg-white border-2 shadow-xs space-y-3 transition-colors ${
          simulation.decisionChanged ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {t.whatIf.simulatedStatus}
            </h3>
            {simulation.decisionChanged ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200 text-amber-950 animate-pulse">
                Decision Changed ⚡
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                Decision Steady
              </span>
            )}
          </div>

          {getDecisionBadge(simulation.simulatedResult.decision)}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-stone-600 font-semibold">{t.whatIf.simulatedYield}</div>
              <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1">
                <span>{simulation.simulatedData.dailyMilkLiters.value} L/day</span>
                {milkPercent !== 0 && (
                  <span className={`text-[11px] font-bold ${milkPercent > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ({milkPercent > 0 ? `+${milkPercent}%` : `${milkPercent}%`})
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-stone-600 font-semibold">{t.whatIf.simulatedNet}</div>
              <div className={`font-extrabold text-sm flex items-center gap-1 ${
                simulation.simulatedResult.financials.dailyNetProfitRs >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                <span>₹{simulation.simulatedResult.financials.dailyNetProfitRs}/day</span>
                {simulation.deltaNetDailyRs !== 0 && (
                  <span className={`text-[11px] font-bold ${
                    simulation.deltaNetDailyRs > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    ({simulation.deltaNetDailyRs > 0 ? `+₹${simulation.deltaNetDailyRs}` : `-₹${Math.abs(simulation.deltaNetDailyRs)}`})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Key Performance Indicators Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Net Monthly Delta */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
            simulation.deltaMonthlyRs > 0
              ? 'bg-emerald-100 text-emerald-800'
              : simulation.deltaMonthlyRs < 0
              ? 'bg-rose-100 text-rose-800'
              : 'bg-stone-100 text-stone-700'
          }`}>
            {simulation.deltaMonthlyRs > 0 ? <TrendingUp className="w-5 h-5" /> : simulation.deltaMonthlyRs < 0 ? <TrendingDown className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-semibold">
              {language === 'ta' ? 'மாதாந்திர நிகர மாற்றம்' : 'Monthly Net Impact'}
            </div>
            <div className={`text-base font-black ${
              simulation.deltaMonthlyRs > 0
                ? 'text-emerald-700'
                : simulation.deltaMonthlyRs < 0
                ? 'text-rose-600'
                : 'text-stone-900'
            }`}>
              {simulation.deltaMonthlyRs > 0 ? `+₹${simulation.deltaMonthlyRs.toLocaleString('en-IN')}` : simulation.deltaMonthlyRs < 0 ? `-₹${Math.abs(simulation.deltaMonthlyRs).toLocaleString('en-IN')}` : '₹0'}
              <span className="text-xs font-medium text-stone-400 ml-1">/mo</span>
            </div>
          </div>
        </div>

        {/* Breakeven Milk Yield Target */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-semibold">
              {language === 'ta' ? 'நஷ்டமில்லா உற்பத்தி அளவு' : 'Breakeven Milk Yield'}
            </div>
            <div className="text-base font-black text-stone-900 flex items-center gap-1.5">
              <span>{simulation.breakevenMilkLiters} L/day</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                simulation.simulatedData.dailyMilkLiters.value >= simulation.breakevenMilkLiters
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {simulation.simulatedData.dailyMilkLiters.value >= simulation.breakevenMilkLiters ? 'Profitable' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>

        {/* Feed Cost to Revenue Ratio */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
            simulation.feedToRevenuePercent <= 65
              ? 'bg-emerald-100 text-emerald-800'
              : simulation.feedToRevenuePercent <= 85
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-semibold">
              {language === 'ta' ? 'தீவன செலவு / வருவாய் விகிதம்' : 'Feed Cost / Revenue Ratio'}
            </div>
            <div className={`text-base font-black ${
              simulation.feedToRevenuePercent <= 65
                ? 'text-emerald-700'
                : simulation.feedToRevenuePercent <= 85
                ? 'text-amber-700'
                : 'text-rose-600'
            }`}>
              {simulation.feedToRevenuePercent}%
              <span className="text-[11px] font-normal text-stone-400 ml-1">
                {simulation.feedToRevenuePercent <= 65 ? '(Healthy)' : simulation.feedToRevenuePercent <= 85 ? '(Tight)' : '(Loss)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Live Insight & Farmer Recommendation */}
      <div className="space-y-3">
        {/* Dynamic Economic Insight */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          simulation.decisionChanged
            ? 'bg-amber-500/10 border-amber-400 text-amber-950'
            : simulation.deltaNetDailyRs > 0
            ? 'bg-emerald-500/10 border-emerald-400 text-emerald-950'
            : simulation.deltaNetDailyRs < 0
            ? 'bg-rose-500/10 border-rose-400 text-rose-950'
            : 'bg-stone-50 border-stone-200 text-stone-800'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'மதிப்பீட்டு பகுப்பாய்வு (Dynamic Live Insight):' : 'Dynamic Scenario Analysis:'}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
            {language === 'ta' ? simulation.summaryInsight.ta : simulation.summaryInsight.en}
          </p>
        </div>

        {/* Dynamic Farmer Action Takeaway */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs text-xs sm:text-sm text-stone-700 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ta' ? 'விவசாயிகளுக்கான உடனடி ஆலோசனை:' : 'Grounded Farmer Action Recommendation:'}</span>
          </div>
          <p className="leading-relaxed text-stone-600">
            {language === 'ta' ? simulation.farmerActionTakeaway.ta : simulation.farmerActionTakeaway.en}
          </p>
        </div>
      </div>

      {/* Interactive Simulation Sliders */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            {language === 'ta' ? 'மதிப்பீட்டு மாற்றிகள் (Simulation Controls)' : 'Scenario Variable Controls'}
          </h3>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.whatIf.resetSliders}</span>
          </button>
        </div>

        <div className="space-y-5">
          {/* Slider 1: Milk Yield Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-stone-800">
                {t.whatIf.milkSlider}
              </label>
              <span className={`font-black text-sm px-2.5 py-0.5 rounded-lg ${
                milkPercent > 0 ? 'bg-emerald-100 text-emerald-800' :
                milkPercent < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
              }`}>
                {milkPercent > 0 ? `+${milkPercent}%` : `${milkPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={milkPercent}
              onChange={(e) => setMilkPercent(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
              <span>-40% (Drying off / Stress)</span>
              <span>0% (Current: {activeCattle.dailyMilkLiters.value}L)</span>
              <span>+40% (Flushing / Feed peak)</span>
            </div>
          </div>

          {/* Slider 2: Feed Cost Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-stone-800">
                {t.whatIf.feedCostSlider}
              </label>
              <span className={`font-black text-sm px-2.5 py-0.5 rounded-lg ${
                feedCostPercent > 0 ? 'bg-rose-100 text-rose-800' :
                feedCostPercent < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
              }`}>
                {feedCostPercent > 0 ? `+${feedCostPercent}%` : `${feedCostPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={feedCostPercent}
              onChange={(e) => setFeedCostPercent(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
              <span>-30% (Own silage / Green grass)</span>
              <span>0% (Base: ₹{activeCattle.dailyFeedCostRs.value || 100}/day)</span>
              <span>+50% (Drought oilcake surge)</span>
            </div>
          </div>

          {/* Slider 3: Medical / Vet Expense Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-stone-800">
                {t.whatIf.medicalCostSlider}
              </label>
              <span className={`font-black text-sm px-2.5 py-0.5 rounded-lg ${
                medicalChangeRs > 0 ? 'bg-rose-100 text-rose-800' :
                medicalChangeRs < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
              }`}>
                {medicalChangeRs > 0 ? `+₹${medicalChangeRs}` : `₹${medicalChangeRs}`}
              </span>
            </div>
            <input
              type="range"
              min="-500"
              max="1500"
              step="100"
              value={medicalChangeRs}
              onChange={(e) => setMedicalChangeRs(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
              <span>-₹500 (Preventive health)</span>
              <span>₹0</span>
              <span>+₹1,500 (Acute illness / mastitis)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
