export type Language = 'en' | 'ta';

export type KnownState = 'known' | 'estimated' | 'unknown';

export interface NumericField {
  value: number;
  state: KnownState;
  unit?: string;
}

export type CattleGender = 'female' | 'male';

export type CattleBreedType =
  | 'Kangeyam (Mayilai)'
  | 'Kangeyam (Kaari)'
  | 'Kangeyam (Sevalai)'
  | 'Kangeyam (Murambu)'
  | 'Kangeyam Standard';

export type CattlePurpose = 'dairy' | 'breeding' | 'draught' | 'other';

export type ProductivityTrend = 'increasing' | 'stable' | 'decreasing' | 'unknown';

export type HealthStatus = 'excellent' | 'good' | 'moderate' | 'poor' | 'unknown';

export type VaccinationStatus = 'fully_vaccinated' | 'partially_vaccinated' | 'unvaccinated' | 'unknown';

export type DecisionType =
  | 'CONTINUE_DAIRY'
  | 'BREEDING_CANDIDATE'
  | 'MONITOR_CLOSELY'
  | 'CONSIDER_SALE';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AnimalInputData {
  id: string;
  tagNumber: string;
  name?: string;
  // Step 1: Basic
  ageYears: NumericField;
  gender: CattleGender;
  breed: CattleBreedType;
  purpose: CattlePurpose;
  calvingCount?: NumericField;
  lactationMonth?: NumericField;

  // Step 2: Productivity
  dailyMilkLiters: NumericField;
  historicalPeakMilkLiters?: NumericField;
  fatPercentage?: NumericField;
  productivityTrend: ProductivityTrend;
  lastLactationDays?: NumericField;

  // Step 3: Health
  healthStatus: HealthStatus;
  vaccinationStatus: VaccinationStatus;
  recentHealthProblems: string; // "None", "Mastitis", "Digestive/Bloat", "Tick fever", "Deworming pending", etc.
  medicalExpensesMonth: NumericField;
  bodyScore: NumericField; // 1 to 5 body condition score

  // Step 4: Management & Economics
  dailyFeedKg: NumericField;
  dailyFeedCostRs: NumericField;
  dailyMilkPricePerLiter: NumericField; // e.g. ₹45 - ₹65 for Kangeyam A2 milk
  monthlyMaintenanceCostRs: NumericField;
  estimatedMarketValueRs: NumericField;
  breedingHistoryNote: string;
}

export interface ProductRecommendation {
  id: string;
  needCategory: {
    en: string;
    ta: string;
  };
  productName: {
    en: string;
    ta: string;
  };
  category: string;
  reason: {
    en: string;
    ta: string;
  };
  confidence: ConfidenceLevel;
  dosageGuidance: {
    en: string;
    ta: string;
  };
  isVeterinaryRestricted: boolean;
  verifiedBrandRef?: string;
}

export interface ActionItem {
  id: string;
  stepNumber: number;
  title: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
  priority: 'high' | 'medium' | 'low';
  category: 'nutrition' | 'health' | 'management' | 'breeding' | 'economics';
}

export interface DataConfidenceBreakdown {
  level: ConfidenceLevel;
  score: number; // 0 - 100
  knownFields: { key: string; labelEn: string; labelTa: string }[];
  estimatedFields: { key: string; labelEn: string; labelTa: string }[];
  unknownFields: { key: string; labelEn: string; labelTa: string }[];
  warningMessage?: {
    en: string;
    ta: string;
  };
}

export interface DecisionResult {
  decision: DecisionType;
  confidence: ConfidenceLevel;
  overallScore: number;
  indicators: {
    health: 'good' | 'moderate' | 'poor';
    productivity: 'increasing' | 'stable' | 'decreasing' | 'unknown';
    economics: 'profit' | 'breakeven' | 'loss';
    dataQuality: ConfidenceLevel;
  };
  financials: {
    dailyRevenueRs: number;
    dailyFeedCostRs: number;
    dailyNetProfitRs: number;
    monthlyProjectedNetRs: number;
  };
  reasons: {
    en: string;
    ta: string;
  }[];
  actions: ActionItem[];
  productRecommendations: ProductRecommendation[];
  dataConfidence: DataConfidenceBreakdown;
  edgeCasesDetected?: {
    id: string;
    type: 'warning' | 'alert' | 'info';
    title: {
      en: string;
      ta: string;
    };
    message: {
      en: string;
      ta: string;
    };
  }[];
  dataConflictDetected?: {
    detected: boolean;
    title: {
      en: string;
      ta: string;
    };
    message: {
      en: string;
      ta: string;
    };
  };
  generatedAt: string;
}

export interface CattleRecord extends AnimalInputData {
  createdAt: string;
  updatedAt: string;
  analysis?: DecisionResult;
  milkHistory?: { month: string; liters: number }[];
  costHistory?: { month: string; feedCost: number; vetCost: number }[];
}

export interface KnowledgeArticle {
  id: string;
  category: 'breed' | 'feeding' | 'health' | 'breeding' | 'economics' | 'products';
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  contentEn: string;
  contentTa: string;
  source: string;
  tags: string[];
}
