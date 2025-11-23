
import React, { useEffect, useState } from 'react';
import { PlantIdentification, Language, ChatMessage, ToolResult, PlantTool } from '../types';
import { Icons } from './Icons';
import { ANALYSIS_DICT } from '../utils/i18n';
import { JournalSection } from './JournalSection';
import { DetailRow } from './DetailRow';
import { PlantChat } from './PlantChat';
import { Timeline } from './Timeline';
import { Toolbox } from './Toolbox';
import { ActiveTool } from './ActiveTool';

interface AnalysisResultProps {
  data: PlantIdentification;
  onReset: () => void;
  language: Language;
  onUpdatePlant?: (updated: PlantIdentification) => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset, language, onUpdatePlant }) => {
  const t = ANALYSIS_DICT[language];
  const isBangla = language === 'bn';
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'tools' | 'timeline' | 'chat'>('overview');
  const [selectedTool, setSelectedTool] = useState<PlantTool | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => window.speechSynthesis.cancel();
  }, [data]);

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const textToSpeak = `${data.commonNames[0]}. Health Score: ${data.healthScore}. ${data.description}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      isBangla ? v.lang.includes('bn') || v.lang.includes('in') : v.lang.includes('en-GB')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: data.commonNames[0],
      text: `My ${data.commonNames[0]} is a "${data.personality}" with a Health Score of ${data.healthScore}! #Botanix`,
      url: 'https://botanix-ai.vercel.app'
    };
    try {
        // Validate URL before sharing to prevent "Invalid URL" error in some contexts
        if (window.location.href.startsWith('http')) {
             await navigator.share(shareData);
        } else {
             throw new Error("Cannot share from this context");
        }
    } catch (err) {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Copied to clipboard!");
    }
  };

  const handlePrint = () => window.print();

  const handleChatUpdate = (history: ChatMessage[]) => {
    if (onUpdatePlant) onUpdatePlant({ ...data, chatHistory: history });
  };

  const handleTimelineUpdate = (updatedPlant: PlantIdentification) => {
    if (onUpdatePlant) onUpdatePlant(updatedPlant);
  };

  const handleToolResult = (result: ToolResult) => {
     const updatedHistory = [...(data.toolHistory || []), result];
     if (onUpdatePlant) onUpdatePlant({ ...data, toolHistory: updatedHistory });
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 50) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  if (!data) return null;

  return (
    <div className={`min-h-screen bg-nature-50 pb-32 text-nature-900 ${isBangla ? 'font-bangla' : 'font-sans'} print:bg-white print:pb-0`}>
      
      {selectedTool && (
        <ActiveTool 
          tool={selectedTool} 
          language={language} 
          onClose={() => setSelectedTool(null)}
          onSaveResult={handleToolResult}
        />
      )}

      {/* Top Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 py-4 pointer-events-none print:hidden">
        <div className="max-w-4xl mx-auto flex justify-between items-center pointer-events-auto">
          <button onClick={onReset} className="w-10 h-10 rounded-full glass flex items-center justify-center text-nature-800 hover:bg-white shadow-lg transition-all">
            <Icons.ChevronLeft size={22} />
          </button>
          <div className="flex gap-3">
             <button onClick={handleSpeak} className={`w-10 h-10 rounded-full glass flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'text-accent-DEFAULT bg-white scale-110' : 'text-nature-800 hover:bg-white'}`}>
                {isPlaying ? <Icons.Activity size={20} /> : <Icons.Volume2 size={20} />} 
             </button>
             <button onClick={handlePrint} className="w-10 h-10 rounded-full glass flex items-center justify-center text-nature-800 hover:bg-white shadow-lg transition-all">
                <Icons.Printer size={20} />
             </button>
             <button onClick={handleShare} className="w-10 h-10 rounded-full glass flex items-center justify-center text-nature-800 hover:bg-white shadow-lg transition-all">
                <Icons.Share2 size={20} />
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[45vh] w-full print:h-auto print:mb-4">
        <img 
          src={data.imageUrl} 
          className="w-full h-full object-cover rounded-b-[3rem] shadow-xl print:rounded-none print:shadow-none print:max-h-[400px] print:object-contain print:mx-auto" 
          alt="Specimen" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nature-900/90 via-transparent to-transparent rounded-b-[3rem] print:hidden"></div>
        
        {/* Personality Badge */}
        <div className="absolute top-24 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 animate-float print:hidden">
           <div className="flex items-center gap-2">
             <span className="text-xl">{data.healthScore > 80 ? '😎' : data.healthScore > 50 ? '😐' : '🤒'}</span>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-nature-500 tracking-wider">Personality</span>
               <span className="text-sm font-bold text-nature-900 leading-none">"{data.personality || 'The Mystery'}"</span>
             </div>
           </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 text-white print:static print:text-black print:p-0 print:mt-4">
          <div className="max-w-4xl mx-auto flex items-end justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider print:border-nature-900 print:text-nature-900 print:bg-transparent">
                  {data.taxonomy?.family || "Plantae"}
                </span>
                {data.safety.isPoisonous && (
                   <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                     <Icons.Skull size={12} /> Toxic
                   </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight tracking-tight print:text-nature-900">{data.commonNames?.[0]}</h1>
              <p className="text-white/80 text-lg font-medium italic print:text-nature-600">{data.scientificName}</p>
            </div>
            
            {/* Health Score Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center print:hidden">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="40" cy="40" r="36" className="text-white/20" strokeWidth="6" stroke="currentColor" fill="transparent" />
                 <circle cx="40" cy="40" r="36" className={getHealthColor(data.healthScore || 0)} strokeWidth="6" stroke="currentColor" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * (data.healthScore || 0) / 100)} />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-xl font-bold">{data.healthScore}</span>
                 <span className="text-[8px] uppercase font-medium opacity-80">Health</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 -mt-6 relative z-10 max-w-4xl mx-auto space-y-6 print:mt-4 print:static">
        
        {/* Tab Navigation */}
        <div className="flex p-1 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 print:hidden overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', icon: Icons.BookOpen, label: 'Overview' },
            { id: 'care', icon: Icons.Sprout, label: 'Smart Care' },
            { id: 'tools', icon: Icons.Briefcase, label: 'Toolbox' },
            { id: 'timeline', icon: Icons.TrendingUp, label: 'Timeline' },
            { id: 'chat', icon: Icons.MessageCircle, label: 'Botanist' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-white shadow-sm text-nature-800' 
                : 'text-nature-500 hover:bg-white/50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Rescue Plan (If needed) */}
            {data.rescuePlan?.isNeeded && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm animate-pulse-slow">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full text-red-600"><Icons.HeartPulse size={24} /></div>
                    <h2 className="text-xl font-bold text-red-800">Emergency Rescue Protocol</h2>
                 </div>
                 <div className="space-y-3">
                    <div className="flex gap-3 items-start bg-white p-3 rounded-xl border border-red-100">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">Day 1</span>
                      <p className="text-sm text-nature-900">{data.rescuePlan.step1}</p>
                    </div>
                    <div className="flex gap-3 items-start bg-white p-3 rounded-xl border border-red-100">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">Day 2</span>
                      <p className="text-sm text-nature-900">{data.rescuePlan.step2}</p>
                    </div>
                    <div className="flex gap-3 items-start bg-white p-3 rounded-xl border border-red-100">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">Day 3</span>
                      <p className="text-sm text-nature-900">{data.rescuePlan.step3}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-glass border border-white/50 print:shadow-none print:border-gray-200 print:break-inside-avoid">
               <h2 className="text-xl font-bold text-nature-900 mb-4 flex items-center gap-2 print:text-black">
                 <span className="text-accent-DEFAULT print:text-black"><Icons.Info size={24} /></span> {t.overview}
               </h2>
               <p className="text-nature-700 leading-relaxed text-base print:text-black">{data.description}</p>
               
               <div className="mt-6 flex flex-col sm:flex-row gap-4">
                 <div className="flex-1 bg-gradient-to-br from-nature-50 to-white rounded-2xl p-4 border border-nature-100">
                   <div className="text-xs font-bold text-nature-400 uppercase mb-1">Lifespan Prediction</div>
                   <div className="font-semibold text-nature-800 text-sm flex items-center gap-2">
                     <Icons.Activity size={16} className="text-accent-DEFAULT" /> {data.lifespanPrediction || "Stable condition expected."}
                   </div>
                 </div>
                 <div className="flex-1 bg-gradient-to-br from-nature-50 to-white rounded-2xl p-4 border border-nature-100">
                   <div className="text-xs font-bold text-nature-400 uppercase mb-1">Native Region</div>
                   <div className="font-semibold text-nature-800 text-sm flex items-center gap-2">
                     <Icons.Globe size={16} className="text-nature-500" /> {data.ecology?.nativeRegion}
                   </div>
                 </div>
               </div>
            </div>

            {/* Tool History (Recent Analyses) */}
            {data.toolHistory && data.toolHistory.length > 0 && (
              <div className="bg-nature-900 rounded-3xl p-6 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Icons.Briefcase size={20} /> Recent Tool Insights</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {data.toolHistory.map(tool => (
                    <div key={tool.toolId} className="min-w-[200px] bg-white/10 rounded-2xl p-4 border border-white/20">
                       <div className="text-xs uppercase opacity-70 mb-1">{tool.title}</div>
                       <div className="font-bold text-lg mb-1">{tool.status}</div>
                       <div className="text-xs line-clamp-2 opacity-80">{tool.analysis}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {data.morphology && (
                   <JournalSection title={t.morphology} icon={Icons.Fingerprint}>
                      <div className="space-y-1">
                         <DetailRow label={t.leaves} value={data.morphology.leaves} icon={Icons.Leaf} />
                         <DetailRow label={t.flowers} value={data.morphology.flowers} icon={Icons.Flower} />
                         <DetailRow label={t.fruits} value={data.morphology.fruits} icon={Icons.Apple} />
                      </div>
                   </JournalSection>
               )}
               {data.folklore && (
                 <JournalSection title={t.about} icon={Icons.BookOpen}>
                   <div className="space-y-3">
                     <p className="text-sm italic text-nature-600">"{data.folklore.origin}"</p>
                     <p className="text-sm text-nature-800">{data.folklore.stories}</p>
                   </div>
                 </JournalSection>
               )}
            </div>
          </div>
        )}

        {/* TAB: SMART CARE */}
        {activeTab === 'care' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Water Calculator Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-white/20 rounded-full"><Icons.Droplets size={24} /></div>
                   <h2 className="text-xl font-bold">Precise Water Calculator</h2>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                     <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Volume</div>
                     <div className="text-3xl font-bold">{data.care?.waterAmount || "N/A"}</div>
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                     <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Frequency</div>
                     <div className="text-xl font-bold">{data.care?.waterFrequency || "N/A"}</div>
                   </div>
                 </div>
               </div>
               <Icons.Droplet size={120} className="absolute -bottom-4 -right-4 opacity-10" />
            </div>

            {/* Pot & Soil Analyzer Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl border border-nature-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-nature-800 font-bold">
                    <Icons.Box size={20} className="text-stone-500" /> Pot Size Analysis
                  </div>
                  <p className="text-sm text-nature-600 leading-relaxed">
                    {data.care?.potSizeAnalysis || "Pot size appears adequate."}
                  </p>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-nature-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-nature-800 font-bold">
                    <Icons.Shovel size={20} className="text-stone-500" /> Soil Mix
                  </div>
                  <p className="text-sm text-nature-600 leading-relaxed">
                    {data.care?.soilMix || "Standard potting mix."}
                  </p>
               </div>
            </div>

            <JournalSection title="Detailed Requirements" icon={Icons.Sprout}>
                <div className="space-y-3">
                   {[
                      { l: "Light (Lux)", v: data.care.sunlightLux, i: Icons.Sun, c: "text-orange-500" },
                      { l: "Fertilizer", v: data.care.fertilizerSchedule, i: Icons.Zap, c: "text-yellow-500" },
                      { l: "Pruning", v: data.care.pruning, i: Icons.Aperture, c: "text-green-500" },
                      { l: "Temp", v: data.care.temperature, i: Icons.Thermometer, c: "text-red-500" },
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-nature-50/50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <item.i size={18} className={item.c} />
                           <span className="text-sm font-bold text-nature-700">{item.l}</span>
                        </div>
                        <span className="text-sm text-nature-900 font-medium text-right max-w-[60%]">{item.v}</span>
                      </div>
                   ))}
                </div>
            </JournalSection>
          </div>
        )}

        {/* TAB: TOOLBOX */}
        {activeTab === 'tools' && (
           <Toolbox onSelectTool={setSelectedTool} />
        )}

        {/* TAB: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="animate-slide-up">
            <Timeline plantData={data} onAddUpdate={handleTimelineUpdate} language={language} />
          </div>
        )}

        {/* TAB: CHAT */}
        {activeTab === 'chat' && (
          <div className="animate-slide-up">
            <PlantChat plantData={data} onUpdateHistory={handleChatUpdate} language={language} />
          </div>
        )}

      </main>
    </div>
  );
};
