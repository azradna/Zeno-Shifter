
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerStats } from '../types';
import { BatteryCharging, Sparkles, Zap, ShieldCheck, Activity, Coins, Waves, Box } from 'lucide-react';

interface SidePanelProps {
  stats: PlayerStats;
  onRecharge: () => void;
  dayLoad: number; 
}

const SidePanel: React.FC<SidePanelProps> = ({ stats, onRecharge, dayLoad }) => {
  const getDensityStatus = () => {
    if (dayLoad > 70) return { label: 'PEAK LOAD', color: 'text-rose-500', bar: 'bg-gradient-to-t from-rose-500 to-rose-300' };
    if (dayLoad > 30) return { label: 'OPTIMAL', color: 'text-teal-500', bar: 'bg-gradient-to-t from-teal-500 to-teal-300' };
    return { label: 'LOW FLOW', color: 'text-indigo-500', bar: 'bg-gradient-to-t from-indigo-500 to-indigo-300' };
  };

  const status = getDensityStatus();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quantum Shards Display */}
      <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden hud-border group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-white flex items-center justify-center text-amber-500 shadow-inner border border-amber-100 group-hover:scale-110 transition-transform">
              <Coins size={28} />
           </div>
           <div>
              <p className="text-[10px] font-orbitron text-slate-400 font-bold uppercase tracking-[0.2em]">Quantum Shards</p>
              <h3 className="text-2xl font-orbitron font-black text-slate-800 tracking-tight">{stats.shards.toLocaleString()}</h3>
           </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.04] text-amber-600 rotate-12">
            <Box size={100} />
        </div>
      </div>

      {/* Rank & XP */}
      <div className="glass-card p-8 rounded-[3rem] relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 font-orbitron uppercase tracking-[0.3em] font-black">Operator Profile</span>
            <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-indigo-500" />
               <h3 className="text-[13px] font-orbitron text-slate-700 font-black uppercase tracking-wider italic">
                 Level {stats.level} Architect
               </h3>
            </div>
          </div>
          <div className="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
             <span className="text-[11px] font-orbitron text-indigo-600 font-black">{stats.xp} <span className="text-[8px] opacity-60">XP</span></span>
          </div>
        </div>
        
        <div className="h-3 w-full bg-slate-100/50 rounded-full overflow-hidden p-1 border border-slate-200/50 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp % 1000 / 1000) * 100}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>

      {/* Density Gauge */}
      <div className="glass-card p-8 rounded-[3rem] flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-orbitron text-slate-400 uppercase tracking-[0.3em] font-black italic flex items-center gap-2">
                <Waves size={14} className="text-teal-500" /> Temporal Stream
            </h3>
            <span className={`text-[10px] font-orbitron font-black ${status.color}`}>{Math.round(dayLoad)}%</span>
        </div>
        
        <div className="relative w-full h-44 bg-slate-100/30 rounded-[2rem] border border-slate-200/40 flex items-end p-2.5 overflow-hidden shadow-inner">
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(dayLoad, 5)}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                className={`w-full rounded-[1.5rem] shadow-2xl ${status.bar} relative overflow-hidden`}
            >
                <div className="shimmer absolute inset-0 opacity-20" />
                <motion.div 
                    animate={{ y: [0, -5, 0], scaleY: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute top-0 left-0 w-full h-12 bg-white/30 blur-xl rounded-full"
                />
            </motion.div>
            
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 py-8 opacity-20">
               {[1, 2, 3, 4].map(v => (
                 <div key={v} className="border-t border-slate-400 w-full" />
               ))}
            </div>
        </div>

        <div className="mt-6 text-center">
            <p className={`text-[11px] font-orbitron font-black uppercase tracking-[0.4em] ${status.color} italic`}>
               {status.label}
            </p>
            <div className="h-[1px] w-12 bg-slate-200 mx-auto mt-2" />
        </div>
      </div>

      {/* Mana Hub */}
      <div className="glass-card p-8 rounded-[3rem] relative overflow-hidden hud-border">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 font-orbitron uppercase tracking-[0.3em] font-black">Reactor Level</span>
            <div className="flex items-center gap-3">
               <Zap size={18} className="text-teal-500" />
               <h3 className="text-[13px] font-orbitron text-slate-700 font-black uppercase tracking-wider italic">
                 Aether Fuel
               </h3>
            </div>
          </div>
          <div className="text-right">
             <span className="text-2xl font-orbitron text-slate-800 font-black tracking-tighter">{stats.mana}</span>
             <span className="text-[10px] text-teal-600 font-black uppercase ml-1">MP</span>
          </div>
        </div>
        
        <div className="h-5 w-full bg-slate-100/50 rounded-2xl overflow-hidden p-1.5 border border-slate-200/50 shadow-inner mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl shadow-lg"
            animate={{ width: `${stats.mana}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRecharge}
          className="w-full py-5 bg-white border border-slate-200 rounded-2xl text-teal-600 font-orbitron text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:border-teal-200"
        >
          <BatteryCharging size={20} className="animate-pulse" />
          Meditation Protocol
        </motion.button>
      </div>
    </div>
  );
};

export default SidePanel;
