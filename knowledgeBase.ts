import { KnowledgeArticle, ProductRecommendation } from '../types';

export const VERIFIED_PRODUCTS: ProductRecommendation[] = [
  {
    id: 'prod-mineral-tanuvas',
    category: 'nutrition',
    needCategory: {
      en: 'Essential Mineral & Micronutrient Balance',
      ta: 'அத்தியாவசிய தாது உப்பு & நுண்சத்து சமநிலை',
    },
    productName: {
      en: 'TANUVAS Area Specific Mineral Mixture for Dairy Cattle',
      ta: 'தனுவாஸ் (TANUVAS) கால்நடை தாது உப்பு கலவை',
    },
    reason: {
      en: 'Formulated specifically for Tamil Nadu soil and forage deficiencies (calcium, phosphorus, zinc, copper). Boosts milk butterfat and supports reproductive estrus cycling.',
      ta: 'தமிழக மண் மற்றும் தீவனங்களில் உள்ள சத்து குறைபாடுகளை நிவர்த்தி செய்து, பாலில் கொழுப்பு சத்து மற்றும் சினை பிடிக்கும் திறனை அதிகரிக்கிறது.',
    },
    confidence: 'HIGH',
    dosageGuidance: {
      en: '30 to 50 grams daily mixed with morning feed or grain mash.',
      ta: 'தினசரி 30 முதல் 50 கிராம் வரை காலை தீவனத்தோடு கலந்து கொடுக்கவும்.',
    },
    isVeterinaryRestricted: false,
    verifiedBrandRef: 'TANUVAS / Aavin / NDDB Certified',
  },
  {
    id: 'prod-bypass-fat',
    category: 'energy',
    needCategory: {
      en: 'Energy Deficit & Early Lactation Recovery',
      ta: 'ஆற்றல் பற்றாக்குறை & பால் கறவை தொடக்க பராமரிப்பு',
    },
    productName: {
      en: 'Rumen Bypass Fat (Fractionated Palm Fatty Acids)',
      ta: 'பைபாஸ் கொழுப்புச் சத்து (Bypass Fat)',
    },
    reason: {
      en: 'High energy density without disrupting rumen microbial fermentation. Prevents drastic body condition score loss during peak milk lactation.',
      ta: 'செரிமானத்தை பாதிக்காமல் மாட்டின் உடல் எடையை சீராக வைத்திருக்கவும், பால் உற்பத்தியை நிலைநிறுத்தவும் உதவுகிறது.',
    },
    confidence: 'HIGH',
    dosageGuidance: {
      en: '100g daily for cows yielding over 4.5 liters or showing declining body condition score.',
      ta: 'உடல் எடை குறையும் அல்லது 4.5 லிட்டருக்கு மேல் கறக்கும் மாட்டிற்கு நாள் ஒன்றுக்கு 100 கிராம்.',
    },
    isVeterinaryRestricted: false,
    verifiedBrandRef: 'NDDB Bypass Fat / Certified Animal Feed Grade',
  },
  {
    id: 'prod-rumen-buffer',
    category: 'digestion',
    needCategory: {
      en: 'Rumen Acidosis Prevention & Digestive Health',
      ta: 'செரிமான சமநிலை & அஜீரண தடுப்பு (Rumen Buffer)',
    },
    productName: {
      en: 'Sodium Bicarbonate + Live Yeast Culture Buffer',
      ta: 'சோடியம் பைகார்பனேட் + ஈஸ்ட் செரிமான கலவை',
    },
    reason: {
      en: 'Stabilizes rumen pH when feeding concentrated grains or sorghum stover, improving fiber breakdown and appetite.',
      ta: 'அடர்தீவனம் உண்ணும் போது இரைப்பை அமிலத்தன்மையை சமன்செய்து செரிமானத்தையும் பசியையும் தூண்டுகிறது.',
    },
    confidence: 'MEDIUM',
    dosageGuidance: {
      en: '50g buffer powder daily with coarse forage.',
      ta: 'தினசரி 50 கிராம் உலர் தீவனத்துடன் சேர்த்து கொடுக்கவும்.',
    },
    isVeterinaryRestricted: false,
    verifiedBrandRef: 'Standard Veterinary Grade Feed Buffer',
  },
  {
    id: 'prod-dewormer-herbal',
    category: 'health',
    needCategory: {
      en: 'Parasitic Control & Deworming',
      ta: 'குடற்புழு நீக்கம் & செரிமான மேலாண்மை',
    },
    productName: {
      en: 'Veterinary Broad-Spectrum Anthelmintic (Vet Consultation Needed)',
      ta: 'கால்நடை மருத்துவர் பரிந்துரைக்கும் குடற்புழு நீக்க மருந்து',
    },
    reason: {
      en: 'Internal parasites severely undermine feed conversion efficiency and milk yield. Mandatory before nutritional flushing.',
      ta: 'உள் ஒட்டுண்ணிகள் மாட்டின் ஊட்டச்சத்து உறிஞ்சும் திறனை குறைத்து பால் அளவை குறைக்கின்றன.',
    },
    confidence: 'HIGH',
    dosageGuidance: {
      en: 'Administer dose based on animal live body weight strictly as prescribed by a licensed veterinarian.',
      ta: 'கால்நடை மருத்துவரின் ஆலோசனைப்படி மாட்டின் உடல் எடைக்கேற்ப மட்டுமே கொடுக்க வேண்டும்.',
    },
    isVeterinaryRestricted: true,
    verifiedBrandRef: 'Veterinary Prescription Required',
  },
  {
    id: 'prod-silage-fodder',
    category: 'feed',
    needCategory: {
      en: 'Dry Season Green Roughage Substitute',
      ta: 'கோடைகால பசுந்தீவன பற்றாக்குறை மாற்று (சைலேஜ்)',
    },
    productName: {
      en: 'Baled Maize / Sorghum Silage (Enriched with Molasses & Mineral)',
      ta: 'ஊட்டச்சத்து செறிவூட்டப்பட்ட மக்காச்சோள சைலேஜ் (பதப்படுத்திய பசுந்தீவனம்)',
    },
    reason: {
      en: 'Maintains uniform milk yield and moisture intake during dry summer months when green pasture is scarce in the Kongu region.',
      ta: 'கொங்கு மண்டல கோடைகாலத்தில் பசுந்தீவன தட்டுப்பாடு ஏற்படும் போது பால் அளவு குறையாமல் காக்கிறது.',
    },
    confidence: 'HIGH',
    dosageGuidance: {
      en: '10 to 15 kg per cow daily replacing 40% of dry stover.',
      ta: 'நாள் ஒன்றுக்கு 10 முதல் 15 கிலோ வரை கொடுக்கலாம்.',
    },
    isVeterinaryRestricted: false,
    verifiedBrandRef: 'TANUVAS / Regional Dairy Cooperative Silage',
  },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kangeyam-breed-overview',
    category: 'breed',
    titleEn: 'Kangeyam Cattle Breed Standard & Characteristics',
    titleTa: 'காங்கேயம் மாட்டின் இன சிறப்பம்சங்கள் மற்றும் தரநிலைகள்',
    summaryEn: 'Native to Tiruppur, Erode, Karur, and Coimbatore districts. Renowned for drought tolerance, draught stamina, and rich A2 milk.',
    summaryTa: 'திருப்பூர், ஈரோடு, கரூர், கோவை மாவட்டங்களின் பூர்வீகம். வறட்சியை தாங்கும் தன்மை, உழைப்பு திறன் மற்றும் A2 பால் தரத்திற்கு பெயர் பெற்றது.',
    contentEn: `The Kangeyam cattle breed (Bos indicus) is an indigenous breed originating from the Kangeyam, Dharapuram, and Vellakovil tracts of Tamil Nadu. 
- Varieties: Mayilai (grey/white with dark markings on hump and neck for bulls), Kaari (black), Sevalai (reddish copper), and Murambu (brownish grey).
- Physical characteristics: Prominent hump, compact muscular body, sturdy short horns curving backwards and outwards, hard hooves.
- Milk yield: Averages 2.5 to 6.0 Liters/day with high butterfat (4.5% - 5.5%) rich in A2 beta-casein protein.
- Draught power: Highly valued for agricultural plowing, cart pulling, and organic farm biodiversity.`,
    contentTa: `காங்கேயம் இனம் தமிழ்நாட்டின் கொங்கு மண்டலத்து பூர்வீக கால்நடை இனமாகும்.
- வகைகள்: மயிலை (வெள்ளை/சாம்பல் நிறம்), காரி (கருப்பு), செவலை (செம்பழுப்பு), முரம்பு (மண் சாம்பல்).
- உடலமைப்பு: திடமான திமில், உறுதியான குளம்புகள், பிறை போன்ற பின்னோக்கிய கொம்புகள், குறுகிய உறுதியான கழுத்து.
- பால் உற்பத்தி: சராசரியாக நாள் ஒன்றுக்கு 2.5 முதல் 6 லிட்டர் வரை கறக்கும். இதில் 4.5% - 5.5% கொழுப்புச்சத்தும், A2 புரதமும் நிறைந்துள்ளது.
- சிறப்பு: குறைந்த தீவனத்திலும் அதிக உழைப்பு தரும் ஆற்றல் கொண்டவை.`,
    source: 'National Bureau of Animal Genetic Resources (NBAGR) & Kangeyam Cattle Research Station',
    tags: ['breed', 'kangeyam', 'mayilai', 'origin', 'a2 milk'],
  },
  {
    id: 'kangeyam-feeding-standards',
    category: 'feeding',
    titleEn: 'Optimal Feeding Management for Lactating Kangeyam Cows',
    titleTa: 'கறவை காங்கேயம் மாடுகளுக்கான சிறந்த தீவன மேலாண்மை',
    summaryEn: 'Balanced dry stover, green fodder (Co-4/Co-5 Cumbu Napier), Azolla protein supplementation, and mineral mixture.',
    summaryTa: 'உலர் சோளத்தட்டு, பசுந்தீவனம் (கோ-4/கோ-5), அசோலா புரத உரம் மற்றும் தாது உப்பு சமநிலை.',
    contentEn: `To sustain peak lactation and fertility in Kangeyam cows:
1. Dry Roughage: 6-8 kg Sorghum stover (சோளத்தட்டு) or groundnut haulms.
2. Green Fodder: 10-15 kg hybrid Cumbu Napier (Co-4, Co-5) or Hedge Lucerne (வேலி மசால்).
3. Concentrate feed: 1.5 kg maintenance + 400g per liter of milk produced (Cottonseed cake, wheat bran, maize flour).
4. Mineral Mixture: 30-40g TANUVAS Area Specific Mineral Mixture daily.
5. Water: Minimum 40-60 Liters of clean, cool drinking water accessible all day.`,
    contentTa: `காங்கேயம் கறவை மாடுகளுக்கு பால் அளவும் ஆரோக்கியமும் சீராக இருக்க:
1. உலர் தீவனம்: 6 முதல் 8 கிலோ சோளத்தட்டு அல்லது நிலக்கடலைக்கொடி.
2. பசுந்தீவனம்: 10 முதல் 15 கிலோ கோ-4 / கோ-5 புல் அல்லது வேலிமசால்.
3. அடர்தீவனம்: மாட்டின் உடல் பராமரிப்புக்கு 1.5 கிலோ + கறக்கும் ஒவ்வொரு லிட்டர் பாலுக்கும் 400 கிராம் (பருத்தி கொட்டை புண்ணாக்கு, தவிடு, மக்காச்சோள மாவு).
4. தாது உப்பு: நாள் ஒன்றுக்கு 30-40 கிராம் தாது உப்புக் கலவை.
5. குடிநீர்: நாள் முழுவதும் 40-60 லிட்டர் சுத்தமான தண்ணீர்.`,
    source: 'Tamil Nadu Veterinary and Animal Sciences University (TANUVAS) Feeding Standards',
    tags: ['feeding', 'nutrition', 'sorghum', 'cumbu napier', 'mineral mixture'],
  },
  {
    id: 'kangeyam-health-vaccination',
    category: 'health',
    titleEn: 'Vaccination Schedule & Preventive Healthcare',
    titleTa: 'தடுப்பூசி கால அட்டவணை மற்றும் நோய் தடுப்பு முறைகள்',
    summaryEn: 'Mandatory vaccination calendar for Foot-and-Mouth Disease (FMD), Black Quarter (BQ), and Hemorrhagic Septicemia (HS).',
    summaryTa: 'கோமாரி நோய் (FMD), அடைப்பான் (HS), சப்பை நோய் (BQ) தடுப்பூசி போடும் கால அட்டவணை.',
    contentEn: `Preventive healthcare timetable:
- Foot and Mouth Disease (கோமாரி): Biannual vaccination (March and September) before monsoon onset.
- Hemorrhagic Septicemia (அடைப்பான்): Pre-monsoon vaccination in May/June.
- Black Quarter (சப்பை நோய்): Pre-monsoon vaccination in May/June for cattle under 3 years.
- Deworming: Every 3-4 months (alternating broad spectrum anthelmintics), especially before monsoon flushes.
- Ectoparasite control: Regular grooming and bio-safe tick management to prevent tick-borne hemoprotozoan fevers.`,
    contentTa: `தடுப்பூசி கால அட்டவணை:
- கோமாரி நோய் (FMD): ஆண்டுக்கு இருமுறை (மார்ச் மற்றும் செப்டம்பர் மாதங்களில்).
- அடைப்பான் நோய் (HS): பருவமழைக்கு முன் (மே/ஜூன் மாதத்தில்).
- சப்பை நோய் (BQ): பருவமழைக்கு முன் 3 வயதிற்குட்பட்ட மாடுகளுக்கு.
- குடற்புழு நீக்கம்: 3 முதல் 4 மாதங்களுக்கு ஒருமுறை பருவமழைக்கு முன்.
- உண்ணி கட்டுப்பாடு: உண்ணி காய்ச்சலைத் தடுக்க கொட்டகையை சுத்தமாக பராமரிக்கவும்.`,
    source: 'Tamil Nadu Animal Husbandry Department Guidelines',
    tags: ['vaccination', 'fmd', 'health', 'deworming', 'prevention'],
  },
  {
    id: 'kangeyam-breeding-conservation',
    category: 'breeding',
    titleEn: 'Breeding Selection & Genetic Conservation Value',
    titleTa: 'இனப்பெருக்க தேர்வு மற்றும் மரபணு பாதுகாப்பு மதிப்பு',
    summaryEn: 'Kangeyam stud bulls and purebred heifers command high conservation value (₹80,000 to ₹2,50,000+).',
    summaryTa: 'காங்கேயம் பொலி காளைகள் மற்றும் தூய மாட்டினங்கள் அதிக சந்தை மதிப்பும் (₹80,000 முதல் ₹2,50,000+) மரபு மதிப்பும் கொண்டவை.',
    contentEn: `Breeding Principles:
- Kangeyam females reach sexual maturity at 30-36 months.
- Inter-calving period is approximately 14-16 months under optimal native nutrition.
- Kangeyam stud bulls with well-developed humps, wide forehead, clear eyes, and dark shoulder patches possess tremendous market value for Jallikattu, Rekla, and natural mating programs.
- Recommendation Engine Tip: If milk yield is low but animal has excellent pedigree and phenotypic traits, candidate should be retained as a BREEDING CANDIDATE rather than sold off.`,
    contentTa: `இனப்பெருக்க கொள்கைகள்:
- காங்கேயம் கிடாரிகள் 30 முதல் 36 மாதங்களில் சினைக்கு தயாராகின்றன.
- கன்றுகளுக்கு இடையேயான இடைவெளி 14 முதல் 16 மாதங்கள்.
- நல்ல திமில், அகன்ற நெற்றி, சுருள் கொம்புகள் கொண்ட தூய பொலி காளைகள் ஜல்லிக்கட்டு, ரேக்ளா மற்றும் இயற்கை இனப்பெருக்கத்திற்கு மிக அதிக மதிப்புடையவை.
- பால் அளவு குறைவாக இருந்தாலும், நல்ல உடல்வாகு கொண்ட மாடுகளை விற்பனை செய்யாமல் "இனப்பெருக்க தேர்வு" (Breeding Candidate) பிரிவில் பராமரிக்க வேண்டும்.`,
    source: 'Senaapathy Kangayam Cattle Research Foundation (SKCRF)',
    tags: ['breeding', 'conservation', 'stud bull', 'heifer', 'pedigree'],
  },
];
