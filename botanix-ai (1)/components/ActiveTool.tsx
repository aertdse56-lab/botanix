
import React, { useState, useRef } from 'react';
import { PlantTool, ToolResult } from '../types';
import { Icons } from './Icons';
import { analyzeToolImage } from '../services/geminiService';

interface ActiveToolProps {
  tool: PlantTool;
  onClose: () => void;
  onSaveResult: (result: ToolResult) => void;
  language: any;
}

export const ActiveTool: React.FC<ActiveToolProps> = ({ tool, onClose, onSaveResult, language }) => {
  const [step, setStep] = useState<'intro' | 'analyzing' | 'result'>('intro');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const Icon = (Icons as any)[tool.iconName] || Icons.Sprout;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setStep('analyzing');
        runAnalysis(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64: string) => {
    try {
      const data = await analyzeToolImage(base64, tool.name, tool.aiSystemPrompt, language);
      setResult(data);
      onSaveResult(data);
      setStep('result');
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Try again.");
      setStep('intro');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-nature-100 flex items-center justify-between bg-nature-50">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full"><Icons.X size={20} /></button>
          <h2 className="font-bold text-nature-900 flex items-center gap-2">
            <Icon size={18} className="text-nature-600" /> {tool.name}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* STEP 1: INTRO */}
        {step === 'intro' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-24 h-24 bg-nature-100 rounded-full flex items-center justify-center text-nature-600 animate-pulse">
               <Icons.Camera size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-nature-900 mb-2">Capture Photo</h3>
              <p className="text-nature-600 max-w-xs mx-auto">{tool.cameraInstruction}</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-nature-600 text-white rounded-full font-bold shadow-lg hover:bg-nature-700 transition-all flex items-center gap-2"
            >
              <Icons.Camera size={20} /> Open Camera
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
          </div>
        )}

        {/* STEP 2: ANALYZING */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-4 border-nature-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-nature-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               {image && <img src={image} className="absolute inset-2 rounded-full object-cover opacity-50" />}
            </div>
            <div className="font-bold text-xl text-nature-800 animate-pulse">Running {tool.name}...</div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 'result' && result && (
          <div className="space-y-6 animate-slide-up">
             <div className="bg-nature-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <div className="text-xs uppercase opacity-70 tracking-widest">Status</div>
                       <div className="text-2xl font-bold">{result.status}</div>
                    </div>
                    {result.score !== undefined && result.score > -1 && (
                       <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center text-xl font-bold">
                          {result.score}
                       </div>
                    )}
                  </div>
                  <p className="text-white/90 leading-relaxed">{result.analysis}</p>
                  {result.prediction && (
                     <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-sm font-semibold text-accent-light">
                        <Icons.TrendingUp size={16} /> {result.prediction}
                     </div>
                  )}
                </div>
                <Icon size={150} className="absolute -bottom-10 -right-10 opacity-10" />
             </div>

             <div className="bg-white rounded-3xl border border-nature-100 p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-4 text-nature-800 font-bold">
                  <Icons.CheckCircle size={20} className="text-green-500" /> Action Plan
               </div>
               <div className="space-y-3">
                  {result.actionPlan.map((step, i) => (
                     <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 bg-nature-100 rounded-full flex items-center justify-center text-xs font-bold text-nature-600 flex-shrink-0">
                           {i+1}
                        </div>
                        <p className="text-sm text-nature-700">{step}</p>
                     </div>
                  ))}
               </div>
             </div>

             <button onClick={onClose} className="w-full py-4 bg-nature-100 text-nature-800 font-bold rounded-2xl hover:bg-nature-200 transition-colors">
                Close Tool
             </button>
          </div>
        )}

      </div>
    </div>
  );
};
