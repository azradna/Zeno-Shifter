
import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarProps } from 'recharts';
import { PlayerStats } from '../types';
import { BatteryCharging, Sparkles, Zap, ShieldCheck, Activity } from 'lucide-react';

interface SidePanelProps {
  stats: PlayerStats;
  onRecharge: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ stats, onRecharge }) => {
  const radarData = [
    { subject: 'Focus', A: stats.focus, fullMark: 100 },
    { subject: 'Agility', A: stats.agility, fullMark: 100 },
    { subject: 'Zen', A: stats.zen, fullMark: 100 },
    { subject: 'Stability', A: stats.consistency, fullMark: 100 },
    { subject: 'Velocity', A: (stats.agility + stats.focus) / 2, fullMark: 100 },
    { subject: 'Power', A: stats.level * 10, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* XP Card */}
      <div className="bg-white/[0.03] backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-[50px] rounded-full -mr-12 -mt-12 transition-all group-hover:bg-yellow-500/20" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-white/30 font-orbitron uppercase tracking-[0.4em] font-black">Rank status</span>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-yellow-500" />
               </div>
               <h3 className="text-sm font-orbitron text-yellow-500 font-black uppercase tracking-[0.15em] italic">
                 LVL {stats.level} Chronos Architect
               </h3>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] text-white/80 font-orbitron font-black">{stats.xp}</span>
             <p className="text-[7px] text-white/20 font-orbitron uppercase tracking-[0.2em] font-black">Total XP</p>
          </div>
        </div>
        
        <div className="space-y-2">
           <div className="flex justify-between text-[8px] font-orbitron text-white/30 uppercase tracking-widest font-black">
              <span>Next Link Progression</span>
              <span>{Math.floor((stats.xp % 1000 / 1000) * 100)}%</span>
           </div>
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
             <motion.div
               className="h-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
               initial={{ width: 0 }}
               animate={{ width: `${(stats.xp % 1000 / 1000) * 100}%` }}
               transition={{ type: 'spring', damping: 20 }}
             />
           </div>
        </div>
      </div>

      {/* Radar Profile */}
      <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl aspect-square flex flex-col items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[10px] font-orbitron text-white/40 mb-6 uppercase tracking-[0.4em] font-black italic relative z-10 flex items-center gap-2">
          <Activity size={12} className="text-purple-400" /> Neural Spectrum
        </h3>
        <div className="w-full h-full max-h-[240px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#ffffff11" strokeWidth={0.5} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#ffffff33', fontSize: 8, fontFamily: 'Orbitron', fontWeight: 900 }} 
              />
              <Radar
                name="Pilot"
                dataKey="A"
                stroke="#a855f7"
                strokeWidth={2}
                fill="#a855f7"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-20 text-[7px] font-orbitron uppercase tracking-widest pointer-events-none">
           <span>X: {stats.agility}</span>
           <span>Y: {stats.focus}</span>
           <span>Z: {stats.zen}</span>
        </div>
      </div>

      {/* Energy Reserve */}
      <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[70px] -mr-16 -mb-16" />
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-white/30 font-orbitron uppercase tracking-[0.4em] font-black">Reserve status</span>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                  <Zap size={18} className="text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
               </div>
               <h3 className="text-sm font-orbitron text-cyan-400 font-black uppercase tracking-[0.15em] italic">
                 Mana Pool
               </h3>
            </div>
          </div>
          <div className="text-right">
             <span className="text-xl font-orbitron text-white font-black">{stats.mana}</span>
             <span className="text-[9px] text-white/30 font-orbitron font-black uppercase ml-1">MP</span>
          </div>
        </div>
        
        <div className="h-6 w-full bg-black/40 rounded-2xl overflow-hidden border border-cyan-500/10 relative mb-8 p-1">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-700 via-cyan-400 to-blue-600 rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            animate={{ width: `${stats.mana}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
          {stats.mana < 20 && (
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="text-[8px] font-orbitron text-white font-black tracking-[0.5em] uppercase drop-shadow-lg">Energy Critical</span>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRecharge}
          className="w-full py-4 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl text-cyan-400 font-orbitron text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg group italic"
        >
          <BatteryCharging size={18} className="group-hover:animate-bounce" />
          Neural Meditation
        </motion.button>
        
        <div className="mt-6 flex justify-center items-center gap-3 text-white/10">
           <div className="h-[1px] flex-1 bg-white/5" />
           <p className="text-[8px] font-orbitron uppercase tracking-widest whitespace-nowrap">Cost: 20 MP per sync</p>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
