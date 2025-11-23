
import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';

export const LightMeter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lux, setLux] = useState<number>(0);
  const [status, setStatus] = useState<string>("Analyzing...");
  const [recommendation, setRecommendation] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: any;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        interval = setInterval(() => {
          analyzeLight();
        }, 500);
      } catch (err) {
        console.error("Camera access denied", err);
        setStatus("Camera Error");
      }
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      clearInterval(interval);
    };
  }, []);

  const analyzeLight = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    ctx?.drawImage(videoRef.current, 0, 0, 100, 100);
    
    const imageData = ctx?.getImageData(0, 0, 100, 100);
    if (!imageData) return;

    let totalBrightness = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Perceived brightness formula
      totalBrightness += (0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2]);
    }
    
    const avgBrightness = totalBrightness / (imageData.data.length / 4);
    // Rough approximation of Lux from pixel brightness (not scientifically accurate but useful relative metric)
    const estimatedLux = Math.round(avgBrightness * 2.5); 
    setLux(estimatedLux);

    if (estimatedLux < 50) {
      setStatus("Low Light");
      setRecommendation("Too dark for most plants. Good for Snake Plant, ZZ Plant.");
    } else if (estimatedLux < 150) {
      setStatus("Medium Light");
      setRecommendation("Good for Pothos, Ferns, Peace Lily.");
    } else {
      setStatus("Bright Light");
      setRecommendation("Great for Succulents, Ficus, Herbs.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center p-6 w-full max-w-md text-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 mb-6">
          <Icons.SunMedium size={64} className={lux > 150 ? "text-yellow-400" : "text-white"} />
        </div>
        
        <h2 className="text-5xl font-bold mb-2 font-mono">{lux}</h2>
        <p className="text-sm uppercase tracking-widest mb-6 opacity-70">Relative Lux Index</p>
        
        <div className={`text-2xl font-bold mb-2 ${lux > 150 ? "text-yellow-400" : lux > 50 ? "text-green-400" : "text-gray-400"}`}>
          {status}
        </div>
        <p className="mb-8 max-w-xs">{recommendation}</p>
        
        <button onClick={onClose} className="px-8 py-3 bg-white text-black rounded-full font-bold">
          Close Light Meter
        </button>
      </div>
    </div>
  );
};
