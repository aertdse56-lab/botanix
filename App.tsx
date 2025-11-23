
import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingScreen } from './components/LoadingScreen';
import { LightMeter } from './components/LightMeter';
import { identifyPlant } from './services/geminiService';
import { PlantIdentification, Language } from './types';
import { Icons } from './components/Icons';
import { UI_TEXT } from './utils/i18n';

const STORAGE_KEY = 'botanix_nature_v3';

const App: React.FC = () => {
  const [history, setHistory] = useState<PlantIdentification[]>([]);
  const [currentScan, setCurrentScan] = useState<PlantIdentification | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<'home' | 'history'>('home');
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showLightMeter, setShowLightMeter] = useState(false);

  const text = UI_TEXT[language];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistory(JSON.parse(saved));

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveHistory = (updatedHistory: PlantIdentification[]) => {
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleScan = async (base64: string) => {
    if (isOffline) {
      setError("Cannot identify plants while offline. Check connection.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await identifyPlant(base64, language);
      setCurrentScan(result);
      // Save immediately
      saveHistory([result, ...history].slice(0, 50));
    } catch (e) {
      setError("Identification failed. Please try a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdatePlant = (updatedPlant: PlantIdentification) => {
    setCurrentScan(updatedPlant);
    const newHistory = history.map(p => p.id === updatedPlant.id ? updatedPlant : p);
    saveHistory(newHistory);
  };

  if (currentScan) {
    return (
      <>
        {isAnalyzing && <LoadingScreen text={text.loading} />}
        <AnalysisResult 
          data={currentScan} 
          onReset={() => setCurrentScan(null)} 
          language={language} 
          onUpdatePlant={handleUpdatePlant}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 to-white text-nature-900 font-sans pb-32">
      {isAnalyzing && <LoadingScreen text={text.loading} />}
      {showLightMeter && <LightMeter onClose={() => setShowLightMeter(false)} />}

      {/* Modern Top Bar */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-nature-500 to-nature-600 text-white p-2 rounded-xl shadow-lg shadow-nature-500/20">
             <Icons.Leaf size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-nature-900 to-nature-700">{text.title}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLightMeter(true)} className="p-2 rounded-full glass hover:bg-white text-nature-600">
             <Icons.Sun size={18} />
          </button>
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'bn' : 'en')} 
            className="px-4 py-2 rounded-full glass text-xs font-bold hover:bg-white text-nature-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Icons.Globe size={14} /> {text.switchLang}
          </button>
        </div>
      </nav>

      <main className="pt-28 px-4 max-w-xl mx-auto">
        
        {isOffline && (
          <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3 text-orange-700 animate-slide-up">
            <Icons.WifiOff size={20} />
            <div>
              <div className="font-bold text-sm">{text.offlineTitle}</div>
              <div className="text-xs">{text.offlineDesc}</div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 animate-slide-up">
            <Icons.AlertTriangle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {view === 'home' ? (
          <div className="animate-slide-up space-y-10">
             <div className={isOffline ? 'opacity-50 pointer-events-none grayscale' : ''}>
               <ImageUploader onImageSelected={handleScan} labels={text} isOffline={isOffline} />
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-lg text-nature-800">Recent in Garden</h3>
                  <button onClick={() => setView('history')} className="text-accent-DEFAULT text-sm font-semibold hover:text-accent-dark transition-colors">
                    See All
                  </button>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-12 bg-white/50 border-2 border-dashed border-nature-200 rounded-3xl text-nature-400">
                    <Icons.Sprout size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">{text.empty}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {history.slice(0, 3).map(scan => (
                      <div key={scan.id} onClick={() => setCurrentScan(scan)} className="glass bg-white p-3 rounded-2xl flex gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                         <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                           <img src={scan.imageUrl} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <div className="font-bold text-nature-900">{scan.commonNames?.[0]}</div>
                            <div className="text-nature-500 text-xs font-medium">{scan.scientificName}</div>
                         </div>
                         <div className="flex items-center justify-center px-4">
                            <div className="bg-nature-50 p-2 rounded-full text-nature-400">
                               <Icons.ChevronRight size={16} />
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
             <div className="flex items-center gap-3 mb-2">
               <button onClick={() => setView('home')} className="p-3 bg-white rounded-full shadow-sm hover:bg-nature-50 text-nature-600"><Icons.ChevronLeft size={20} /></button>
               <h2 className="text-2xl font-bold text-nature-900">{text.history}</h2>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {history.map(scan => (
                  <div key={scan.id} onClick={() => setCurrentScan(scan)} className="bg-white rounded-3xl overflow-hidden cursor-pointer shadow-glass hover:shadow-lg transition-all group border border-white/50">
                      <div className="h-32 overflow-hidden relative">
                         <img src={scan.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                         <div className="absolute bottom-2 left-3 text-white text-xs font-bold">
                           {new Date(scan.timestamp).toLocaleDateString()}
                         </div>
                         {scan.diagnostics?.status && scan.diagnostics.status !== 'Healthy' && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                              {scan.diagnostics.status}
                            </div>
                         )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-nature-900 text-sm mb-1 truncate">{scan.commonNames?.[0]}</h3>
                        <p className="text-nature-500 text-[10px] font-medium truncate">{scan.scientificName}</p>
                      </div>
                  </div>
               ))}
             </div>
          </div>
        )}

      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full px-2 py-2 flex gap-2 shadow-2xl shadow-nature-900/10 z-50">
         <button 
           onClick={() => setView('home')} 
           className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${view === 'home' ? 'bg-nature-900 text-white shadow-lg' : 'text-nature-500 hover:bg-nature-50'}`}
         >
            <Icons.Scan size={20} />
            {view === 'home' && <span className="text-sm font-bold">Scan</span>}
         </button>
         <button 
           onClick={() => setView('history')} 
           className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${view === 'history' ? 'bg-nature-900 text-white shadow-lg' : 'text-nature-500 hover:bg-nature-50'}`}
         >
            <Icons.Sprout size={20} />
            {view === 'history' && <span className="text-sm font-bold">Garden</span>}
         </button>
      </div>

    </div>
  );
};

export default App;
