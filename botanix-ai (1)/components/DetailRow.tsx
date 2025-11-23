import React from 'react';

export const DetailRow = ({ label, value, icon: Icon }: any) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-4 py-3 border-b border-nature-50 last:border-0 hover:bg-nature-50/50 rounded-lg px-2 transition-colors">
      <div className="text-nature-400"><Icon size={18} /></div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
           <div className="text-xs font-bold text-nature-400 uppercase tracking-wide">{label}</div>
           <div className="text-nature-800 text-sm font-medium text-right ml-4">{value}</div>
        </div>
      </div>
    </div>
  );
};