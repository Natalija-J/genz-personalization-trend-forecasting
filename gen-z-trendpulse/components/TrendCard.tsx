import React from 'react';
import { TrendItem } from '../types';
import { TrendingUp, ArrowRight, Lightbulb, Target } from 'lucide-react';
import TrendChart from './TrendChart';

interface TrendCardProps {
  trend: TrendItem;
  onClick: () => void;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, onClick }) => {
  // Determine color based on growth score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#a855f7'; // Purple-500
    if (score >= 60) return '#3b82f6'; // Blue-500
    return '#14b8a6'; // Teal-500
  };

  const accentColor = getScoreColor(trend.growthScore);

  return (
    <div 
      className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
            {trend.category}
          </span>
          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: accentColor }}>
            <TrendingUp size={16} />
            {trend.growthScore}% Growth
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {trend.name}
        </h3>
        <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
          {trend.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Lightbulb size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Product Idea</span>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">{trend.productIdea}</p>
          </div>
          <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Target size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Strategy</span>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">{trend.marketStrategy}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Trajectory</span>
           <button 
            onClick={onClick}
            className="text-xs text-white flex items-center gap-1 hover:underline underline-offset-4"
           >
             View Details <ArrowRight size={12} />
           </button>
        </div>
        <TrendChart data={trend.historicalData} color={accentColor} />
      </div>
    </div>
  );
};

export default TrendCard;
