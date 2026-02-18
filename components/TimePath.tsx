
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { Clock, Zap, AlertTriangle, Target, Activity, Flame, ShieldAlert } from 'lucide-react';

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
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex items-center justify-between text-[8px] font-orbitron text-white/30 uppercase tracking-tighter">
        <span className="flex items-center gap-1"><Icon size={8} className={color} /> {label}</span>
        <span className="text-white/60">{value}/5</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / 5) * 100}%` }}
          className={`h-full ${color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} 
        />
      </div>
    </div>
  );

  return (
    <div className="relative w-full py-16 px-4 md:px-12 min-h-[600px]">
      {/* Central Path Line */}
      <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 overflow-hidden opacity-20 pointer-events-none">
         <div className="h-full w-full bg-gradient-to-b from-purple-500 via-blue-500 to-transparent" />
         <motion.div 
           animate={{ y: ['0%', '100%'] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
           className="absolute top-0 left-0 w-full h-20 bg-white"
         />
      </div>

      <div className="relative flex flex-col items-center gap-12">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => {
            const hasConflict = checkConflict(task);
            const isChaos = task.type === 'Chaos';
            const isLeft = index % 2 === 0;
            const offset = isLeft ? 'md:translate-x-24' : 'md:-translate-x-24';

            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, x: isLeft ? 100 : -100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`group relative w-full max-w-sm ${offset}`}
              >
                {/* Connector Dot */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-purple-500 shadow-[0_0_15px_#a855f7] z-20 group-hover:scale-125 transition-transform" />

                <div className={`
                  relative p-6 rounded-[2rem] backdrop-blur-3xl border transition-all duration-500
                  ${hasConflict ? 'border-red-500/40 bg-red-950/10' : 'border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20'}
                  ${isChaos ? 'ring-2 ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'shadow-2xl'}
                `}>
                  {/* Glowing corner decor */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-xl" />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isChaos ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/5 border border-white/10'}`}>
                        {isChaos ? <ShieldAlert size={16} className="text-white" /> : <Clock size={16} className="text-purple-400" />}
                      </div>
                      <div>
                        <h4 className="font-orbitron font-black text-[13px] tracking-tight truncate max-w-[140px] text-white/90 uppercase">{task.title}</h4>
                        <div className="flex items-center gap-1 text-[9px] text-white/30 font-orbitron uppercase tracking-widest mt-0.5">
                           <Clock size={8} /> {formatTime(task.startTime)} - {task.duration}H
                        </div>
                      </div>
                    </div>
                    <span className={`text-[8px] font-orbitron px-2 py-1 rounded-full border-2 uppercase font-black tracking-widest ${
                      task.type === 'Work' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                      task.type === 'Health' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                      task.type === 'Chaos' ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                    }`}>
                      {task.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <MetricBar value={task.urgency} label="Urgency" icon={Flame} color="text-yellow-400" />
                    <MetricBar value={task.importance} label="Impact" icon={Target} color="text-purple-400" />
                    <MetricBar value={task.energyLevel} label="Energy" icon={Zap} color="text-cyan-400" />
                  </div>

                  {hasConflict && (
                    <motion.div 
                      animate={{ opacity: [0.6, 1, 0.6] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-2 bg-red-500/10 p-2 rounded-xl border border-red-500/20"
                    >
                      <AlertTriangle size={12} /> Temporal Overlap Detected
                    </motion.div>
                  )}
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
