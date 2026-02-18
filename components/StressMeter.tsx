
import React from 'react';
import { motion } from 'framer-motion';

interface StressMeterProps {
  conflictCount: number;
}

const StressMeter: React.FC<StressMeterProps> = ({ conflictCount }) => {
  const maxConflicts = 5;
  const percentage = Math.min((conflictCount / maxConflicts) * 100, 100);
  
  let color = 'stroke-teal-500';
  let bgColor = 'bg-teal-50';
  let textColor = 'text-teal-600';
  let status = 'NOMINAL';

  if (conflictCount >= 3) {
    color = 'stroke-rose-500';
    bgColor = 'bg-rose-50';
    textColor = 'text-rose-600';
    status = 'CRITICAL';
  } else if (conflictCount >= 1) {
    color = 'stroke-amber-500';
    bgColor = 'bg-amber-50';
    textColor = 'text-amber-600';
    status = 'WARNING';
  }

  return (
    <div className="flex items-center gap-6 glass-card px-8 py-3 rounded-3xl border border-white shadow-lg overflow-hidden relative group">
      <div className={`absolute top-0 left-0 h-full w-1 ${color.replace('stroke-', 'bg-')} opacity-40`} />
      
      <div className="relative w-14 h-14">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            className="stroke-slate-100"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            className={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={151}
            initial={{ strokeDashoffset: 151 }}
            animate={{ 
              strokeDashoffset: 151 - (151 * percentage) / 100,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[14px] font-black font-orbitron text-slate-700">{conflictCount}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-orbitron tracking-[0.2em] font-black uppercase">System Strain</span>
            <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-1.5 h-1.5 rounded-full ${color.replace('stroke-', 'bg-')}`} 
            />
        </div>
        <p className={`text-[13px] font-black font-orbitron tracking-tighter ${textColor} uppercase italic`}>
          Status: {status}
        </p>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-16 opacity-[0.03] pointer-events-none overflow-hidden flex flex-col justify-between py-2 text-[6px] font-orbitron">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex justify-between px-1">
                <span>000{i}</span>
                <span>SYNC_OK</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StressMeter;
