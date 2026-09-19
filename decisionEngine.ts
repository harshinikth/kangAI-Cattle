import {
  AnimalInputData,
  ConfidenceLevel,
  DataConfidenceBreakdown,
  DecisionResult,
  DecisionType,
  ProductRecommendation,
  ActionItem,
} from '../types';
import { VERIFIED_PRODUCTS } from '../data/knowledgeBase';

/**
  * Validates animal form inputs against invalid and negative numbers
  */
export function validateAnimalInput(data: Partial<AnimalInputData>): {
  isValid: boolean;
  errors: { field: string; messageEn: string; messageTa: string }[];
} {
  const errors: { field: string; messageEn: string; messageTa: string }[] = [];

  if (data.ageYears && data.ageYears.value < 0) {
    errors.push({
      field: 'ageYears',
      messageEn: 'Age cannot be negative.',
      messageTa: 'வயது எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  } else if (data.ageYears && data.ageYears.value > 25) {
    errors.push({
      field: 'ageYears',
      messageEn: 'Please enter a valid age (0 to 25 years).',
      messageTa: 'சரியான வயதை உள்ளிடவும் (0 முதல் 25 ஆண்டுகள்).',
    });
  }

  if (data.dailyMilkLiters && data.dailyMilkLiters.value < 0) {
    errors.push({
      field: 'dailyMilkLiters',
      messageEn: 'Daily milk yield cannot be negative.',
      messageTa: 'பால் உற்பத்தி எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  }

  if (data.dailyFeedKg && data.dailyFeedKg.value < 0) {
    errors.push({
      field: 'dailyFeedKg',
      messageEn: 'Daily feed quantity cannot be negative.',
      messageTa: 'தீவன அளவு எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  }

  if (data.dailyFeedCostRs && data.dailyFeedCostRs.value < 0) {
    errors.push({
      field: 'dailyFeedCostRs',
      messageEn: 'Daily feed cost cannot be negative.',
      messageTa: 'தீவன செலவு எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  }

  if (data.medicalExpensesMonth && data.medicalExpensesMonth.value < 0) {
    errors.push({
      field: 'medicalExpensesMonth',
      messageEn: 'Medical expenses cannot be negative.',
      messageTa: 'மருத்துவ செலவு எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  }

  if (data.estimatedMarketValueRs && data.estimatedMarketValueRs.value < 0) {
    errors.push({
      field: 'estimatedMarketValueRs',
      messageEn: 'Market value cannot be negative.',
      messageTa: 'சந்தை மதிப்பு எதிர்மறை எண்ணாக இருக்கக்கூடாது.',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates Data Confidence score & classification based on data certainty
 */
export function calculateDataConfidence(data: AnimalInputData): DataConfidenceBreakdown {
  const knownFields: { key: string; labelEn: string; labelTa: string }[] = [];
  const estimatedFields: { key: string; labelEn: string; labelTa: string }[] = [];
  const unknownFields: { key: string; labelEn: string; labelTa: string }[] = [];

  // Check critical fields
  const fieldChecks: {
    key: string;
    state: string;
    labelEn: string;
    labelTa: string;
    weight: number;
  }[] = [
    { key: 'age', state: data.ageYears.state, labelEn: 'Age', labelTa: 'வயது', weight: 10 },
    { key: 'milk', state: data.dailyMilkLiters.state, labelEn: 'Current Milk Yield', labelTa: 'தற்போதைய பால் அளவு', weight: 25 },
    { key: 'peakMilk', state: data.historicalPeakMilkLiters?.state || 'unknown', labelEn: 'Historical Peak Milk', labelTa: 'அதிகபட்ச பால் பதிவு', weight: 10 },
    { key: 'trend', state: data.productivityTrend === 'unknown' ? 'unknown' : 'known', labelEn: 'Productivity Trend', labelTa: 'உற்பத்தி போக்கு', weight: 15 },
    { key: 'health', state: data.healthStatus === 'unknown' ? 'unknown' : 'known', labelEn: 'Health Status', labelTa: 'உடல்நிலை', weight: 15 },
    { key: 'vax', state: data.vaccinationStatus === 'unknown' ? 'unknown' : 'known', labelEn: 'Vaccination Records', labelTa: 'தடுப்பூசி பதிவு', weight: 10 },
    { key: 'feed', state: data.dailyFeedKg.state, labelEn: 'Feed Consumption', labelTa: 'தீவன அளவு', weight: 10 },
    { key: 'feedCost', state: data.dailyFeedCostRs.state, labelEn: 'Feed Cost', labelTa: 'தீவன செலவு', weight: 10 },
    { key: 'marketVal', state: data.estimatedMarketValueRs.state, labelEn: 'Market Value', labelTa: 'சந்தை மதிப்பு', weight: 5 },
  ];

  let totalWeight = 0;
  let earnedScore = 0;

  for (const f of fieldChecks) {
    totalWeight += f.weight;
    if (f.state === 'known') {
      knownFields.push({ key: f.key, labelEn: f.labelEn, labelTa: f.labelTa });
      earnedScore += f.weight;
    } else if (f.state === 'estimated') {
      estimatedFields.push({ key: f.key, labelEn: f.labelEn, labelTa: f.labelTa });
      earnedScore += f.weight * 0.55;
    } else {
      unknownFields.push({ key: f.key, labelEn: f.labelEn, labelTa: f.labelTa });
      earnedScore += 0;
    }
  }

  const score = Math.round((earnedScore / totalWeight) * 100);
  let level: ConfidenceLevel = 'LOW';
  if (score >= 75) level = 'HIGH';
  else if (score >= 45) level = 'MEDIUM';

  let warningMessage: { en: string; ta: string } | undefined;
  if (unknownFields.length > 0 || estimatedFields.length > 1) {
    warningMessage = {
      en: `Data Confidence is ${level}. ${unknownFields.length} attributes are unknown and ${estimatedFields.length} are estimated. Missing records reduce recommendation certainty.`,
      ta: `தரவு நம்பகத்தன்மை: ${level === 'HIGH' ? 'அதிகம்' : level === 'MEDIUM' ? 'நடுத்தரம்' : 'குறைவு'}. ${unknownFields.length} தகவல்கள் தெரியாது என்றும், ${estimatedFields.length} தகவல்கள் தோராயமாகவும் உள்ளன.`,
    };
  }

  return {
    level,
    score,
    knownFields,
    estimatedFields,
    unknownFields,
    warningMessage,
  };
}

/**
 * Intelligent Decision & Recommendation Engine
 */
export function analyzeCattle(data: AnimalInputData): DecisionResult {
  const dataConfidence = calculateDataConfidence(data);

  // Financial calculations
  const milkLiters = data.dailyMilkLiters.state === 'unknown' ? 0 : data.dailyMilkLiters.value;
  const milkPrice = data.dailyMilkPricePerLiter?.value || 50;
  const feedCostDaily = data.dailyFeedCostRs.state === 'unknown' ? 100 : data.dailyFeedCostRs.value;
  const vetCostDaily = (data.medicalExpensesMonth?.value || 0) / 30;

  const dailyRevenueRs = Math.round(milkLiters * milkPrice);
  const dailyNetProfitRs = Math.round(dailyRevenueRs - feedCostDaily - vetCostDaily);
  const monthlyProjectedNetRs = Math.round(dailyNetProfitRs * 30);

  const age = data.ageYears.value;
  const bodyScore = data.bodyScore?.value || 3.0;
  const health = data.healthStatus;
  const trend = data.productivityTrend;
  const purpose = data.purpose;
  const recentProblems = data.recentHealthProblems || '';

  let decision: DecisionType = 'MONITOR_CLOSELY';
  const reasons: { en: string; ta: string }[] = [];
  const actions: ActionItem[] = [];
  const productRecs: ProductRecommendation[] = [];

  // 1. Check for BREEDING CANDIDATE
  const isHighBreedingMerit =
    purpose === 'breeding' ||
    (age <= 6 && bodyScore >= 3.5 && (data.gender === 'male' || (purpose !== 'dairy' && data.estimatedMarketValueRs.value >= 60000))) ||
    (data.gender === 'male' && bodyScore >= 3.5);

  // 2. Check for CONSIDER SALE
  const isSaleCandidate =
    (age >= 8 && milkLiters <= 1.5 && trend === 'decreasing' && dailyNetProfitRs < 0) ||
    (dailyNetProfitRs <= -35 && milkLiters <= 2.0) ||
    (dailyNetProfitRs < 0 && trend === 'decreasing' && milkLiters <= 1.8 && age >= 6) ||
    (health === 'poor' && dailyNetProfitRs < 0 && (data.medicalExpensesMonth?.value || 0) >= 1000) ||
    (bodyScore < 2.5 && dailyNetProfitRs < -10 && milkLiters <= 1.5 && (data.calvingCount?.value || 0) >= 4);

  // 3. Check for CONTINUE DAIRY PRODUCTION
  const isHealthyDairy =
    (purpose === 'dairy' || purpose === 'other') &&
    milkLiters >= 2.5 &&
    trend !== 'decreasing' &&
    health !== 'poor' &&
    dailyNetProfitRs >= 15 &&
    bodyScore >= 2.8;

  // Decision assignment logic
  if (isSaleCandidate) {
    decision = 'CONSIDER_SALE';
    reasons.push(
      {
        en: `High recurring cost with negative net daily return (₹${dailyNetProfitRs}/day)`,
        ta: `தீவன மற்றும் மருத்துவ செலவு அதிகமாகி தினசரி நஷ்டம் (₹${Math.abs(dailyNetProfitRs)}/நாள்) ஏற்படுகிறது`,
      },
      {
        en: `Low milk productivity (${milkLiters} L/day) in continuous downward trajectory`,
        ta: `பால் உற்பத்தி மிகவும் குறைந்து (${milkLiters} லிட்டர்/நாள்) தொடர்ந்து சரியும் போக்கில் உள்ளது`,
      },
      {
        en: `Advance parity/age (${age} yrs) with reduced physiological recovery capacity`,
        ta: `அதிக வயது (${age} ஆண்டுகள்) மற்றும் பலவீனமான உடல்நிலை`,
      }
    );

    actions.push(
      {
        id: 'act-sale-1',
        stepNumber: 1,
        title: {
          en: 'Obtain Local Kangeyam Market Valuation',
          ta: 'உள்ளூர் சந்தை மதிப்பீட்டை சரிபார்க்கவும்',
        },
        description: {
          en: 'Assess current livestock fair prices (e.g. Anthiyur / Kangeyam shandy) before deciding on salvage or exchange.',
          ta: 'அந்தியூர் அல்லது காங்கேயம் சந்தை நிலவரப்படி மாட்டின் தற்போதைய சந்தை மதிப்பை அறியவும்.',
        },
        priority: 'high',
        category: 'economics',
      },
      {
        id: 'act-sale-2',
        stepNumber: 2,
        title: {
          en: 'Explore Breed Conservation Exchange or Dry Cow Foster',
          ta: 'நாட்டு மாடு பாதுகாப்பு மையங்கள் அல்லது உழவு பயன்பாட்டுக்கு மாற்றவும்',
        },
        description: {
          en: 'For purebred Kangeyam cattle, consider transfer to native breed conservation farms or natural farming gaushalas rather than distress liquidation.',
          ta: 'தூய காங்கேயம் மாடுகளை நஷ்டத்திற்கு விற்காமல், இயற்கை விவசாயம் அல்லது கோசாலைகளுக்கு மாற்று வழியை பரிசீலிக்கவும்.',
        },
        priority: 'medium',
        category: 'management',
      },
      {
        id: 'act-sale-3',
        stepNumber: 3,
        title: {
          en: 'Reallocate Feed Budget to High-Yield Cattle',
          ta: 'தீவன செலவை நல்ல உற்பத்தி தரும் மாடுகளுக்கு மாற்றவும்',
        },
        description: {
          en: 'Shift premium green fodder and oil cakes towards productive young stock to optimize farm profit.',
          ta: 'வீணாகும் அடர்தீவன செலவை குறைத்து, நல்ல கறவை மாடுகளுக்கு தீவனத்தை ஒதுக்கவும்.',
        },
        priority: 'high',
        category: 'nutrition',
      }
    );
  } else if (isHighBreedingMerit && (purpose === 'breeding' || milkLiters < 3.5 || data.gender === 'male')) {
    decision = 'BREEDING_CANDIDATE';
    reasons.push(
      {
        en: `Superior Kangeyam phenotypic traits, strong body condition (${bodyScore}/5), and pedigree value`,
        ta: `சிறந்த காங்கேயம் உடற்கட்டமைப்பு (${bodyScore}/5), தூய இன அழகு மற்றும் உயர் மரபணு மதிப்பு`,
      },
      {
        en: `High genetic seedstock and calf market valuation (₹${data.estimatedMarketValueRs.value.toLocaleString('en-IN')})`,
        ta: `இனவிருத்தி கிடாரி மற்றும் கன்றுகளின் சந்தை மதிப்பு (₹${data.estimatedMarketValueRs.value.toLocaleString('en-IN')}) மிக அதிகம்`,
      },
      {
        en: `Resilient indigenous adaptation suitable for lineage preservation and organic farming`,
        ta: `வறட்சியைத் தாங்கி, நோய் எதிர்ப்புத் திறனுடன் வாழும் பூர்வீக இனப்பெருக்க தகுதி`,
      }
    );

    actions.push(
      {
        id: 'act-breed-1',
        stepNumber: 1,
        title: {
          en: 'Implement Flushing Nutrition & Mineral Supplementation',
          ta: 'இனப்பெருக்க ஊட்டச்சத்து மற்றும் தாது உப்பு அளிக்கவும்',
        },
        description: {
          en: 'Provide 40g TANUVAS mineral mixture daily to stimulate regular ovarian follicle growth and timely estrus cycling.',
          ta: 'சினைப்பருவம் சீராக வர நாள் ஒன்றுக்கு 40 கிராம் தனுவாஸ் தாது உப்பு மற்றும் முளைகட்டிய தானியம் தரவும்.',
        },
        priority: 'high',
        category: 'nutrition',
      },
      {
        id: 'act-breed-2',
        stepNumber: 2,
        title: {
          en: 'Maintain Accurate Estrus & Insemination Log',
          ta: 'பருவ சுழற்சி மற்றும் சினை காலத்தை துல்லியமாக பதிவு செய்க',
        },
        description: {
          en: 'Observe heat signs every 21 days (mucous discharge, bellowing, mounting) and arrange natural service with a certified Kangeyam stud bull.',
          ta: '21 நாட்களுக்கு ஒருமுறை வரும் சினை அறிகுறிகளை குறித்து வைத்து, தரமான காங்கேயம் காளையிடம் இணைக்கவும்.',
        },
        priority: 'high',
        category: 'breeding',
      },
      {
        id: 'act-breed-3',
        stepNumber: 3,
        title: {
          en: 'Preventive Parasite Deworming & Vaccination',
          ta: 'குடற்புழு நீக்கம் மற்றும் தடுப்பூசிகளை முடிக்கவும்',
        },
        description: {
          en: 'Ensure FMD (Foot and Mouth) and HS pre-monsoon vaccines are up to date before mating.',
          ta: 'சினை பிடிப்பதற்கு முன்பாக கோமாரி மற்றும் அடைப்பான் தடுப்பூசிகளை முடித்திருக்க வேண்டும்.',
        },
        priority: 'medium',
        category: 'health',
      }
    );

    // Products
    productRecs.push(VERIFIED_PRODUCTS[0]); // Mineral mix
    productRecs.push(VERIFIED_PRODUCTS[3]); // Dewormer
  } else if (isHealthyDairy) {
    decision = 'CONTINUE_DAIRY';
    reasons.push(
      {
        en: `Consistent healthy milk production (${milkLiters} L/day) with favorable profit margin (+₹${dailyNetProfitRs}/day)`,
        ta: `சீரான பால் உற்பத்தி (${milkLiters} லிட்டர்/நாள்) மற்றும் லாபகரமான தினசரி நிகர வருமானம் (+₹${dailyNetProfitRs}/நாள்)`,
      },
      {
        en: `Good body score (${bodyScore}/5) and active health condition with up-to-date management`,
        ta: `நல்ல உடல் ஆரோக்கியம் (${bodyScore}/5) மற்றும் சுறுசுறுப்பான நிலை`,
      },
      {
        en: `Stable feed conversion efficiency on native forage and concentrates`,
        ta: `தீவனத்தை திறமையாக பாலாக மாற்றும் நல்ல செரிமான திறன்`,
      }
    );

    actions.push(
      {
        id: 'act-dairy-1',
        stepNumber: 1,
        title: {
          en: 'Maintain Lactation Ration & Bypass Energy',
          ta: 'கறவை தீவன சமநிலையை தொடரவும்',
        },
        description: {
          en: 'Continue balanced green fodder (12-15 kg Co-5/Lucerne) and 1.5kg concentrate mash with 35g mineral mixture.',
          ta: '12-15 கிலோ பசுந்தீவனம், 1.5 கிலோ அடர்தீவனம் மற்றும் 35 கிராம் தாது உப்பை தொடர்ந்து அளிக்கவும்.',
        },
        priority: 'high',
        category: 'nutrition',
      },
      {
        id: 'act-dairy-2',
        stepNumber: 2,
        title: {
          en: 'Track Weekly Butterfat & Milk Yield Records',
          ta: 'வாராந்திர பால் அளவு மற்றும் கொழுப்புச் சத்தை பதிவு செய்க',
        },
        description: {
          en: 'Log morning and evening milk outputs to detect early lactation dips or heat onset.',
          ta: 'காலை மற்றும் மாலை பால் அளவை தொடர்ந்து பதிவேட்டில் குறித்து வைக்கவும்.',
        },
        priority: 'medium',
        category: 'management',
      },
      {
        id: 'act-dairy-3',
        stepNumber: 3,
        title: {
          en: 'Ensure Clean Udder Hygiene & Post-Milking Teat Dip',
          ta: 'மடி சுகாதாரம் மற்றும் பால் கறவை பாதுகாப்பு',
        },
        description: {
          en: 'Wash udder with clean lukewarm water and maintain dry bedding to prevent mastitis.',
          ta: 'மடி நோய் வராமல் தடுக்க பால் கறந்த பின் மடியை சுத்தமாக பராமரிக்கவும்.',
        },
        priority: 'medium',
        category: 'health',
      }
    );

    productRecs.push(VERIFIED_PRODUCTS[0]); // Mineral mix
    productRecs.push(VERIFIED_PRODUCTS[1]); // Bypass fat
    productRecs.push(VERIFIED_PRODUCTS[4]); // Silage
  } else {
    // Default / Diagnostic: MONITOR CLOSELY
    decision = 'MONITOR_CLOSELY';

    if (trend === 'decreasing') {
      reasons.push({
        en: `Milk productivity has declined (currently ${milkLiters} L/day, down from peak)`,
        ta: `பால் உற்பத்தி குறைந்துள்ளது (தற்போது ${milkLiters} லிட்டர்/நாள் மட்டுமே)`,
      });
    } else {
      reasons.push({
        en: `Productivity trend requires observation due to lactation phase and environmental factors`,
        ta: `பால் உற்பத்தி நிலையை அடுத்த சில நாட்களுக்கு உன்னிப்பாக கவனிக்க வேண்டும்`,
      });
    }

    if (data.dailyFeedCostRs.state === 'estimated' || data.dailyFeedKg.state === 'estimated') {
      reasons.push({
        en: 'Feed consumption and cost information is estimated rather than measured',
        ta: 'தீவன அளவு மற்றும் செலவு தகவல்கள் தோராயமாக மட்டுமே உள்ளன',
      });
    }

    if (recentProblems && recentProblems !== 'None') {
      reasons.push({
        en: `Recent health/management concern reported: "${recentProblems}"`,
        ta: `சமீபத்திய உடல்நலக்குறைவு: "${recentProblems}"`,
      });
    } else if (health === 'moderate' || health === 'unknown') {
      reasons.push({
        en: 'Health history is incomplete or requires closer observation',
        ta: 'உடல்நல வரலாறு முழுமையாக இல்லை அல்லது கூடுதல் கவனிப்பு தேவைப்படுகிறது',
      });
    }

    if (dailyNetProfitRs <= 30) {
      reasons.push({
        en: `Current economic margin is constrained (approx. ₹${dailyNetProfitRs}/day)`,
        ta: `தற்போதைய தினசரி நிகர லாபம் குறைவாக உள்ளது (தோராயமாக ₹${dailyNetProfitRs}/நாள்)`,
      });
    }

    actions.push(
      {
        id: 'act-mon-1',
        stepNumber: 1,
        title: {
          en: 'Review & Optimize Daily Feeding Ration',
          ta: 'தினசரி தீவன அளவை சரிபார்த்து முறைப்படுத்தவும்',
        },
        description: {
          en: 'Ensure high quality dry sorghum stover, at least 10 kg chopped green fodder, and 30-40g mineral mixture daily.',
          ta: 'உலர் சோளத்தட்டுடன் குறைந்தது 10 கிலோ பசுந்தீவனம் மற்றும் 30-40 கிராம் தாது உப்பை உணவில் சேர்க்கவும்.',
        },
        priority: 'high',
        category: 'nutrition',
      },
      {
        id: 'act-mon-2',
        stepNumber: 2,
        title: {
          en: 'Ensure Continuous Fresh Cool Water Availability',
          ta: 'சுத்தமான குடிநீர் 24 மணி நேரமும் கிடைப்பதை உறுதி செய்க',
        },
        description: {
          en: 'Kangeyam cows require 45-60 Liters of water daily. Inadequate water is the #1 silent cause of sudden milk drop.',
          ta: 'மாட்டுக்கு நாள் ஒன்றுக்கு 45-60 லிட்டர் தண்ணீர் தேவை. தண்ணீர் குறைவு பால் குறைவிற்கு முக்கிய காரணமாகும்.',
        },
        priority: 'high',
        category: 'management',
      },
      {
        id: 'act-mon-3',
        stepNumber: 3,
        title: {
          en: 'Monitor Daily Morning & Evening Milk Yield for 7-10 Days',
          ta: 'அடுத்த 7 முதல் 10 நாட்களுக்கு பால் அளவை துல்லியமாக குறித்து வைக்கவும்',
        },
        description: {
          en: 'Track exact liters to establish whether production stabilizes after ration correction.',
          ta: 'தீவன மாற்றத்திற்குப் பிறகு பால் அளவு சீராகிறதா என்பதை கவனமாக குறித்து வாருங்கள்.',
        },
        priority: 'medium',
        category: 'management',
      },
      {
        id: 'act-mon-4',
        stepNumber: 4,
        title: {
          en: 'Update Vaccination & Deworming Verification',
          ta: 'குடற்புழு நீக்கம் மற்றும் தடுப்பூசி விபரங்களை புதுப்பிக்கவும்',
        },
        description: {
          en: 'If deworming has not been done within the last 90 days, administer anthelmintics per vet advice.',
          ta: 'கடந்த 3 மாதங்களில் குடற்புழு நீக்கம் செய்யப்படவில்லை எனில் உடனே மருத்துவரிடம் ஆலோசனை பெற்று மருந்து தரவும்.',
        },
        priority: 'medium',
        category: 'health',
      },
      {
        id: 'act-mon-5',
        stepNumber: 5,
        title: {
          en: 'Consult a Qualified Veterinarian if Decline Persists',
          ta: 'பால் குறைவு தொடர்ந்தால் கால்நடை மருத்துவரை உடனே அணுகவும்',
        },
        description: {
          en: 'If milk yield does not recover within 5-7 days or if fever/mastitis develops, seek clinical evaluation immediately.',
          ta: '5-7 நாட்களுக்குள் பால் அளவு கூடவில்லை என்றாலோ, மடிவீக்கம்/காய்ச்சல் இருந்தாலோ மருத்துவரை நேரில் அணுகவும்.',
        },
        priority: 'high',
        category: 'health',
      }
    );

    // Products for Monitor closely
    productRecs.push(VERIFIED_PRODUCTS[0]); // Mineral mixture
    productRecs.push(VERIFIED_PRODUCTS[2]); // Rumen buffer
    productRecs.push(VERIFIED_PRODUCTS[4]); // Silage
  }

  // Check Edge Cases and Conflicting Data
  const edgeCasesDetected: {
    id: string;
    type: 'warning' | 'alert' | 'info';
    title: { en: string; ta: string };
    message: { en: string; ta: string };
  }[] = [];

  let dataConflictDetected: {
    detected: boolean;
    title: { en: string; ta: string };
    message: { en: string; ta: string };
  } | undefined;

  // Edge Case 1: High milk production + high maintenance cost
  const isHighMilkHighCost = milkLiters >= 3.8 && (dailyNetProfitRs <= 15 || (feedCostDaily + vetCostDaily) / (dailyRevenueRs || 1) >= 0.85);
  if (isHighMilkHighCost) {
    edgeCasesDetected.push({
      id: 'edge-case-1',
      type: 'warning',
      title: {
        en: 'High Milk with High Maintenance Burden',
        ta: 'அதிக பால் உற்பத்தி ஆனால் அதிக பராமரிப்பு செலவு',
      },
      message: {
        en: `Despite a solid milk yield of ${milkLiters} L/day, high daily feed/medical overhead (₹${Math.round(feedCostDaily + vetCostDaily)}/day) leaves a thin net profit of only ₹${dailyNetProfitRs}/day. High milk volume does not guarantee high profitability.`,
        ta: `நாள் ஒன்றுக்கு ${milkLiters} லிட்டர் பால் தந்தாலும், தீவன மற்றும் மருத்துவ செலவு (₹${Math.round(feedCostDaily + vetCostDaily)}/நாள்) அதிகமாக இருப்பதால் நிகர லாபம் வெறும் ₹${dailyNetProfitRs}/நாள் மட்டுமே.`,
      },
    });
  }

  // Edge Case 2: Vaccination Overdue
  if (data.vaccinationStatus === 'unvaccinated' || data.vaccinationStatus === 'partially_vaccinated') {
    edgeCasesDetected.push({
      id: 'edge-case-2',
      type: 'alert',
      title: {
        en: '⚠ Vaccination Attention Required',
        ta: '⚠ தடுப்பூசி முன்னுரிமை தேவை',
      },
      message: {
        en: 'Mandatory vaccinations (FMD, Black Quarter, Anthrax) are incomplete or overdue. Immunization must be scheduled regardless of current milk productivity.',
        ta: 'கோமாரி மற்றும் அடைப்பான் தடுப்பூசிகள் நிலுவையில் உள்ளன. பால் உற்பத்தியை பொருட்படுத்தாமல் தடுப்பூசி உடனடியாக போடப்பட வேண்டும்.',
      },
    });

    // Ensure vaccination action is included if not already
    if (!actions.some((a) => a.id.includes('vax') || a.id.includes('vaccination'))) {
      actions.unshift({
        id: 'act-vax-alert',
        stepNumber: 0,
        title: {
          en: 'Schedule Immediate Livestock Vaccination',
          ta: 'உடனடியாக கால்நடை தடுப்பூசி போட ஏற்பாடு செய்க',
        },
        description: {
          en: 'Contact the local government veterinary dispensary to complete pending FMD and hemorrhagic septicemia boosters.',
          ta: 'அருகிலுள்ள அரசு கால்நடை மருந்தகத்தை அணுகி நிலுவையிலுள்ள கோமாரி தடுப்பூசியை உடனே போடுங்கள்.',
        },
        priority: 'high',
        category: 'health',
      });
    }
  }

  // Edge Case 3: Declining Milk Productivity
  if (trend === 'decreasing' || (data.historicalPeakMilkLiters?.value && milkLiters <= data.historicalPeakMilkLiters.value * 0.7)) {
    edgeCasesDetected.push({
      id: 'edge-case-3',
      type: 'warning',
      title: {
        en: 'Declining Milk Productivity Trend Detected',
        ta: 'பால் உற்பத்தி குறைந்து வரும் போக்கு',
      },
      message: {
        en: `Lactation trajectory shows consistent decline down to ${milkLiters} L/day (peak was ${data.historicalPeakMilkLiters?.value || 5.0} L/day). Decision is based on trend velocity rather than a single day yield.`,
        ta: `பால் உற்பத்தி படிப்படியாக குறைந்து வருகிறது (${milkLiters} லி/நாள்). முடிவு ஒரு நாள் பதிவை மட்டும் சார்ந்திராமல் முழு போக்கின் அடிப்படையில் கணக்கிடப்பட்டுள்ளது.`,
      },
    });
  }

  // Edge Case 4: Missing Health Records
  if (health === 'unknown' || (data.medicalExpensesMonth?.state === 'unknown' && !recentProblems)) {
    edgeCasesDetected.push({
      id: 'edge-case-4',
      type: 'info',
      title: {
        en: 'Health History: UNKNOWN',
        ta: 'உடல்நல வரலாறு: தெரியவில்லை',
      },
      message: {
        en: 'Health records and veterinary history are missing. The animal cannot be assumed healthy, resulting in a reduced data confidence score.',
        ta: 'உடல்நல ஆவணங்கள் கிடைக்கவில்லை. மாடு ஆரோக்கியமாக இருப்பதாக கருத முடியாது என்பதால் முடிவின் நம்பகத்தன்மை குறைக்கப்பட்டுள்ளது.',
      },
    });
  }

  // Edge Case 5: Young animal + limited historical data
  const isYoungAnimalLimited = age <= 3.2 && (data.calvingCount?.value || 0) <= 1;
  if (isYoungAnimalLimited) {
    edgeCasesDetected.push({
      id: 'edge-case-5',
      type: 'info',
      title: {
        en: 'Young Animal with Limited Historical Records',
        ta: 'குறைந்த பதிவுகள் கொண்ட இளம் மாடு',
      },
      message: {
        en: 'Limited historical lactation records prevent reliable long-term productivity assessment. Cautious monitoring recommended.',
        ta: 'இளம் மாடு என்பதால் நீண்டகால உற்பத்தி பதிவுகள் குறைவாக உள்ளன. எனவே உன்னிப்பாக கவனிக்க பரிந்துரைக்கப்படுகிறது.',
      },
    });
  }

  // Edge Case 6: Sudden Productivity Decrease
  const isSuddenDrop = (data.historicalPeakMilkLiters?.value && data.historicalPeakMilkLiters.value >= 4.0 && (data.historicalPeakMilkLiters.value - milkLiters) >= 1.8) ||
    recentProblems.toLowerCase().includes('sudden') || recentProblems.toLowerCase().includes('drop');
  if (isSuddenDrop) {
    edgeCasesDetected.push({
      id: 'edge-case-6',
      type: 'alert',
      title: {
        en: '⚠ Sudden Productivity Decrease Detected',
        ta: '⚠ திடீர் பால் குறைவு கண்டறியப்பட்டுள்ளது',
      },
      message: {
        en: 'Sharp decrease in milk output detected. Immediately verify water access (45-60L/day), check for subclinical mastitis, and examine fodder freshness.',
        ta: 'பால் திடீரென குறைந்துள்ளது. உடனடியாக தண்ணீர் அளவு (45-60 லிட்டர்), மடிவீக்க அறிகுறிகள் மற்றும் தீவன தூய்மையை பரிசோதிக்கவும்.',
      },
    });
  }

  // Edge Case 7: Changing Market Value & Capital Return
  const currentMarketVal = data.estimatedMarketValueRs?.value || 60000;
  const annualReturnOnAsset = currentMarketVal > 0 ? Math.round(((monthlyProjectedNetRs * 12) / currentMarketVal) * 100) : 0;
  if (data.estimatedMarketValueRs.state !== 'unknown') {
    edgeCasesDetected.push({
      id: 'edge-case-7',
      type: 'info',
      title: {
        en: 'Dynamic Market Asset Evaluation',
        ta: 'சந்தை மதிப்பு மற்றும் வருவாய் விகிதம்',
      },
      message: {
        en: `Current live market valuation is ₹${currentMarketVal.toLocaleString('en-IN')}. Annualized asset cashflow return is ${annualReturnOnAsset}%. Economic model updates dynamically with changing market value.`,
        ta: `தற்போதைய சந்தை மதிப்பு ₹${currentMarketVal.toLocaleString('en-IN')}. ஆண்டு முதலீட்டு வருவாய் விகிதம் ${annualReturnOnAsset}%.`,
      },
    });
  }

  // Conflicting Data Detection
  const hasTrendConflict = trend === 'increasing' && data.historicalPeakMilkLiters?.value && data.historicalPeakMilkLiters.value > (milkLiters * 1.35);
  const hasAgeCalvingConflict = age < 2.5 && (data.calvingCount?.value || 0) >= 2;
  const hasHealthExpenseConflict = health === 'excellent' && (data.medicalExpensesMonth?.value || 0) >= 1200;

  if (hasTrendConflict || hasAgeCalvingConflict || hasHealthExpenseConflict) {
    let conflictEn = '';
    let conflictTa = '';

    if (hasTrendConflict) {
      conflictEn = `Productivity trend is marked as "Increasing", but current milk yield (${milkLiters}L) is significantly lower than peak recorded milk (${data.historicalPeakMilkLiters?.value}L).`;
      conflictTa = `உற்பத்தி போக்கு "அதிகரிக்கிறது" எனக் குறிப்பிடப்பட்டுள்ளது, ஆனால் தற்போதைய பால் அளவு (${milkLiters} லி) அதிகபட்ச பதிவை விட (${data.historicalPeakMilkLiters?.value} லி) குறைவாக உள்ளது.`;
    } else if (hasAgeCalvingConflict) {
      conflictEn = `Age is entered as ${age} years, which contradicts having ${data.calvingCount?.value} calvings (indigenous cattle first calve around 3-4 years).`;
      conflictTa = `வயது ${age} ஆண்டுகள் என உள்ளது, ஆனால் ஈத்து எண்ணிக்கை ${data.calvingCount?.value} என்பது முரணாக உள்ளது.`;
    } else if (hasHealthExpenseConflict) {
      conflictEn = `Health is listed as "Excellent", but monthly veterinary expenses are high (₹${data.medicalExpensesMonth?.value}/month).`;
      conflictTa = `உடல்நிலை "மிக நன்று" எனக் கூறப்பட்டுள்ளது, ஆனால் மாதாந்திர மருத்துவ செலவு அதிகமாக உள்ளது (₹${data.medicalExpensesMonth?.value}).`;
    }

    dataConflictDetected = {
      detected: true,
      title: {
        en: '⚠ Data Conflict Detected',
        ta: '⚠ முரண்பட்ட தகவல்கள் கண்டறியப்பட்டுள்ளன',
      },
      message: {
        en: `${conflictEn} Please review and verify the inputs.`,
        ta: `${conflictTa} தயவுசெய்து தகவல்களை சரிபார்க்கவும்.`,
      },
    };
  }

  // Renumber action step numbers cleanly
  actions.forEach((act, idx) => {
    act.stepNumber = idx + 1;
  });

  // Generate indicator statuses
  let healthInd: 'good' | 'moderate' | 'poor' = 'good';
  if (health === 'poor' || (data.medicalExpensesMonth?.value || 0) > 1000) healthInd = 'poor';
  else if (health === 'moderate' || recentProblems.length > 5) healthInd = 'moderate';

  let prodInd: 'increasing' | 'stable' | 'decreasing' | 'unknown' = trend;
  let econInd: 'profit' | 'breakeven' | 'loss' = 'breakeven';
  if (dailyNetProfitRs >= 25) econInd = 'profit';
  else if (dailyNetProfitRs < 0) econInd = 'loss';

  return {
    decision,
    confidence: dataConfidence.level,
    overallScore: dataConfidence.score,
    indicators: {
      health: healthInd,
      productivity: prodInd,
      economics: econInd,
      dataQuality: dataConfidence.level,
    },
    financials: {
      dailyRevenueRs,
      dailyFeedCostRs: feedCostDaily,
      dailyNetProfitRs,
      monthlyProjectedNetRs,
    },
    reasons,
    actions,
    productRecommendations: productRecs,
    dataConfidence,
    edgeCasesDetected,
    dataConflictDetected,
    generatedAt: new Date().toISOString(),
  };
}

export interface SimulationOutcome {
  baseResult: DecisionResult;
  simulatedResult: DecisionResult;
  simulatedData: AnimalInputData;
  deltaNetDailyRs: number;
  deltaMonthlyRs: number;
  decisionChanged: boolean;
  breakevenMilkLiters: number;
  feedToRevenuePercent: number;
  summaryInsight: {
    en: string;
    ta: string;
  };
  farmerActionTakeaway: {
    en: string;
    ta: string;
  };
}

/**
 * What-If Simulator: recalculates decision based on percentage modifications
 */
export function simulateWhatIf(
  originalData: AnimalInputData,
  modifiers: {
    milkPercentChange: number; // e.g. -40 to +40
    feedCostPercentChange: number; // e.g. -30 to +50
    medicalExpenseChangeRs: number; // e.g. -500 to +1500
  }
): SimulationOutcome {
  const baseResult = analyzeCattle(originalData);

  const baseMilk = originalData.dailyMilkLiters.value || 0;
  const newMilk = Math.max(0, Number((baseMilk * (1 + modifiers.milkPercentChange / 100)).toFixed(1)));

  const baseFeedCost = originalData.dailyFeedCostRs.value || 100;
  const newFeedCost = Math.max(20, Math.round(baseFeedCost * (1 + modifiers.feedCostPercentChange / 100)));

  const baseMed = originalData.medicalExpensesMonth?.value || 0;
  const newMed = Math.max(0, Math.round(baseMed + modifiers.medicalExpenseChangeRs));

  const milkPrice = originalData.dailyMilkPricePerLiter?.value || 50;

  let newTrend = originalData.productivityTrend;
  if (modifiers.milkPercentChange <= -12) newTrend = 'decreasing';
  else if (modifiers.milkPercentChange >= 10) newTrend = 'increasing';
  else if (modifiers.milkPercentChange > 0 && originalData.productivityTrend === 'decreasing') newTrend = 'stable';

  let newHealth = originalData.healthStatus;
  if (modifiers.medicalExpenseChangeRs >= 800) newHealth = 'moderate';
  if (modifiers.medicalExpenseChangeRs >= 1200) newHealth = 'poor';
  if (modifiers.medicalExpenseChangeRs <= -200 && (newHealth === 'moderate' || newHealth === 'poor')) newHealth = 'good';

  const simulatedData: AnimalInputData = {
    ...originalData,
    dailyMilkLiters: { ...originalData.dailyMilkLiters, value: newMilk, state: 'known' },
    dailyFeedCostRs: { ...originalData.dailyFeedCostRs, value: newFeedCost, state: 'known' },
    medicalExpensesMonth: {
      value: newMed,
      state: 'known',
      unit: '₹',
    },
    healthStatus: newHealth,
    productivityTrend: newTrend,
  };

  const simulatedResult = analyzeCattle(simulatedData);
  const deltaNetDailyRs = simulatedResult.financials.dailyNetProfitRs - baseResult.financials.dailyNetProfitRs;
  const deltaMonthlyRs = deltaNetDailyRs * 30;
  const decisionChanged = baseResult.decision !== simulatedResult.decision;

  // Breakeven milk calculation: (Daily Feed + Daily Vet) / Milk Price
  const dailyVetSim = newMed / 30;
  const totalDailyCost = newFeedCost + dailyVetSim;
  const breakevenMilkLiters = Number((totalDailyCost / (milkPrice || 50)).toFixed(1));

  const simulatedDailyRevenue = Math.round(newMilk * milkPrice);
  const feedToRevenuePercent = simulatedDailyRevenue > 0
    ? Math.round((newFeedCost / simulatedDailyRevenue) * 100)
    : 100;

  // Dynamic Insight Generation
  let insightEn = '';
  let insightTa = '';
  let actionEn = '';
  let actionTa = '';

  if (decisionChanged) {
    insightEn = `⚡ Critical Threshold Shift: Recommendation changes from "${baseResult.decision.replace('_', ' ')}" to "${simulatedResult.decision.replace('_', ' ')}". Net economic swing is ${deltaNetDailyRs >= 0 ? `+₹${deltaNetDailyRs}` : `-₹${Math.abs(deltaNetDailyRs)}`}/day (₹${deltaMonthlyRs.toLocaleString('en-IN')}/mo).`;
    insightTa = `⚡ முக்கியமான முடிவு மாற்றம்: பரிந்துரை "${baseResult.decision}" என்பதிலிருந்து "${simulatedResult.decision}" என மாறியுள்ளது. மாத நிகர வருமான மாற்றம் ${deltaMonthlyRs >= 0 ? `+₹${deltaMonthlyRs.toLocaleString('en-IN')}` : `-₹${Math.abs(deltaMonthlyRs).toLocaleString('en-IN')}`}/மாதம்.`;
  } else if (deltaNetDailyRs > 0) {
    insightEn = `📈 Positive Economic Gain: Maintaining current decision with an improved margin of +₹${deltaNetDailyRs}/day (+₹${deltaMonthlyRs.toLocaleString('en-IN')}/month). Breakeven yield is ${breakevenMilkLiters} L/day.`;
    insightTa = `📈 லாபகரமான முன்னேற்றம்: மாட்டின் முடிவு மாறாமல் தொடர்கிறது, ஆனால் தினசரி லாபம் +₹${deltaNetDailyRs}/நாள் (+₹${deltaMonthlyRs.toLocaleString('en-IN')}/மாதம்) அதிகரிக்கிறது. குறைந்தபட்ச உற்பத்தி இலக்கு: ${breakevenMilkLiters} லி/நாள்.`;
  } else if (deltaNetDailyRs < 0) {
    insightEn = `📉 Margin Contraction Alert: Retaining current category but daily margin drops by ₹${Math.abs(deltaNetDailyRs)}/day (-₹${Math.abs(deltaMonthlyRs).toLocaleString('en-IN')}/month). Feed cost accounts for ${feedToRevenuePercent}% of revenue.`;
    insightTa = `📉 செலவு அழுத்த எச்சரிக்கை: முடிவு மாறவில்லை என்றாலும் தினசரி வருமானம் ₹${Math.abs(deltaNetDailyRs)}/நாள் (-₹${Math.abs(deltaMonthlyRs).toLocaleString('en-IN')}/மாதம்) குறைகிறது. தீவன செலவு பால் வருவாயில் ${feedToRevenuePercent}% ஆக உள்ளது.`;
  } else {
    insightEn = `⚖️ Baseline Equilibrium: At current prices, this cattle generates ₹${baseResult.financials.dailyNetProfitRs}/day profit. Breakeven milk output is ${breakevenMilkLiters} L/day.`;
    insightTa = `⚖️ தற்போதைய சமநிலை நிலை: இந்த மாடு தினசரி ₹${baseResult.financials.dailyNetProfitRs}/நாள் நிகர லாபம் தருகிறது. நஷ்டமில்லாத குறைந்தபட்ச பால் அளவு ${breakevenMilkLiters} லி/நாள்.`;
  }

  // Farmer specific actionable takeaway
  if (simulatedResult.financials.dailyNetProfitRs < 0) {
    actionEn = `Immediate Action: Cattle is currently operating at a daily deficit of ₹${Math.abs(simulatedResult.financials.dailyNetProfitRs)}/day. Substitute high-cost commercial feed with farm-grown green fodder (Co-5/Lucerne) or examine if salvage sale/gaushala placement is warranted.`;
    actionTa = `உடனடி நடவடிக்கை: மாடு தினசரி ₹${Math.abs(simulatedResult.financials.dailyNetProfitRs)} நஷ்டத்தில் உள்ளது. விலையுயர்ந்த அடர்தீவனத்தை குறைத்து பண்ணை பசுந்தீவனத்தை அதிகரிக்கவும் அல்லது விற்பனை/மாற்றுப் பயன்பாட்டை பரிசீலிக்கவும்.`;
  } else if (newMilk < breakevenMilkLiters + 0.5) {
    actionEn = `Caution: Milk yield (${newMilk} L) is dangerously close to the breakeven threshold (${breakevenMilkLiters} L). A small dip in yield or a ₹10 increase in feed will push operations into loss. Supplement with 40g mineral mixture and rumen buffers.`;
    actionTa = `எச்சரிக்கை: தற்போதைய பால் அளவு (${newMilk} லி) நஷ்ட வரம்பிற்கு (${breakevenMilkLiters} லி) மிக அருகில் உள்ளது. தீவன சமநிலையை உடனே சரிசெய்து 40 கிராம் தாது உப்பு தரவும்.`;
  } else {
    actionEn = `Recommended Action: Operation remains commercially sound with ₹${simulatedResult.financials.dailyNetProfitRs}/day net margin. Continue standard lactation ration (12-15 kg green fodder + bypass fats) to sustain production longevity.`;
    actionTa = `பரிந்துரைக்கப்பட்ட நடவடிக்கை: மாடு நல்ல லாப வரம்பில் (₹${simulatedResult.financials.dailyNetProfitRs}/நாள்) உள்ளது. தொடர்ந்து தரமான பசுந்தீவனம் மற்றும் பராமரிப்பை தொடரவும்.`;
  }

  return {
    baseResult,
    simulatedResult,
    simulatedData,
    deltaNetDailyRs,
    deltaMonthlyRs,
    decisionChanged,
    breakevenMilkLiters,
    feedToRevenuePercent,
    summaryInsight: {
      en: insightEn,
      ta: insightTa,
    },
    farmerActionTakeaway: {
      en: actionEn,
      ta: actionTa,
    },
  };
}
