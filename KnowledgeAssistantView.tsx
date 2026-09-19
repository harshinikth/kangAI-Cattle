import React, { useState } from 'react';
import { KnowledgeArticle, Language, ProductRecommendation } from '../types';
import { getT } from '../translations';
import { KNOWLEDGE_ARTICLES, VERIFIED_PRODUCTS } from '../data/knowledgeBase';
import {
  BookOpen,
  Search,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Pill,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

interface KnowledgeAssistantViewProps {
  language: Language;
}

export const KnowledgeAssistantView: React.FC<KnowledgeAssistantViewProps> = ({
  language,
}) => {
  const t = getT(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // RAG Query State
  const [askQuery, setAskQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{
    query: string;
    text: string;
    sources: string[];
    vetNotice?: boolean;
  } | null>(null);

  const sampleQuestions = [
    {
      ta: 'காங்கேயம் கறவை மாட்டுக்கு தாது உப்பு கலவை எவ்வளவு கொடுக்க வேண்டும்?',
      en: 'What is the recommended mineral mixture dosage for Kangeyam cattle?',
    },
    {
      ta: 'மயிலை மற்றும் காரி இன காங்கேயம் மாட்டின் சிறப்பு என்ன?',
      en: 'What are the characteristics of Mayilai vs Kaari Kangeyam varieties?',
    },
    {
      ta: 'பால் திடீரென குறைய என்ன காரணங்கள்? என்ன தீவனம் மாற்றலாம்?',
      en: 'What causes sudden milk yield drop in Kangeyam and how to adjust feed?',
    },
    {
      ta: 'காங்கேயம் மாடுகளுக்கான முக்கிய தடுப்பூசி அட்டவணை என்ன?',
      en: 'What is the mandatory vaccination schedule for indigenous cattle in Tamil Nadu?',
    },
  ];

  const handleAsk = async (queryToAsk: string) => {
    if (!queryToAsk.trim()) return;
    setIsLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToAsk,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('RAG request failed');
      }

      const data = await res.json();
      setAiAnswer({
        query: queryToAsk,
        text: data.answer,
        sources: data.sources || ['TANUVAS Kangeyam Research Data'],
        vetNotice: data.vetNotice,
      });
    } catch (err) {
      // Grounded offline fallback response
      setAiAnswer({
        query: queryToAsk,
        text:
          language === 'ta'
            ? 'காங்கேயம் மாடுகள் குறைந்த தீவனத்திலும் அதிக நோய் எதிர்ப்பு திறன் கொண்டவை. தினசரி 30-50 கிராம் TANUVAS தாது உப்பு கலவையும், 15-20 கிலோ பசுந்தீவனமும் வழங்கி, நோய் அறிகுறிகள் இருப்பின் கால்நடை மருத்துவரை அணுகவும்.'
            : 'Kangeyam cattle thrive on indigenous roughages with high immunity. Ensure 30-50g TANUVAS mineral mixture, clean water ad-libitum, and 15-20kg green fodder. Always consult a veterinarian for health issues.',
        sources: ['Kangeyam Knowledge Base (Local Grounded)'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Articles
  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleTa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.contentEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.contentTa.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          {t.knowledge.title}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900">
          {t.knowledge.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {t.knowledge.subtitle}
        </p>
      </div>

      {/* Grounded AI Q&A Box */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {t.knowledge.askAiTitle}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட அறிவுத்தளம்' : 'Grounded in Kangeyam Research'}
          </span>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(askQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'காங்கேயம் பராமரிப்பு, தீவனம் அல்லது நோய் தடுப்பு பற்றி கேட்கவும்...'
                : 'Ask anything about Kangeyam husbandry, feed calculation, breeding...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-sm text-white placeholder:text-stone-400 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={isLoading || !askQuery.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{language === 'ta' ? 'கேட்க' : 'Ask'}</span>
          </button>
        </form>

        {/* Quick Sample Questions */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-stone-400 font-medium">
            {language === 'ta' ? 'மாதிரி கேள்விகள்:' : 'Quick questions:'}
          </span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const q = language === 'ta' ? sq.ta : sq.en;
                setAskQuery(q);
                handleAsk(q);
              }}
              className="text-xs bg-stone-800/80 hover:bg-stone-700/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-stone-700/80 transition-all cursor-pointer"
            >
              {language === 'ta' ? sq.ta : sq.en}
            </button>
          ))}
        </div>

        {/* AI Answer Result Card */}
        {aiAnswer && (
          <div className="p-4 rounded-xl bg-stone-800/90 border border-emerald-500/40 text-stone-100 space-y-2 mt-4">
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'பதில் (வழிகாட்டல்):' : 'AI Grounded Guidance:'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-200 font-normal">
              {aiAnswer.text}
            </p>
            {aiAnswer.sources && (
              <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-700/60 flex items-center gap-2">
                <span>{language === 'ta' ? 'மூலங்கள்:' : 'Sources:'}</span>
                <span className="text-emerald-300 font-medium">
                  {aiAnswer.sources.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Products Showcase */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-700" />
            {language === 'ta' ? 'சான்றளிக்கப்பட்ட தீவன & தாது உப்பு பொருட்கள்' : 'Verified Feed & Nutrient Formulations'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'ta'
              ? 'காங்கேயம் கால்நடைகளின் ஆரோக்கியம் மற்றும் உற்பத்திக்கு பரிந்துரைக்கப்பட்ட பொருட்கள்'
              : 'Grounded formulations approved by TANUVAS and indigenous cattle standards'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VERIFIED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {language === 'ta' ? prod.needCategory.ta : prod.needCategory.en}
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {prod.confidence} Conf
                  </span>
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm mb-1">
                  {language === 'ta' ? prod.productName.ta : prod.productName.en}
                </h4>

                <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                  {language === 'ta' ? prod.reason.ta : prod.reason.en}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-700 font-medium">
                <strong className="text-stone-900">{language === 'ta' ? 'அளவு:' : 'Dosage:'} </strong>
                {language === 'ta' ? prod.dosageGuidance.ta : prod.dosageGuidance.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'கட்டுரைகள், தீவன ஆலோசனைகள் தேடுக...'
                  : 'Search articles, feeding guidance, disease management...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', labelEn: 'All', labelTa: 'அனைத்தும்' },
              { key: 'breed', labelEn: 'Breed', labelTa: 'இனம்' },
              { key: 'feeding', labelEn: 'Feeding', labelTa: 'தீவனம்' },
              { key: 'health', labelEn: 'Health', labelTa: 'சுகாதாரம்' },
              { key: 'breeding', labelEn: 'Breeding', labelTa: 'இனப்பெருக்கம்' },
              { key: 'economics', labelEn: 'Economics', labelTa: 'பொருளாதாரம்' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Articles Accordion */}
        <div className="space-y-3">
          {filteredArticles.map((art) => {
            const isExpanded = expandedArticleId === art.id;

            return (
              <div
                key={art.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                      📖
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {language === 'ta' ? art.titleTa : art.titleEn}
                      </h4>
                      <div className="text-[11px] text-stone-400 font-medium">
                        {art.source}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/60 text-xs sm:text-sm text-stone-700 space-y-3">
                    <p className="leading-relaxed whitespace-pre-line font-normal">
                      {language === 'ta' ? art.contentTa : art.contentEn}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-200 text-[11px] text-stone-500 font-medium">
                      <span>{language === 'ta' ? 'முக்கிய குறிச்சொற்கள்:' : 'Tags:'}</span>
                      {art.tags.map((tg) => (
                        <span
                          key={tg}
                          className="bg-stone-200/80 px-2 py-0.5 rounded text-stone-700"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
