
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  Cpu, 
  Hash,
  Activity,
  Layers
} from 'lucide-react';

const ManualSection = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="group relative pl-8 pb-6 border-l border-slate-100 last:pb-0">
    <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-white ${color.replace('text-', 'bg-')} shadow-sm group-hover:scale-125 transition-transform`} />
    <div className="flex items-center gap-2 mb-1.5">
      <Icon size={14} className={`${color} opacity-80`} />
      <h4 className="text-[10px] font-orbitron font-black text-slate-800 uppercase tracking-widest">{title}</h4>
    </div>
    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
      {description}
    </p>
  </div>
);

const UserManual: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-8 rounded-[3rem] relative overflow-hidden flex flex-col gap-8 h-full hud-border"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
              <Layers size={18} />
            </div>
            <h3 className="text-[11px] font-orbitron text-slate-400 uppercase tracking-[0.3em] font-black italic">Protocol_Guide</h3>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="w-1 h-1 rounded-full bg-indigo-400" />
          </div>
        </div>

        <div className="mb-10">
          <p className="text-[11px] text-slate-600 font-semibold leading-relaxed font-space-grotesk border-l-2 border-indigo-500 pl-4 py-1 italic">
            You are the Architect of Time. Maintain a conflict-free temporal stream to maximize system stability.
          </p>
        </div>

        <div className="space-y-2 flex-1">
          <ManualSection 
            icon={ShieldAlert} 
            title="Conflicts" 
            color="text-rose-500"
            description="Red nodes indicate overlaps. These temporal anomalies drain system energy and focus."
          />
          
          <ManualSection 
            icon={Zap} 
            title="Syncing" 
            color="text-indigo-500"
            description="Uses 20 MP. Gemini AI calculates the optimal resolution for all active temporal overlaps."
          />

          <ManualSection 
            icon={Activity} 
            title="Chaos" 
            color="text-rose-600"
            description="Fixed anchors that cannot be moved. Use them as base points for your scheduling."
          />

          <ManualSection 
            icon={Cpu} 
            title="Simulation" 
            color="text-teal-500"
            description="Draft ideas in the simulator to preview impact before committing them to reality."
          />

          <ManualSection 
            icon={Hash} 
            title="Prestige" 
            color="text-amber-500"
            description="Earn Shards for efficiency. Higher Levels unlock advanced temporal processing capabilities."
          />
        </div>

        <div className="mt-12 pt-6 border-t border-slate-50 flex items-center justify-between opacity-40">
          <span className="text-[8px] font-orbitron font-black text-slate-400 uppercase tracking-[0.4em]">ZENO_LOG_v6.2</span>
          <Terminal size={12} className="text-slate-400" />
        </div>
      </div>

      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <svg width="100%" height="100%">
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>
    </motion.div>
  );
};

export default UserManual;
