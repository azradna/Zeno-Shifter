
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Clock, 
  Target, 
  Check, 
  X,
  Play,
  Lightbulb,
  Terminal,
  ArrowRight,
  Zap
} from 'lucide-react';

interface BacklogItem {
  id: string;
  title: string;
  duration: number;
  importance: number;
}

interface SuggestHubProps {
  onSimulate: (items: BacklogItem[]) => void;
  isSimulating: boolean;
}

const SuggestHub: React.FC<SuggestHubProps> = ({ onSimulate, isSimulating }) => {
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const [newItem, setNewItem] = useState({ title: '', duration: 1, importance: 3 });

  const addItem = () => {
    if (!newItem.title) return;
    setBacklog([...backlog, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]);
    setNewItem({ title: '', duration: 1, importance: 3 });
  };

  const removeItem = (id: string) => {
    setBacklog(backlog.filter(item => item.id !== id));
  };

  return (
    <div className="glass-card p-8 rounded-[3rem] relative overflow-hidden flex flex-col h-full group">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-[12px] font-orbitron text-teal-600 uppercase tracking-[0.3em] font-black flex items-center gap-3 italic">
            <Lightbulb size={18} className="animate-pulse" />
            Reality Sync
          </h3>
          <p className="text-[10px] text-slate-400 font-orbitron mt-2 uppercase tracking-widest font-black">AI_DRAFTING_PORTAL</p>
        </div>
        {backlog.length > 0 && !isSimulating && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSimulate(backlog)}
            className="flex items-center gap-3 px-5 py-2.5 bg-teal-500 rounded-xl font-orbitron text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:bg-teal-600 transition-all"
          >
            <Play size={12} fill="currentColor" /> SIMULATE
          </motion.button>
        )}
      </div>

      {/* Add Backlog Item form */}
      <div className="space-y-5 mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative z-10">
        <input
          type="text"
          placeholder="New idea..."
          value={newItem.title}
          onChange={e => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-teal-500/50 transition-all font-space-grotesk italic"
        />
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[8px] font-orbitron text-slate-400 uppercase tracking-[0.2em] font-black ml-1">Load (H)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={newItem.duration}
              onChange={e => setNewItem({ ...newItem, duration: parseFloat(e.target.value) })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-500/50 transition-all font-orbitron"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[8px] font-orbitron text-slate-400 uppercase tracking-[0.2em] font-black ml-1">Weight</label>
            <select
              value={newItem.importance}
              onChange={e => setNewItem({ ...newItem, importance: parseInt(e.target.value) })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-500/50 transition-all font-orbitron"
            >
              {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}/5</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addItem}
              className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-100 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Backlog List */}
      <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-3 no-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {backlog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-30">
              <Zap size={32} className="text-slate-200 mb-4" />
              <p className="text-[10px] uppercase font-orbitron tracking-widest font-black italic">Pool Empty</p>
            </div>
          ) : (
            backlog.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-700 font-space-grotesk tracking-tight group-hover:text-teal-600 transition-colors italic">{item.title}</span>
                  <div className="flex gap-4 text-[9px] font-orbitron text-slate-400 uppercase font-black tracking-widest">
                    <span><Clock size={10} className="inline mr-1" /> {item.duration}H</span>
                    <span><Target size={10} className="inline mr-1" /> P:{item.importance}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-rose-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 bg-rose-50 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {isSimulating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center z-50">
          <Cpu className="text-teal-500 animate-spin-slow mb-8" size={64} />
          <p className="text-lg font-orbitron font-black text-teal-600 uppercase tracking-[0.4em] italic">Scanning Permutations...</p>
        </motion.div>
      )}
    </div>
  );
};

export default SuggestHub;
