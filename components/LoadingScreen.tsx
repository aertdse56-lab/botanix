import React from 'react';
import { Icons } from './Icons';

interface LoadingScreenProps {
  text: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ text }) => (
  <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 rounded-full border-4 border-nature-100"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-nature-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-nature-500 animate-pulse">
        <Icons.Leaf size={32} />
      </div>
    </div>
    <div className="text-nature-900 font-bold text-xl tracking-tight animate-pulse">
      {text}
    </div>
    <div className="mt-2 text-nature-500 text-sm font-medium">
      AI Analysis in progress...
    </div>
  </div>
);