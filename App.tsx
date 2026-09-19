import React, { useState } from 'react';
import { AnimalInputData, CattleRecord, Language } from './types';
import { SAMPLE_CATTLE } from './data/sampleCattle';
import { analyzeCattle } from './services/decisionEngine';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MyCattleView } from './components/MyCattleView';
import { AnalyzeAnimalView } from './components/AnalyzeAnimalView';
import { AnimalProfileView } from './components/AnimalProfileView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { KnowledgeAssistantView } from './components/KnowledgeAssistantView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  FileCheck2,
  SlidersHorizontal,
  BookOpen,
  Mic,
} from 'lucide-react';
import { getT } from './translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('ta');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [cattleList, setCattleList] = useState<CattleRecord[]>(SAMPLE_CATTLE);
  const [selectedCattleId, setSelectedCattleId] = useState<string>('kc-104');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceContextCattle, setVoiceContextCattle] = useState<CattleRecord | undefined>(undefined);

  const t = getT(language);

  // Selected cattle object
  const selectedCattle = cattleList.find((c) => c.id === selectedCattleId) || cattleList[0];

  // Handler for analyzing new or updated animal
  const handleAnalysisComplete = (data: AnimalInputData) => {
    const analysis = analyzeCattle(data);
    const newRecord: CattleRecord = {
      ...data,
      analysis,
      createdAt: (data as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If exists in list, update; otherwise prepend
    setCattleList((prev) => {
      const idx = prev.findIndex((c) => c.id === data.id || c.tagNumber === data.tagNumber);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newRecord;
        return next;
      }
      return [newRecord, ...prev];
    });

    setSelectedCattleId(newRecord.id);
    setCurrentTab('recommendations');
  };

  const handleSelectAnimal = (cattle: CattleRecord) => {
    setSelectedCattleId(cattle.id);
    setCurrentTab('recommendations');
  };

  const handleOpenVoiceWithContext = (cattle: CattleRecord) => {
    setVoiceContextCattle(cattle);
    setIsVoiceOpen(true);
  };

  const handleOpenVoiceGeneral = () => {
    setVoiceContextCattle(selectedCattle);
    setIsVoiceOpen(true);
  };

  const handleOpenWhatIfForCattle = (cattle: CattleRecord) => {
    setSelectedCattleId(cattle.id);
    setCurrentTab('whatIf');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Sticky Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenVoice={handleOpenVoiceGeneral}
        totalCattle={cattleList.length}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'voiceAssistant') {
              handleOpenVoiceGeneral();
            } else {
              setCurrentTab(tab);
            }
          }}
          language={language}
          onLanguageChange={setLanguage}
          hasSelectedAnimal={!!selectedCattle}
          selectedTagNumber={selectedCattle?.tagNumber}
        />

        {/* Viewport Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              cattleList={cattleList}
              language={language}
              onSelectAnimal={handleSelectAnimal}
              onNewAnimal={() => setCurrentTab('analyzeAnimal')}
              onAnalyze={() => setCurrentTab('analyzeAnimal')}
              onOpenVoice={handleOpenVoiceGeneral}
            />
          )}

          {currentTab === 'myCattle' && (
            <MyCattleView
              cattleList={cattleList}
              language={language}
              onSelectAnimal={handleSelectAnimal}
              onNewAnimal={() => setCurrentTab('analyzeAnimal')}
            />
          )}

          {currentTab === 'analyzeAnimal' && (
            <AnalyzeAnimalView
              language={language}
              onAnalysisComplete={handleAnalysisComplete}
              initialData={selectedCattle}
            />
          )}

          {currentTab === 'recommendations' && selectedCattle && (
            <AnimalProfileView
              cattle={selectedCattle}
              language={language}
              onOpenVoiceWithContext={handleOpenVoiceWithContext}
              onOpenWhatIf={handleOpenWhatIfForCattle}
              onReAnalyze={() => setCurrentTab('analyzeAnimal')}
            />
          )}

          {currentTab === 'whatIf' && (
            <WhatIfSimulatorView
              cattleList={cattleList}
              selectedCattleId={selectedCattleId}
              language={language}
              onSelectAnimalForProfile={handleSelectAnimal}
            />
          )}

          {currentTab === 'knowledgeAssistant' && (
            <KnowledgeAssistantView language={language} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'dashboard' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t.nav.dashboard}</span>
        </button>

        <button
          onClick={() => setCurrentTab('myCattle')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'myCattle' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>{t.nav.myCattle}</span>
        </button>

        <button
          onClick={() => setCurrentTab('analyzeAnimal')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'analyzeAnimal' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.nav.analyzeAnimal}</span>
        </button>

        <button
          onClick={() => setCurrentTab('recommendations')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'recommendations' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <FileCheck2 className="w-5 h-5" />
          <span>{t.nav.recommendations}</span>
        </button>

        <button
          onClick={() => setCurrentTab('whatIf')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'whatIf' ? 'text-emerald-700' : 'text-stone-500'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>What-If</span>
        </button>

        <button
          onClick={handleOpenVoiceGeneral}
          className="flex flex-col items-center p-1 text-[10px] font-bold text-amber-700"
        >
          <Mic className="w-5 h-5" />
          <span>Voice</span>
        </button>
      </nav>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        selectedCattle={voiceContextCattle}
      />
    </div>
  );
}
