import React, { useState, useEffect, useRef } from 'react';
import { CattleRecord, Language } from '../types';
import { getT } from '../translations';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selectedCattle?: CattleRecord;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  selectedCattle,
}) => {
  const t = getT(language);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const sampleFarmerQuestions = [
    {
      ta: selectedCattle
        ? `${selectedCattle.tagNumber} மாட்டுக்கு பால் குறையுது, நான் என்ன செய்ய வேண்டும்?`
        : 'காங்கேயம் மாட்டுக்கு பால் குறையுது, என்ன தீவனம் கொடுக்கலாம்?',
      en: selectedCattle
        ? `What should I do for cattle ${selectedCattle.tagNumber} whose milk is declining?`
        : 'What should I do if my Kangeyam cattle milk yield is declining?',
    },
    {
      ta: 'தினசரி தீவன செலவு ₹125 ஆகும்போது லாபம் கிடைக்க என்ன செய்ய வேண்டும்?',
      en: 'How to optimize daily feed costs when spending ₹125 per day?',
    },
    {
      ta: 'இந்த மாட்டை விற்கலாமா அல்லது தொடர்ந்து பால் கறக்கலாமா?',
      en: 'Should I continue dairy or consider selling this animal?',
    },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setVoiceError(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
          if (event.error !== 'no-speech') {
            setVoiceError(
              language === 'ta'
                ? 'மைக்ரோஃபோன் அணுகல் அல்லது குரல் அறிதலில் சிக்கல். தட்டச்சு செய்யவும்.'
                : 'Microphone recognition unavailable. You can type directly.'
            );
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setVoiceError(
        language === 'ta'
          ? 'இந்த உலாவியில் நேரடி குரல் அறிதல் ஆதரிக்கப்படவில்லை. கீழே தட்டச்சு செய்யவும்.'
          : 'Speech recognition is not supported in this browser. Please type below.'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setResponse(null);
      setVoiceError(null);
      try {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Start error', e);
      }
    }
  };

  const handleSendVoiceQuery = async (queryText?: string) => {
    const textToSend = queryText || transcript;
    if (!textToSend.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsProcessing(true);
    setResponse(null);
    setVoiceError(null);

    try {
      const res = await fetch('/api/voice/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToSend,
          language,
          cattleContext: selectedCattle,
        }),
      });

      if (!res.ok) {
        throw new Error('Voice API failed');
      }

      const data = await res.json();
      const reply = data.text;
      setResponse(reply);

      // Auto speak response using SpeechSynthesis
      speakResponse(reply);
    } catch (err) {
      // Grounded offline fallback response
      const fallbackReply =
        language === 'ta'
          ? selectedCattle
            ? `${selectedCattle.tagNumber} மாட்டின் பால் உற்பத்தி ${selectedCattle.dailyMilkLiters.value} லிட்டராக குறைந்துள்ளதால், தீவன அளவை சரிபார்க்கவும். 30 கிராம் TANUVAS தாது உப்பு கலவை வழங்கி, நிலைமை நீடித்தால் கால்நடை மருத்துவரை அணுகவும்.`
            : 'காங்கேயம் மாட்டிற்கு தரமான பசுந்தீவனமும், தினசரி 30 கிராம் தாது உப்பும் வழங்கவும். திடீர் பால் குறைவு ஏற்பட்டால் மருத்துவரை கலந்தாலோசிக்கவும்.'
          : selectedCattle
          ? `For cattle ${selectedCattle.tagNumber}, since daily milk has dropped to ${selectedCattle.dailyMilkLiters.value}L/day, review dry matter and water intake. Supplement with 30-50g TANUVAS mineral mixture and consult a veterinarian if decline persists.`
          : 'Ensure 15-20kg green fodder and 30-50g mineral mixture daily. If milk decline continues, consult a local veterinarian.';
      setResponse(fallbackReply);
      speakResponse(fallbackReply);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95; // Farmer friendly cadence

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-xl font-bold">
              🎤
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {t.voice.title}
              </h3>
              <p className="text-xs text-emerald-200">
                {selectedCattle
                  ? `${language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மாடு' : 'Active context'}: ${selectedCattle.tagNumber} (${selectedCattle.breed})`
                  : t.voice.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Big Interactive Microphone Button */}
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <button
              id="voice-mic-trigger"
              type="button"
              onClick={toggleRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white ring-8 ring-emerald-50'
              }`}
            >
              {isRecording ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>

            <div>
              <p className="text-sm font-bold text-stone-800">
                {isRecording
                  ? t.voice.listening
                  : t.voice.speakBtn}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ta'
                  ? 'தமிழில் தெளிவாக பேசவும் அல்லது கீழே தட்டச்சு செய்யவும்'
                  : 'Speak clearly in English or Tamil, or type below'}
              </p>
            </div>
          </div>

          {/* Transcript / Input text Area */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'உங்கள் கேள்வி இங்கே தோன்றும் (அல்லது தட்டச்சு செய்யலாம்)...'
                    : 'Your voice transcript will appear here, or you can type...'
                }
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600 resize-none font-medium"
              />
              {transcript && (
                <button
                  type="button"
                  onClick={() => handleSendVoiceQuery()}
                  disabled={isProcessing}
                  className="absolute right-3 bottom-3 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{language === 'ta' ? 'கேட்க' : 'Ask'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Voice Error notice if any */}
          {voiceError && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{voiceError}</span>
            </div>
          )}

          {/* AI Response Card with Audio Speaker */}
          {response && (
            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  {language === 'ta' ? 'AI உதவி பதில்:' : 'AI Assistant Guidance:'}
                </span>

                <div className="flex items-center gap-1.5">
                  {isPlayingAudio ? (
                    <button
                      type="button"
                      onClick={stopAudio}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => speakResponse(response)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.voice.playAudio}</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {response}
              </p>
            </div>
          )}

          {/* Quick Presets for Demo */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 block uppercase">
              {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட விவசாயி கேள்விகள்:' : 'Example Farmer Questions:'}
            </span>
            <div className="space-y-1.5">
              {sampleFarmerQuestions.map((q, idx) => {
                const text = language === 'ta' ? q.ta : q.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(text);
                      handleSendVoiceQuery(text);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-xs text-stone-700 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <span className="font-medium truncate">{text}</span>
                    <Send className="w-3 h-3 text-stone-400 group-hover:text-emerald-700 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
