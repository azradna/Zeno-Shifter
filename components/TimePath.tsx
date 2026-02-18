
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { Clock, Zap, AlertTriangle, Target, Activity, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface TimePathProps {
  tasks: Task[];
}

const TimePath: React.FC<TimePathProps> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.startTime - b.startTime);

  const checkConflict = (task: Task) => {
    return tasks.some(t => 
      t.id !== task.id && 
      ((task.startTime >= t.startTime && task.startTime < t.startTime + t.duration) ||
      (task.startTime + task.duration > t.startTime && task.startTime + task.duration <= t.startTime + t.duration))
    );
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const mins = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const MetricBar = ({ value, label, icon: Icon, color }: { value: number, label: string, icon: any, color: string }) => (
    <div className="flex flex-col gap-1.5 flex-1">
      <div className="flex items-center justify-between text-[7px] font-orbitron text-slate-400 uppercase tracking-widest font-black">
        <span className="flex items-center gap-1"><Icon size={9} className={color} /> {label}</span>
        <span className="text-slate-600">{value}/5</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / 5) * 100}%` }}
          className={`h-full ${color.replace('text-', 'bg-')} shadow-sm`} 
        />
      </div>
    </div>
  );

  return (
    <div className="relative w-full py-16 px-4 md:px-12 min-h-[600px]">
      {/* Central Conduit Line */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-slate-200 pointer-events-none" />
      <div className="absolute left-1/2 top-0 h-full w-[6px] -translate-x-1/2 overflow-hidden opacity-30 pointer-events-none blur-sm">
         <div className="h-full w-full bg-gradient-to-b from-indigo-500 via-teal-500 to-indigo-500" />
      </div>

      <div className="relative flex flex-col items-center gap-16">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => {
            const hasConflict = checkConflict(task);
            const isChaos = task.type === 'Chaos';
            const isLeft = index % 2 === 0;
            const offset = isLeft ? 'md:translate-x-32' : 'md:-translate-x-32';

            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, x: isLeft ? 100 : -100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative w-full max-w-md ${offset}`}
              >
                {/* Visual Connector Dot */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-md group-hover:scale-125 transition-transform" />
                    <div className="absolute w-full h-[1px] bg-slate-200 -z-10" style={{ [isLeft ? 'right' : 'left']: '50%', width: '128px' }} />
                </div>

                <div className={`
                  relative p-8 rounded-[2.5rem] glass-card border-2 transition-all duration-500 hud-border
                  ${hasConflict ? 'border-rose-400 bg-rose-50/70' : 'border-white hover:border-indigo-200'}
                  ${isChaos ? 'shadow-[0_20px_50px_rgba(244,63,94,0.1)]' : 'shadow-xl'}
                `}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isChaos ? 'bg-rose-500 text-white shadow-lg' : 'bg-indigo-50 text-indigo-500'} transition-transform group-hover:rotate-12`}>
                        {isChaos ? <ShieldAlert size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-orbitron font-black text-[15px] text-slate-800 uppercase italic tracking-tight">{task.title}</h4>
                            {isChaos && <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-orbitron animate-pulse">EMERGENCY</span>}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-orbitron uppercase tracking-[0.1em] mt-1 font-bold">
                           <Activity size={10} className="text-indigo-400" /> {formatTime(task.startTime)} <span className="opacity-30">|</span> {task.duration}H DURATION
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 mb-3">
                    <MetricBar value={task.urgency} label="Urgency" icon={Flame} color="text-amber-500" />
                    <MetricBar value={task.importance} label="Impact" icon={Target} color="text-rose-500" />
                    <MetricBar value={task.energyLevel} label="Aether" icon={Zap} color="text-teal-500" />
                  </div>

                  {hasConflict && (
                    <motion.div 
                      animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-3 bg-white/60 p-3 rounded-2xl border border-rose-200 shadow-sm"
                    >
                      <AlertTriangle size={14} /> Temporal Conflict Detected
                    </motion.div>
                  )}

                  {/* Corner Technical Detail */}
                  <div className="absolute top-4 right-8 opacity-[0.05] pointer-events-none font-orbitron text-[8px] font-black tracking-widest">
                    NODE_ID: {task.id.slice(-4).toUpperCase()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimePath;
