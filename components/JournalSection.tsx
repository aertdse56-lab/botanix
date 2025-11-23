import React from 'react';

interface JournalSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ title, children, icon: Icon, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-glass border border-white/50 overflow-hidden ${className}`}>
    <div className="px-6 py-5 border-b border-nature-50 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-nature-100 to-nature-50 rounded-xl text-nature-600">
         {Icon && <Icon size={20} />}
      </div>
      <h3 className="text-lg font-bold text-nature-900 tracking-tight">
        {title}
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);