import React, { useState, useRef } from 'react';
import { Icons } from './Icons';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  labels: any;
  isOffline?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, labels, isOffline = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
      event.target.value = '';
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 1920;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        onImageSelected(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInteraction = (type: 'camera' | 'upload') => {
    if (isOffline) return;
    if (type === 'camera') cameraInputRef.current?.click();
    else fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-sm mx-auto perspective-1000">
      <div 
        className={`relative glass rounded-3xl p-8 transition-all duration-500 transform ${isHovered && !isOffline ? 'scale-[1.02] shadow-glow' : 'shadow-glass'} ${isOffline ? 'grayscale' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center text-center">
          
          <div className="mb-6 relative group cursor-pointer" onClick={() => handleInteraction('camera')}>
            <div className={`absolute inset-0 bg-gradient-to-tr from-nature-500 to-accent-light rounded-full blur-xl opacity-30 transition-opacity duration-500 ${isOffline ? 'hidden' : 'group-hover:opacity-60 animate-pulse-slow'}`}></div>
            <div className={`relative w-24 h-24 rounded-full p-0.5 ${isOffline ? 'bg-gray-300' : 'bg-gradient-to-tr from-nature-500 to-accent-light'}`}>
               <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  {isOffline ? (
                     <Icons.WifiOff size={40} className="text-gray-400" />
                  ) : (
                     <Icons.Camera size={40} className="text-transparent bg-clip-text bg-gradient-to-tr from-nature-600 to-accent-DEFAULT" />
                  )}
               </div>
            </div>
            {!isOffline && (
              <div className="absolute -bottom-2 -right-2 bg-white text-nature-600 rounded-full p-2 shadow-lg border border-nature-100">
                 <Icons.Scan size={16} />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nature-800 to-nature-600 mb-2">
            {isOffline ? labels.scanOffline : labels.scanTitle}
          </h2>
          <p className="text-nature-600/70 text-sm mb-8 leading-relaxed">
            {isOffline ? labels.offlineDesc : labels.scanSubtitle}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button 
               onClick={() => handleInteraction('camera')}
               disabled={isOffline}
               className={`w-full font-semibold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isOffline 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-nature-600 to-nature-500 text-white shadow-nature-500/30 hover:shadow-nature-500/50 hover:-translate-y-0.5'
               }`}
            >
              <Icons.Camera size={20} />
              {labels.cameraBtn}
            </button>
            
            <button 
               onClick={() => handleInteraction('upload')}
               disabled={isOffline}
               className={`w-full font-semibold py-4 rounded-2xl border transition-colors flex items-center justify-center gap-2 ${
                  isOffline
                  ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-nature-600 border-nature-100 hover:bg-nature-50'
               }`}
            >
              <Icons.Upload size={20} />
              {labels.uploadBtn}
            </button>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={isOffline} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} disabled={isOffline} />
    </div>
  );
};
