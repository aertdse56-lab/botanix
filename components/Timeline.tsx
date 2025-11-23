
import React, { useRef } from 'react';
import { Icons } from './Icons';
import { PlantIdentification, PlantUpdate, Language } from '../types';
import { analyzeGrowth } from '../services/geminiService';

interface TimelineProps {
  plantData: PlantIdentification;
  onAddUpdate: (updatedPlant: PlantIdentification) => void;
  language: Language;
}

export const Timeline: React.FC<TimelineProps> = ({ plantData, onAddUpdate, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const newImage = ev.target?.result as string;
      // Get the latest image (either original or last update)
      const lastImage = plantData.updates && plantData.updates.length > 0 
        ? plantData.updates[plantData.updates.length - 1].imageUrl 
        : plantData.imageUrl;

      // Analyze Growth
      const analysis = await analyzeGrowth(lastImage, newImage, language);
      
      const newUpdate: PlantUpdate = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUrl: newImage,
        growthAnalysis: analysis.analysis,
        healthStatus: analysis.status
      };

      const updatedPlant = {
        ...plantData,
        updates: [...(plantData.updates || []), newUpdate]
      };
      
      onAddUpdate(updatedPlant);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-nature-900">Growth Timeline</h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-nature-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-nature-700 transition-all"
        >
          <Icons.Plus size={16} /> Log Update
        </button>
        <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
      </div>

      <div className="relative border-l-2 border-nature-200 ml-4 space-y-8 pb-8">
        {/* Original */}
        <div className="relative pl-8">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-nature-600 border-2 border-white shadow-sm"></div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-nature-100 flex gap-4">
            <img src={plantData.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <div className="text-xs text-nature-500 font-bold uppercase">{new Date(plantData.timestamp).toLocaleDateString()}</div>
              <div className="font-bold text-nature-900">Initial Scan</div>
              <div className="text-sm text-nature-600 mt-1">Plant identified and added to garden.</div>
            </div>
          </div>
        </div>

        {/* Updates */}
        {plantData.updates?.map((update, i) => (
          <div key={update.id} className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent-DEFAULT border-2 border-white shadow-sm"></div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-nature-100 flex flex-col sm:flex-row gap-4">
              <img src={update.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between">
                   <div className="text-xs text-nature-500 font-bold uppercase">{new Date(update.timestamp).toLocaleDateString()}</div>
                   <div className={`text-[10px] px-2 py-0.5 rounded-full ${update.healthStatus.includes('Healthy') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {update.healthStatus}
                   </div>
                </div>
                <div className="font-bold text-nature-900 mt-1">Growth Update</div>
                <p className="text-sm text-nature-600 mt-1 italic">"{update.growthAnalysis}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
