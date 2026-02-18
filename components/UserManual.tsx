
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  Cpu, 
  Info,
  HelpCircle,
  Hash,
  Activity,
  ChevronRight
} from 'lucide-react';

const ManualSection = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="group space-y-2">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg bg-white border border-slate-100 ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={14} />
      </div>
      <h4 className="text-[10px] font-orbitron font-black text-slate-700 uppercase tracking-widest">{title}</h4>
    </div>
    <p className="text-[11px] text-slate-400 font-medium leading-relaxed pl-8">
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
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={18} className="text-indigo-500" />
          <h3 className="text-[12px] font-orbitron text-slate-400 uppercase tracking-[0.4em] font-black italic">User_Manual</h3>
        </div>

        <div className="space-y-8">
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
            <p className="text-[11px] text-indigo-700 font-bold leading-tight font-orbitron uppercase tracking-tighter">
              Welcome to ZENO OS. You are the Architect of Time. Your objective is to maintain a conflict-free temporal stream.
            </p>
          </div>

          <div className="space-y-6">
            <ManualSection 
              icon={ShieldAlert} 
              title="Temporal Conflicts" 
              color="text-rose-500"
              description="Red-bordered nodes indicate overlapping time vectors. These anomalies drain system stability."
            />
            
            <ManualSection 
              icon={Zap} 
              title="Sync Stream" 
              color="text-indigo-500"
              description="Consume 20 MP to activate the Gemini AI. It calculates optimal permutations to resolve all overlaps instantly."
            />

            <ManualSection 
              icon={Activity} 
              title="Chaos Events" 
              color="text-rose-600"
              description="Chaos nodes are fixed anchors. They CANNOT be moved by the AI. Everything else must shift around them."
            />

            <ManualSection 
              icon={Cpu} 
              title="Reality Sync" 
              color="text-teal-500"
              description="Draft new backlog items into the simulator. Use 'Simulate' to preview how they fit before committing."
            />

            <ManualSection 
              icon={Hash} 
              title="Resource Nodes" 
              color="text-amber-500"
              description="MP (Mana) powers AI operations. Shards are your reward for high-efficiency scheduling. Levels unlock prestige."
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-slate-100 relative z-10">
        <div className="flex items-center justify-between text-[8px] font-orbitron font-black text-slate-300 uppercase tracking-[0.3em]">
          <span>System_Manual_v6.2.0</span>
          <Terminal size={12} />
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -bottom-10 -left-10 opacity-[0.02] rotate-12 pointer-events-none">
        <HelpCircle size={200} />
      </div>
    </motion.div>
  );
};

export default UserManual;
