
import React from 'react';
import { Icons } from './Icons';
import { PLANT_TOOLS } from '../utils/toolsConfig';
import { PlantTool } from '../types';

interface ToolboxProps {
  onSelectTool: (tool: PlantTool) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ onSelectTool }) => {
  const categories = [
    { id: 'health', label: 'Diagnostics', icon: Icons.Stethoscope, color: 'text-red-500' },
    { id: 'care', label: 'Smart Care', icon: Icons.Sprout, color: 'text-green-500' },
    { id: 'environment', label: 'Environment', icon: Icons.Sun, color: 'text-orange-500' },
    { id: 'growth', label: 'Growth', icon: Icons.TrendingUp, color: 'text-blue-500' },
    { id: 'fun', label: 'Social & Safety', icon: Icons.Smile, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {categories.map(cat => {
        const tools = PLANT_TOOLS.filter(t => t.category === cat.id);
        if (tools.length === 0) return null;

        return (
          <div key={cat.id} className="animate-slide-up">
            <div className="flex items-center gap-2 mb-4 px-2">
              <cat.icon size={20} className={cat.color} />
              <h3 className="font-bold text-nature-800 uppercase tracking-wider text-sm">{cat.label}</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tools.map(tool => {
                const Icon = (Icons as any)[tool.iconName] || Icons.Sprout;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="bg-white p-4 rounded-2xl border border-nature-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 h-full group"
                  >
                    <div className="w-10 h-10 rounded-full bg-nature-50 flex items-center justify-center text-nature-600 group-hover:bg-nature-600 group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-nature-900 text-sm leading-tight mb-1">{tool.name}</div>
                      <div className="text-[10px] text-nature-500 leading-tight">{tool.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
