import React, { useState } from 'react';
import {
  AnimalInputData,
  CattleBreedType,
  CattleGender,
  CattlePurpose,
  HealthStatus,
  KnownState,
  Language,
  NumericField,
  ProductivityTrend,
  VaccinationStatus,
} from '../types';
import { getT } from '../translations';
import { calculateDataConfidence, validateAnimalInput } from '../services/decisionEngine';
import {
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SAMPLE_CATTLE } from '../data/sampleCattle';

interface AnalyzeAnimalViewProps {
  language: Language;
  onAnalysisComplete: (data: AnimalInputData) => void;
  initialData?: AnimalInputData;
}

export const AnalyzeAnimalView: React.FC<AnalyzeAnimalViewProps> = ({
  language,
  onAnalysisComplete,
  initialData,
}) => {
  const t = getT(language);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{ field: string; messageEn: string; messageTa: string }[]>([]);

  // Form State initialized with realistic defaults (or KC104 structure)
  const [formData, setFormData] = useState<AnimalInputData>(() => {
    if (initialData) return initialData;
    return {
      id: `kc-${Date.now()}`,
      tagNumber: 'KC104',
      name: 'Valli',
      ageYears: { value: 5, state: 'known', unit: 'years' },
      gender: 'female',
      breed: 'Kangeyam (Mayilai)',
      purpose: 'dairy',
      calvingCount: { value: 2, state: 'known' },
      lactationMonth: { value: 4, state: 'known' },

      dailyMilkLiters: { value: 2.8, state: 'known', unit: 'L/day' },
      historicalPeakMilkLiters: { value: 5.0, state: 'estimated', unit: 'L/day' },
      fatPercentage: { value: 4.8, state: 'estimated', unit: '%' },
      productivityTrend: 'decreasing',
      lastLactationDays: { value: 120, state: 'estimated' },

      healthStatus: 'moderate',
      vaccinationStatus: 'partially_vaccinated',
      recentHealthProblems: 'Mild digestive upset in last 2 weeks',
      medicalExpensesMonth: { value: 650, state: 'estimated', unit: '₹' },
      bodyScore: { value: 3.2, state: 'known' },

      dailyFeedKg: { value: 16, state: 'estimated', unit: 'kg/day' },
      dailyFeedCostRs: { value: 125, state: 'estimated', unit: '₹/day' },
      dailyMilkPricePerLiter: { value: 52, state: 'known', unit: '₹/L' },
      monthlyMaintenanceCostRs: { value: 800, state: 'unknown', unit: '₹/month' },
      estimatedMarketValueRs: { value: 68000, state: 'estimated', unit: '₹' },
      breedingHistoryNote: 'Conceived 2nd parity naturally.',
    };
  });

  // Calculate live data confidence
  const liveConfidence = calculateDataConfidence(formData);

  // Helper for numeric field state changes
  const updateNumeric = (
    field: keyof AnimalInputData,
    val: number,
    state?: KnownState
  ) => {
    setValidationErrors([]);
    setFormData((prev) => {
      const current = prev[field] as NumericField;
      return {
        ...prev,
        [field]: {
          ...current,
          value: isNaN(val) ? 0 : val,
          state: state !== undefined ? state : current.state,
        },
      };
    });
  };

  const updateNumericState = (field: keyof AnimalInputData, state: KnownState) => {
    setFormData((prev) => {
      const current = prev[field] as NumericField;
      return {
        ...prev,
        [field]: {
          ...current,
          state,
        },
      };
    });
  };

  const loadPreset = (presetTag: string) => {
    setValidationErrors([]);
    const found = SAMPLE_CATTLE.find((c) => c.tagNumber === presetTag);
    if (found) {
      setFormData({ ...found, id: `kc-${Date.now()}` });
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAnimalInput(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    onAnalysisComplete(formData);
  };

  const handleNextStep = () => {
    const validation = validateAnimalInput(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    setCurrentStep((s) => s + 1);
  };

  // Reusable 3-way toggle button for numerical inputs
  const renderStateToggle = (field: keyof AnimalInputData) => {
    const current = formData[field] as NumericField;
    const currentState = current?.state || 'known';

    return (
      <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 shrink-0">
        <button
          type="button"
          onClick={() => updateNumericState(field, 'known')}
          className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
            currentState === 'known'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Recorded / Accurate"
        >
          {t.form.dataStateToggle.known}
        </button>
        <button
          type="button"
          onClick={() => updateNumericState(field, 'estimated')}
          className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
            currentState === 'estimated'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Approximate / Estimate"
        >
          {t.form.dataStateToggle.estimated}
        </button>
        <button
          type="button"
          onClick={() => updateNumericState(field, 'unknown')}
          className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
            currentState === 'unknown'
              ? 'bg-stone-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Not Available / Don't Know"
        >
          {t.form.dataStateToggle.unknown}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Presets bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.form.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {t.form.subtitle}
          </p>
        </div>

        {/* Demo preset loaders */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-stone-400">
            {language === 'ta' ? 'மாதிரி நிலை:' : 'Test Scenario:'}
          </span>
          {[
            { tag: 'KC104', label: 'KC104 (Valli)' },
            { tag: 'KC108', label: 'KC108 (Breeding)' },
            { tag: 'KC102', label: 'KC102 (Dairy)' },
            { tag: 'KC95', label: 'KC95 (Sale)' },
            { tag: 'CASE1-HIGH-COST', label: 'Case 1: High Cost' },
            { tag: 'CASE2-VAX-OVERDUE', label: 'Case 2: Vax Due' },
            { tag: 'CASE5-YOUNG-HEIFER', label: 'Case 5: Young' },
            { tag: 'CASE6-SUDDEN-DROP', label: 'Case 6: Drop' },
            { tag: 'CASE11-CONFLICT-DATA', label: 'Case 11: Conflict' },
          ].map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => loadPreset(item.tag)}
              className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                formData.tagNumber === item.tag
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'உள்ளீட்டுப் பிழை (சரிபார்க்கவும்)' : 'Invalid Input Detected'}
            </h4>
            <ul className="text-xs text-rose-800 space-y-1 font-medium list-disc list-inside">
              {validationErrors.map((err, idx) => (
                <li key={idx}>
                  {language === 'ta' ? err.messageTa : err.messageEn}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Live Data Confidence Meter Bar */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
            liveConfidence.level === 'HIGH'
              ? 'bg-emerald-500 text-white'
              : liveConfidence.level === 'MEDIUM'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-500 text-white'
          }`}>
            {liveConfidence.score}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                {t.confidenceSummary.title}:
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                liveConfidence.level === 'HIGH'
                  ? 'bg-emerald-900 text-emerald-300'
                  : liveConfidence.level === 'MEDIUM'
                  ? 'bg-amber-900 text-amber-300'
                  : 'bg-rose-900 text-rose-300'
              }`}>
                {liveConfidence.level === 'HIGH'
                  ? t.confidenceLevels.HIGH
                  : liveConfidence.level === 'MEDIUM'
                  ? t.confidenceLevels.MEDIUM
                  : t.confidenceLevels.LOW}
              </span>
            </div>
            <div className="text-[11px] text-stone-300 flex items-center gap-3 mt-1">
              <span>✓ {liveConfidence.knownFields.length} {t.confidenceSummary.known}</span>
              <span>~ {liveConfidence.estimatedFields.length} {t.confidenceSummary.estimated}</span>
              <span>? {liveConfidence.unknownFields.length} {t.confidenceSummary.unknown}</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 sm:text-right max-w-xs font-normal">
          {liveConfidence.warningMessage
            ? (language === 'ta' ? liveConfidence.warningMessage.ta : liveConfidence.warningMessage.en)
            : (language === 'ta' ? 'அனைத்து முக்கிய தரவுகளும் உள்ளிடப்பட்டுள்ளன.' : 'All primary fields recorded accurately.')}
        </div>
      </div>

      {/* Step Indicators (4 Clean Steps) */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: t.form.step1Title },
          { num: 2, label: t.form.step2Title },
          { num: 3, label: t.form.step3Title },
          { num: 4, label: t.form.step4Title },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === s.num
                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                : currentStep > s.num
                ? 'bg-white border-stone-300 text-stone-700'
                : 'bg-white/60 border-stone-200 text-stone-400'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.num
                  ? 'bg-emerald-700 text-white'
                  : currentStep > s.num
                  ? 'bg-stone-300 text-stone-800'
                  : 'bg-stone-100 text-stone-400'
              }`}>
                {currentStep > s.num ? <Check className="w-3 h-3" /> : s.num}
              </span>
              <span className="text-[11px] font-bold truncate hidden sm:inline">
                {s.label.split('.')[1]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">{t.form.step1Title}</h3>
              <p className="text-xs text-stone-500">
                {language === 'ta'
                  ? 'மாட்டின் அடையாள எண், வயது, இனம் மற்றும் முதன்மை பயன்பாட்டை தேர்ந்தெடுக்கவும்.'
                  : 'Specify animal identification, age, gender, Kangeyam variety, and primary purpose.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.animalId} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagNumber}
                  onChange={(e) => setFormData({ ...formData, tagNumber: e.target.value })}
                  placeholder="e.g. KC104"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.animalName}
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Valli"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Age with 3-way toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.ageYears} *
                  </label>
                  {renderStateToggle('ageYears')}
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="20"
                  disabled={formData.ageYears.state === 'unknown'}
                  value={formData.ageYears.state === 'unknown' ? '' : formData.ageYears.value}
                  onChange={(e) => updateNumeric('ageYears', parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100 disabled:text-stone-400"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.gender}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['female', 'male'] as CattleGender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.gender === g
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {g === 'female' ? (language === 'ta' ? 'பெண் (Cow/Heifer)' : 'Female (Cow/Heifer)') : (language === 'ta' ? 'ஆண் (Bull)' : 'Male (Bull)')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breed Variety */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.breed}
                </label>
                <select
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value as CattleBreedType })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Kangeyam (Mayilai)">Kangeyam - Mayilai (மயிலை - Grey/White)</option>
                  <option value="Kangeyam (Kaari)">Kangeyam - Kaari (காரி - Black)</option>
                  <option value="Kangeyam (Sevalai)">Kangeyam - Sevalai (செவலை - Red)</option>
                  <option value="Kangeyam (Murambu)">Kangeyam - Murambu (முரம்பு - Brownish)</option>
                  <option value="Kangeyam Standard">Kangeyam Standard / Native Mixed</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.purpose}
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value as CattlePurpose })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="dairy">{t.form.purposes.dairy}</option>
                  <option value="breeding">{t.form.purposes.breeding}</option>
                  <option value="draught">{t.form.purposes.draught}</option>
                  <option value="other">{t.form.purposes.other}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Productivity */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">{t.form.step2Title}</h3>
              <p className="text-xs text-stone-500">
                {language === 'ta'
                  ? 'தற்போதைய பால் உற்பத்தி அளவு மற்றும் உற்பத்தி போக்கை குறிப்பிடவும்.'
                  : 'Record daily milk production, historical peak, and trend trajectory.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Milk with Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.dailyMilk} *
                  </label>
                  {renderStateToggle('dailyMilkLiters')}
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  disabled={formData.dailyMilkLiters.state === 'unknown'}
                  value={formData.dailyMilkLiters.state === 'unknown' ? '' : formData.dailyMilkLiters.value}
                  onChange={(e) => updateNumeric('dailyMilkLiters', parseFloat(e.target.value))}
                  placeholder="e.g. 2.8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Historical Peak Milk */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.peakMilk}
                  </label>
                  {renderStateToggle('historicalPeakMilkLiters')}
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  disabled={formData.historicalPeakMilkLiters?.state === 'unknown'}
                  value={formData.historicalPeakMilkLiters?.state === 'unknown' ? '' : formData.historicalPeakMilkLiters?.value}
                  onChange={(e) => updateNumeric('historicalPeakMilkLiters', parseFloat(e.target.value))}
                  placeholder="e.g. 5.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Productivity Trend */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {t.form.fields.prodTrend} *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { key: 'increasing', label: t.form.trends.increasing },
                      { key: 'stable', label: t.form.trends.stable },
                      { key: 'decreasing', label: t.form.trends.decreasing },
                      { key: 'unknown', label: t.form.trends.unknown },
                    ] as { key: ProductivityTrend; label: string }[]
                  ).map((tr) => (
                    <button
                      key={tr.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, productivityTrend: tr.key })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        formData.productivityTrend === tr.key
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fat % */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.fatPct}
                  </label>
                  {renderStateToggle('fatPercentage')}
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="9"
                  disabled={formData.fatPercentage?.state === 'unknown'}
                  value={formData.fatPercentage?.state === 'unknown' ? '' : formData.fatPercentage?.value}
                  onChange={(e) => updateNumeric('fatPercentage', parseFloat(e.target.value))}
                  placeholder="e.g. 4.8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Lactation Month */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.lactationMonth}
                  </label>
                  {renderStateToggle('lactationMonth')}
                </div>
                <input
                  type="number"
                  min="1"
                  max="18"
                  disabled={formData.lactationMonth?.state === 'unknown'}
                  value={formData.lactationMonth?.state === 'unknown' ? '' : formData.lactationMonth?.value}
                  onChange={(e) => updateNumeric('lactationMonth', parseInt(e.target.value, 10))}
                  placeholder="e.g. 4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Health & Medical */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">{t.form.step3Title}</h3>
              <p className="text-xs text-stone-500">
                {language === 'ta'
                  ? 'உடல் நலம், தடுப்பூசி நிலை மற்றும் சமீபத்திய மருத்துவ செலவுகளை உள்ளிடவும்.'
                  : 'Current health condition, vaccination records, recent illness, and veterinary expenses.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Health Condition */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.healthStatus} *
                </label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value as HealthStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="excellent">{t.form.healthStates.excellent}</option>
                  <option value="good">{t.form.healthStates.good}</option>
                  <option value="moderate">{t.form.healthStates.moderate}</option>
                  <option value="poor">{t.form.healthStates.poor}</option>
                  <option value="unknown">{t.form.healthStates.unknown}</option>
                </select>
              </div>

              {/* Vaccination Status */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.vaccination} *
                </label>
                <select
                  value={formData.vaccinationStatus}
                  onChange={(e) => setFormData({ ...formData, vaccinationStatus: e.target.value as VaccinationStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="fully_vaccinated">{t.form.vaxStates.fully_vaccinated}</option>
                  <option value="partially_vaccinated">{t.form.vaxStates.partially_vaccinated}</option>
                  <option value="unvaccinated">{t.form.vaxStates.unvaccinated}</option>
                  <option value="unknown">{t.form.vaxStates.unknown}</option>
                </select>
              </div>

              {/* Recent Health Problems */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.healthProblems}
                </label>
                <input
                  type="text"
                  value={formData.recentHealthProblems}
                  onChange={(e) => setFormData({ ...formData, recentHealthProblems: e.target.value })}
                  placeholder={language === 'ta' ? 'எ.கா: செரிமான குறைபாடு / மந்தம் அல்லது ஏதுமில்லை' : 'e.g. Mild digestive upset, mastitis, or None'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Medical Expenses */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.medicalExpenses}
                  </label>
                  {renderStateToggle('medicalExpensesMonth')}
                </div>
                <input
                  type="number"
                  step="50"
                  min="0"
                  disabled={formData.medicalExpensesMonth?.state === 'unknown'}
                  value={formData.medicalExpensesMonth?.state === 'unknown' ? '' : formData.medicalExpensesMonth?.value}
                  onChange={(e) => updateNumeric('medicalExpensesMonth', parseFloat(e.target.value))}
                  placeholder="e.g. 650"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Body Condition Score (1-5) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.bodyScore} (1 to 5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.bodyScore?.value || 3.0}
                  onChange={(e) => updateNumeric('bodyScore', parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Management & Economics */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">{t.form.step4Title}</h3>
              <p className="text-xs text-stone-500">
                {language === 'ta'
                  ? 'தீவன அளவு, தினசரி செலவு, பால் விலை மற்றும் சந்தை மதிப்பீட்டை உள்ளிடவும்.'
                  : 'Daily feed consumption, feed cost, milk price, and estimated market value.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Feed Kg */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.dailyFeedKg}
                  </label>
                  {renderStateToggle('dailyFeedKg')}
                </div>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="40"
                  disabled={formData.dailyFeedKg.state === 'unknown'}
                  value={formData.dailyFeedKg.state === 'unknown' ? '' : formData.dailyFeedKg.value}
                  onChange={(e) => updateNumeric('dailyFeedKg', parseFloat(e.target.value))}
                  placeholder="e.g. 16"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Daily Feed Cost ₹ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.dailyFeedCost} *
                  </label>
                  {renderStateToggle('dailyFeedCostRs')}
                </div>
                <input
                  type="number"
                  step="5"
                  min="0"
                  disabled={formData.dailyFeedCostRs.state === 'unknown'}
                  value={formData.dailyFeedCostRs.state === 'unknown' ? '' : formData.dailyFeedCostRs.value}
                  onChange={(e) => updateNumeric('dailyFeedCostRs', parseFloat(e.target.value))}
                  placeholder="e.g. 125"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Milk Price Per Liter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.milkPrice} (₹/L)
                </label>
                <input
                  type="number"
                  step="1"
                  min="20"
                  max="120"
                  value={formData.dailyMilkPricePerLiter?.value || 52}
                  onChange={(e) => updateNumeric('dailyMilkPricePerLiter', parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Estimated Market Value */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.form.fields.marketValue}
                  </label>
                  {renderStateToggle('estimatedMarketValueRs')}
                </div>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  disabled={formData.estimatedMarketValueRs.state === 'unknown'}
                  value={formData.estimatedMarketValueRs.state === 'unknown' ? '' : formData.estimatedMarketValueRs.value}
                  onChange={(e) => updateNumeric('estimatedMarketValueRs', parseFloat(e.target.value))}
                  placeholder="e.g. 68000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none disabled:bg-stone-100"
                />
              </div>

              {/* Breeding notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.form.fields.breedingNotes}
                </label>
                <input
                  type="text"
                  value={formData.breedingHistoryNote}
                  onChange={(e) => setFormData({ ...formData, breedingHistoryNote: e.target.value })}
                  placeholder={language === 'ta' ? 'வம்சாவளி, சினை விவரங்கள்' : 'Lineage, natural mating or AI notes'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.form.prev}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              <span>{t.form.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="submit-analysis-btn"
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm transition-all cursor-pointer shadow-md active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.form.submitAnalyze}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
