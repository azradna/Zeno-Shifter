
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
  ArrowRight
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
    <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl flex flex-col h-full group">
      {/* Decorative scanning line */}
      <motion.div 
         animate={{ top: ['0%', '100%', '0%'] }}
         transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
         className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-0 pointer-events-none"
      />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-[12px] font-orbitron text-cyan-400 uppercase tracking-[0.3em] font-black flex items-center gap-3 italic">
            <Lightbulb size={18} className="text-cyan-400 animate-pulse" />
            Simulator Hub
          </h3>
          <p className="text-[10px] text-white/30 font-orbitron mt-2 uppercase tracking-widest font-black">AI_DRAFTING_PORTAL</p>
        </div>
        {backlog.length > 0 && !isSimulating && (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSimulate(backlog)}
            className="flex items-center gap-3 px-5 py-2.5 bg-cyan-500 rounded-xl font-orbitron text-[10px] font-black uppercase tracking-widest text-black shadow-lg transition-all"
          >
            <Play size={12} fill="currentColor" /> SIMULATE
          </motion.button>
        )}
      </div>

      {/* Add Backlog Item form */}
      <div className="space-y-5 mb-10 p-6 bg-black/40 rounded-[2rem] border border-white/5 relative z-10">
        <div className="flex items-center gap-2 mb-2 text-[9px] font-orbitron text-white/30 uppercase tracking-widest">
           <Terminal size={10} /> Reality_Seed_Input
        </div>
        <input
          type="text"
          placeholder="Enter concept identifier..."
          value={newItem.title}
          onChange={e => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-all font-space-grotesk italic"
        />
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[8px] font-orbitron text-white/30 uppercase tracking-[0.2em] font-black ml-1">Load (H)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={newItem.duration}
              onChange={e => setNewItem({ ...newItem, duration: parseFloat(e.target.value) })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all font-orbitron"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[8px] font-orbitron text-white/30 uppercase tracking-[0.2em] font-black ml-1">Priority</label>
            <select
              value={newItem.importance}
              onChange={e => setNewItem({ ...newItem, importance: parseInt(e.target.value) })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all font-orbitron appearance-none"
            >
              {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}/5</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addItem}
              className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Backlog List */}
      <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-3 no-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {backlog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-10">
              <Cpu size={40} className="mb-4" />
              <p className="text-[11px] uppercase font-orbitron tracking-[0.5em] font-black italic">Simulation Pool Empty</p>
            </div>
          ) : (
            backlog.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-white/80 font-space-grotesk tracking-tight group-hover:text-cyan-400 transition-colors italic">{item.title}</span>
                  <div className="flex gap-4 text-[9px] font-orbitron text-white/30 uppercase font-black tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock size={10} className="text-cyan-500/50" /> {item.duration}H</span>
                    <span className="flex items-center gap-1.5"><Target size={10} className="text-cyan-500/50" /> P:{item.importance}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-red-400/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 bg-red-500/5 rounded-xl border border-red-500/0 hover:border-red-500/30"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {isSimulating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center z-50"
        >
          <div className="relative mb-10">
            <Cpu className="text-cyan-400 animate-spin-slow" size={64} />
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full"
            />
            <div className="absolute inset-[-10px] border-2 border-cyan-500/20 rounded-full border-t-cyan-500 animate-spin" />
          </div>
          <div className="space-y-3">
             <p className="text-lg font-orbitron font-black text-cyan-400 uppercase tracking-[0.4em] italic">Temporal Mapping...</p>
             <p className="text-[10px] text-white/40 font-orbitron uppercase tracking-widest max-w-[240px] leading-relaxed">Analyzing billions of timeline permutations to identify optimal node placement.</p>
          </div>
          <div className="mt-10 w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
             />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SuggestHub;
