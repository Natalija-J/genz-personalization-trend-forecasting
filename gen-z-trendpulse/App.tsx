import React, { useState, useEffect } from 'react';
import { Category, TrendItem } from './types';
import { fetchTrends } from './services/gemini';
import TrendCard from './components/TrendCard';
import { LayoutDashboard, Shirt, Smartphone, Coffee, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.FASHION);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);

  // Initial load
  useEffect(() => {
    loadTrends(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount for default category

  const loadTrends = async (category: Category) => {
    setLoading(true);
    setActiveCategory(category);
    setTrends([]); // Clear current to show loading state nicely
    setSelectedTrend(null);
    try {
      const data = await fetchTrends(category);
      setTrends(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load trends. Please check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: Category.FASHION, icon: <Shirt size={18} /> },
    { label: Category.TECH, icon: <Smartphone size={18} /> },
    { label: Category.LIFESTYLE, icon: <Coffee size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-purple-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/50">
              TP
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Gen Z <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">TrendPulse</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => loadTrends(item.label)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === item.label
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
            <button 
              onClick={() => loadTrends(activeCategory)}
              disabled={loading}
              className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh Trends"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => loadTrends(item.label)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeCategory === item.label
                ? 'bg-zinc-800 border-zinc-700 text-white'
                : 'bg-transparent border-transparent text-zinc-500'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Predicting the Next Big Thing in <span className="text-purple-400">{activeCategory}</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            AI-powered insights derived from real-time search data. Discover what Gen Z is obsessed with today and what they'll buy tomorrow.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[500px] bg-zinc-900 rounded-2xl border border-zinc-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trends.map((trend) => (
              <TrendCard 
                key={trend.id} 
                trend={trend} 
                onClick={() => setSelectedTrend(trend)}
              />
            ))}
            
            {trends.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                 <p className="text-zinc-500">No trends found. Try refreshing.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Trend Details Modal / Overlay */}
      {selectedTrend && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedTrend(null)}
          ></div>
          <div className="relative bg-zinc-900 border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <span className="text-purple-400 text-sm font-bold tracking-wider uppercase mb-1 block">
                    {selectedTrend.category} Trend Forecast
                   </span>
                   <h2 className="text-3xl font-bold text-white">{selectedTrend.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedTrend(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500" />
                    Prediction
                  </h4>
                  <p className="text-zinc-300 leading-relaxed bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                    {selectedTrend.prediction}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                    <h5 className="text-purple-300 font-semibold mb-2 text-sm uppercase tracking-wide">Market Strategy</h5>
                    <p className="text-zinc-300 text-sm">{selectedTrend.marketStrategy}</p>
                  </div>
                  <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                    <h5 className="text-blue-300 font-semibold mb-2 text-sm uppercase tracking-wide">Product Concept</h5>
                    <p className="text-zinc-300 text-sm">{selectedTrend.productIdea}</p>
                  </div>
                </div>

                {selectedTrend.sources && selectedTrend.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sources & References</h4>
                    <ul className="space-y-2">
                      {selectedTrend.sources.map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400 transition-colors group p-2 rounded-lg hover:bg-zinc-800"
                          >
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            <span className="truncate">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 sticky bottom-0">
               <button 
                 onClick={() => setSelectedTrend(null)}
                 className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
               >
                 Close Analysis
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
