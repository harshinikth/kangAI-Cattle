import React, { useState } from 'react';
import { CattleRecord, DecisionType, Language } from '../types';
import { getT } from '../translations';
import {
  Mic,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Minus,
  Pill,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  BarChart3,
} from 'lucide-react';
import { ProductivityChart, CostBreakdownChart } from './Charts';

interface AnimalProfileViewProps {
  cattle: CattleRecord;
  language: Language;
  onOpenVoiceWithContext: (cattle: CattleRecord) => void;
  onOpenWhatIf: (cattle: CattleRecord) => void;
  onReAnalyze: () => void;
}

export const AnimalProfileView: React.FC<AnimalProfileViewProps> = ({
  cattle,
  language,
  onOpenVoiceWithContext,
  onOpenWhatIf,
  onReAnalyze,
}) => {
  const t = getT(language);
  const [showCharts, setShowCharts] = useState(false);
  const [showDataDetails, setShowDataDetails] = useState(false);

  const analysis = cattle.analysis;
  if (!analysis) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <p className="text-stone-600 mb-4">{language === 'ta' ? 'இந்த மாட்டின் விவரங்களை ஆராயவும்' : 'Analyze this cattle to view decision.'}</p>
        <button
          onClick={onReAnalyze}
          className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold"
        >
          {t.quickActions.analyzeAnimal}
        </button>
      </div>
    );
  }

  const decision = analysis.decision;
  const dataConfidence = analysis.dataConfidence;

  // Visual decision palette
  const getDecisionTheme = (d: DecisionType) => {
    switch (d) {
      case 'CONTINUE_DAIRY':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          border: 'border-emerald-400',
          dot: 'bg-emerald-500',
          icon: '🟢',
          title: t.decisionTypes.CONTINUE_DAIRY,
        };
      case 'BREEDING_CANDIDATE':
        return {
          bg: 'bg-purple-50 border-purple-300 text-purple-950',
          badgeBg: 'bg-purple-600 text-white',
          border: 'border-purple-400',
          dot: 'bg-purple-500',
          icon: '🟣',
          title: t.decisionTypes.BREEDING_CANDIDATE,
        };
      case 'MONITOR_CLOSELY':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          border: 'border-amber-400',
          dot: 'bg-amber-500',
          icon: '🟡',
          title: t.decisionTypes.MONITOR_CLOSELY,
        };
      case 'CONSIDER_SALE':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          border: 'border-rose-400',
          dot: 'bg-rose-500',
          icon: '🔴',
          title: t.decisionTypes.CONSIDER_SALE,
        };
    }
  };

  const theme = getDecisionTheme(decision);

  const getTrendBadge = (trend: string) => {
    if (trend === 'increasing') {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
          <TrendingUp className="w-4 h-4" />
          {language === 'ta' ? 'அதிகரிக்கிறது' : 'Increasing'}
        </span>
      );
    }
    if (trend === 'decreasing') {
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
          <TrendingDown className="w-4 h-4" />
          {language === 'ta' ? 'குறைகிறது' : 'Declining'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-stone-600 font-bold">
        <Minus className="w-4 h-4" />
        {language === 'ta' ? 'சீரானது' : 'Stable'}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-3xl shrink-0 border border-stone-200">
            🐄
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {cattle.tagNumber}
              </h2>
              {cattle.name && (
                <span className="text-sm font-bold text-stone-600">
                  ({cattle.name})
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                {cattle.purpose.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
              {cattle.breed} • {cattle.ageYears.value} {language === 'ta' ? 'ஆண்டுகள்' : 'years'} • {cattle.gender === 'female' ? (language === 'ta' ? 'பெண் மாடு' : 'Female') : (language === 'ta' ? 'ஆண் காளை' : 'Male')}
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="ask-about-animal-btn"
            onClick={() => onOpenVoiceWithContext(cattle)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{t.profile.askAboutAnimal}</span>
          </button>

          <button
            onClick={() => onOpenWhatIf(cattle)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition-all cursor-pointer border border-stone-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            <span>What-If?</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Clean Summary Gauges / Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Health */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 mb-1">{t.profile.health}</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-base font-extrabold text-stone-900 capitalize">
              {cattle.healthStatus === 'excellent' ? (language === 'ta' ? 'மிக நன்று' : 'Excellent') :
               cattle.healthStatus === 'good' ? (language === 'ta' ? 'நன்று' : 'Good') :
               cattle.healthStatus === 'moderate' ? (language === 'ta' ? 'சுமூகமானது' : 'Moderate') :
               (language === 'ta' ? 'பலவீனம்' : 'Poor')}
            </span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1 truncate">
            {cattle.recentHealthProblems || 'No acute issues'}
          </div>
        </div>

        {/* Productivity */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 mb-1">{t.profile.productivity}</div>
          <div className="text-base font-extrabold text-stone-900 flex items-center gap-1.5">
            <span>{cattle.dailyMilkLiters.value} L/day</span>
          </div>
          <div className="text-[11px] mt-1">
            {getTrendBadge(cattle.productivityTrend)}
          </div>
        </div>

        {/* Economics */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 mb-1">{t.profile.economics}</div>
          <div className={`text-base font-extrabold ${
            analysis.financials.dailyNetProfitRs >= 25 ? 'text-emerald-700' :
            analysis.financials.dailyNetProfitRs >= 0 ? 'text-amber-700' : 'text-rose-600'
          }`}>
            ₹{analysis.financials.dailyNetProfitRs}/day
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {analysis.financials.dailyNetProfitRs >= 0 ? (language === 'ta' ? 'நிகர லாபம்' : 'Net Margin') : (language === 'ta' ? 'நிகர நஷ்டம்' : 'Net Deficit')}
          </div>
        </div>

        {/* Data Quality / Confidence */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 mb-1">{t.profile.dataQuality}</div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              dataConfidence.level === 'HIGH' ? 'bg-emerald-100 text-emerald-800' :
              dataConfidence.level === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {dataConfidence.level === 'HIGH' ? t.confidenceLevels.HIGH :
               dataConfidence.level === 'MEDIUM' ? t.confidenceLevels.MEDIUM :
               t.confidenceLevels.LOW}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="text-[11px] text-emerald-800 font-bold mt-1.5 flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>{showDataDetails ? (language === 'ta' ? 'மறைக்க' : 'Hide details') : (language === 'ta' ? 'விபரம் காண்க' : 'View breakdown')}</span>
            {showDataDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3. Data Confidence Breakdown Drawer */}
      {showDataDetails && (
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {t.confidenceSummary.title} ({dataConfidence.score}%)
            </h4>
            <span className="text-[11px] text-stone-500">
              {language === 'ta' ? 'உண்மையான பதிவுகளின் தரம்' : 'Uncertainty-Aware Assessment'}
            </span>
          </div>

          <p className="text-xs text-stone-600">
            {t.confidenceSummary.notice}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Known */}
            <div className="p-3 bg-white rounded-xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.confidenceSummary.known} ({dataConfidence.knownFields.length})
              </div>
              <ul className="text-xs text-stone-700 space-y-1">
                {dataConfidence.knownFields.map((f) => (
                  <li key={f.key} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{language === 'ta' ? f.labelTa : f.labelEn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated */}
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {t.confidenceSummary.estimated} ({dataConfidence.estimatedFields.length})
              </div>
              <ul className="text-xs text-stone-700 space-y-1">
                {dataConfidence.estimatedFields.length === 0 ? (
                  <li className="text-stone-400 italic">None</li>
                ) : (
                  dataConfidence.estimatedFields.map((f) => (
                    <li key={f.key} className="flex items-center gap-1.5">
                      <span className="text-amber-600 font-bold">~</span>
                      <span>{language === 'ta' ? f.labelTa : f.labelEn}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Unknown */}
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {t.confidenceSummary.unknown} ({dataConfidence.unknownFields.length})
              </div>
              <ul className="text-xs text-stone-700 space-y-1">
                {dataConfidence.unknownFields.length === 0 ? (
                  <li className="text-stone-400 italic">{language === 'ta' ? 'விடுபட்ட தகவல்கள் இல்லை' : 'No missing fields'}</li>
                ) : (
                  dataConfidence.unknownFields.map((f) => (
                    <li key={f.key} className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-bold">?</span>
                      <span>{language === 'ta' ? f.labelTa : f.labelEn}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3.5. Data Conflict Alert Banner (If detected) */}
      {analysis.dataConflictDetected?.detected && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-rose-950">
              {language === 'ta' ? analysis.dataConflictDetected.title.ta : analysis.dataConflictDetected.title.en}
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              {language === 'ta' ? analysis.dataConflictDetected.message.ta : analysis.dataConflictDetected.message.en}
            </p>
          </div>
        </div>
      )}

      {/* 3.6. Special Edge Cases & Diagnostic Notices (Problem 9 compliance) */}
      {analysis.edgeCasesDetected && analysis.edgeCasesDetected.length > 0 && (
        <div className="space-y-2.5">
          {analysis.edgeCasesDetected.map((ec) => (
            <div
              key={ec.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                ec.type === 'alert'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : ec.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  ec.type === 'alert'
                    ? 'text-rose-600'
                    : ec.type === 'warning'
                    ? 'text-amber-600'
                    : 'text-stone-500'
                }`}
              />
              <div>
                <strong className="font-extrabold block text-xs mb-0.5">
                  {language === 'ta' ? ec.title.ta : ec.title.en}
                </strong>
                <p className="leading-relaxed">{language === 'ta' ? ec.message.ta : ec.message.en}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Single Prominent RECOMMENDED DECISION CARD */}
      <div className={`p-6 sm:p-8 rounded-2xl border-2 ${theme.bg} ${theme.border} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-stone-700 block mb-1">
              {t.profile.recommendedDecision}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{theme.icon}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {theme.title}
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 shadow-2xs self-start sm:self-auto">
            <span>{t.confidenceSummary.title}:</span>
            <span className={`px-2 py-0.5 rounded ${theme.badgeBg}`}>
              {analysis.confidence === 'HIGH' ? t.confidenceLevels.HIGH :
               analysis.confidence === 'MEDIUM' ? t.confidenceLevels.MEDIUM :
               t.confidenceLevels.LOW}
            </span>
          </div>
        </div>

        {/* WHY? SECTION (3-5 Concise Reasons) */}
        <div className="pt-4 border-t border-stone-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-stone-700" />
            {t.profile.whyTitle}
          </h4>

          <div className="space-y-2">
            {analysis.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 font-medium bg-white/70 p-2.5 rounded-xl border border-stone-200/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-stone-700 mt-2 shrink-0"></span>
                <span>{language === 'ta' ? reason.ta : reason.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. WHAT SHOULD I DO? (ACTIONABLE RECOMMENDATION PLAN) */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              {t.profile.whatToDoTitle}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'ta'
                ? 'மாட்டின் உற்பத்தி மற்றும் ஆரோக்கியத்தை மேம்படுத்த செய்ய வேண்டிய நடவடிக்கைகள்'
                : 'Prioritized sequential steps to optimize production, nutrition, and management.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.actions.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3.5 hover:border-emerald-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                {act.stepNumber}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {language === 'ta' ? act.title.ta : act.title.en}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    act.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : act.priority === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {act.priority} priority
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'ta' ? act.description.ta : act.description.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECOMMENDED PRODUCTS / NUTRITIONAL SUPPORT */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-700" />
            {t.profile.productRecTitle}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'ta'
              ? 'சான்றளிக்கப்பட்ட தீவன மற்றும் தாது உப்பு கலவைகள் (விதிமுறைகளின் படி)'
              : 'Grounded verified feed additives and micronutrient formulations based on assessment.'}
          </p>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>{t.profile.vetNotice}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {analysis.productRecommendations.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {language === 'ta' ? prod.needCategory.ta : prod.needCategory.en}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold">
                    {prod.confidence} Conf
                  </span>
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm mb-1.5">
                  {language === 'ta' ? prod.productName.ta : prod.productName.en}
                </h4>

                <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                  {language === 'ta' ? prod.reason.ta : prod.reason.en}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-600 font-medium">
                <strong className="text-stone-800">{language === 'ta' ? 'பயன்பாட்டு முறை:' : 'Dosage/Usage:'} </strong>
                {language === 'ta' ? prod.dosageGuidance.ta : prod.dosageGuidance.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Optional Analytics Expander */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-bold text-stone-900">
              {showCharts ? t.profile.hideAnalytics : t.profile.viewAnalytics}
            </span>
          </div>
          {showCharts ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {showCharts && (
          <div className="p-6 border-t border-stone-200 space-y-6 bg-stone-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ta' ? 'பால் உற்பத்தி போக்கு (லிட்டர்/நாள்)' : 'Milk Productivity Trend (L/day)'}
                </h4>
                <ProductivityChart data={cattle.milkHistory} language={language} />
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ta' ? 'மாதாந்திர தீவன & மருத்துவ செலவு (₹)' : 'Monthly Feed & Medical Costs (₹)'}
                </h4>
                <CostBreakdownChart data={cattle.costHistory} language={language} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
