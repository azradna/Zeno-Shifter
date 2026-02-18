
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Settings, 
  Terminal, 
  ChevronRight,
  Plus,
  Target,
  Clock,
  BatteryCharging,
  X,
  PlusCircle,
  Dna,
  RefreshCcw,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { INITIAL_TASKS, CHAOS_EVENTS } from './constants';
import { Task, PlayerStats, PriorityRule, TaskType } from './types';
import { resolveConflicts, suggestTasks } from './services/geminiService';
import StressMeter from './components/StressMeter';
import SidePanel from './components/SidePanel';
import TimePath from './components/TimePath';
import CustomCursor from './components/CustomCursor';
import SuggestHub from './components/SuggestHub';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedRule, setSelectedRule] = useState<PriorityRule>('urgency');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Suggestion State
  const [isSimulating, setIsSimulating] = useState(false);
  const [suggestionPreview, setSuggestionPreview] = useState<Task[] | null>(null);

  const [stats, setStats] = useState<PlayerStats>({
    focus: 65,
    agility: 40,
    consistency: 80,
    zen: 50,
    mana: 80,
    xp: 250,
    level: 1,
  });
  const [isResolving, setIsResolving] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; msg: string; xp: number }[]>([]);

  const [newTask, setNewTask] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: 9,
    duration: 1,
    type: 'Work' as TaskType,
    urgency: 3,
    importance: 3,
    energyLevel: 3
  });

  // Filter tasks for current date
  const dailyTasks = useMemo(() => tasks.filter(t => t.date === selectedDate), [tasks, selectedDate]);

  const addToast = (msg: string, xp: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, xp }]);
    setStats(prev => ({ 
      ...prev, 
      xp: prev.xp + xp,
      level: Math.floor((prev.xp + xp) / 1000) + 1 
    }));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const getConflictCount = useCallback(() => {
    let count = 0;
    const sorted = [...dailyTasks].sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];
        if (a.startTime + a.duration > b.startTime) {
          count++;
          break;
        }
      }
    }
    return count;
  }, [dailyTasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
      manaCost: newTask.energyLevel * 10,
      priority: Math.round((newTask.importance + newTask.urgency) / 2)
    };

    setTasks(prev => [...prev, task]);
    setIsAddingTask(false);
    setNewTask({ ...newTask, title: '', urgency: 3, importance: 3, energyLevel: 3 });
    addToast("New Timeline Node Anchored", 50);
  };

  const injectChaos = () => {
    const randomEvent = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
    const targetTime = dailyTasks.length > 0 ? dailyTasks[Math.floor(Math.random() * dailyTasks.length)].startTime : 10;
    
    const chaosTask: Task = {
      id: `chaos-${Date.now()}`,
      ...randomEvent,
      date: selectedDate,
      startTime: targetTime,
    };

    setTasks(prev => [...prev, chaosTask]);
    addToast("Anomalous Signal Injected", 75);
  };

  const handleResolve = async () => {
    if (isResolving) return;
    if (stats.mana < 20) {
      addToast("Insufficient Mana! Meditate to recover.", 0);
      return;
    }
    
    setIsResolving(true);
    
    try {
      const otherTasks = tasks.filter(t => t.date !== selectedDate);
      const resolvedDaily = await resolveConflicts(dailyTasks, selectedRule);
      
      setTasks([...otherTasks, ...resolvedDaily]);
      addToast(`${selectedRule.toUpperCase()} Optimization Complete`, 250);
      setStats(prev => ({
        ...prev,
        zen: Math.min(prev.zen + 10, 100),
        mana: Math.max(prev.mana - 20, 0),
        agility: Math.min(prev.agility + 12, 100),
        focus: Math.min(prev.focus + 5, 100)
      }));
    } catch (err) {
      addToast("Resolution Matrix Failure", 0);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSimulate = async (backlog: any[]) => {
    if (isSimulating || stats.mana < 30) {
      addToast("Insufficient Mana for Simulation (30 Required)", 0);
      return;
    }
    
    setIsSimulating(true);
    try {
      const suggestion = await suggestTasks(dailyTasks, backlog, selectedRule, selectedDate);
      setSuggestionPreview(suggestion);
      addToast("Simulation Ready for Review", 100);
      setStats(prev => ({ ...prev, mana: Math.max(0, prev.mana - 30) }));
    } catch (err) {
      addToast("Simulation Engine Failure", 0);
    } finally {
      setIsSimulating(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestionPreview) return;
    const otherTasks = tasks.filter(t => t.date !== selectedDate);
    setTasks([...otherTasks, ...suggestionPreview]);
    setSuggestionPreview(null);
    addToast("Simulated Reality Applied", 300);
    setStats(prev => ({ ...prev, consistency: Math.min(100, prev.consistency + 10) }));
  };

  const handleRecharge = () => {
    if (stats.mana >= 100) {
      addToast("Energy Pool at Maximum", 0);
      return;
    }
    setStats(prev => ({
      ...prev,
      mana: Math.min(prev.mana + 30, 100),
      zen: Math.min(prev.zen + 5, 100)
    }));
    addToast("Meditating... Mana Restored", 25);
  };

  const handleClearTimeline = () => {
    setTasks(tasks.filter(t => t.date !== selectedDate));
    setIsSettingsOpen(false);
    addToast("Daily Temporal Buffer Cleared", 0);
  };

  const calendarDates = useMemo(() => {
    const dates = [];
    for (let i = -2; i < 12; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "TODAY";
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className="min-h-screen relative">
      <CustomCursor />

      {/* Decorative HUD Elements */}
      <div className="fixed top-24 left-10 pointer-events-none opacity-20 hidden 2xl:block">
        <div className="flex flex-col gap-4 font-orbitron text-[10px] uppercase tracking-widest text-white/50">
          <div className="flex items-center gap-2"><Cpu size={14} /> System.Core: ACTIVE</div>
          <div className="flex items-center gap-2"><Layers size={14} /> Layer.Sync: 100%</div>
          <div className="flex items-center gap-2"><Activity size={14} /> Latency: 22ms</div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-8 py-4">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.3)] relative group cursor-help">
              <Dna className="text-white group-hover:scale-110 transition-transform" size={32} />
              <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-black tracking-tighter text-white uppercase italic">ZENO</h1>
              <div className="flex items-center gap-2 opacity-50">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[9px] font-orbitron text-purple-400 tracking-[0.4em] uppercase font-bold">Temporal OS v5.2</p>
              </div>
            </div>
          </div>

          <StressMeter conflictCount={getConflictCount()} />

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end mr-6 border-r border-white/10 pr-6">
              <span className="text-[9px] font-orbitron text-white/30 uppercase tracking-[0.3em] font-black">Neural Link Status</span>
              <span className="text-xs font-orbitron text-cyan-400 font-black tracking-widest">STABLE_CONNECTION</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all shadow-xl"
            >
              <Settings size={22} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto pt-40 pb-40 px-8">
        
        {/* Temporal Hub (Calendar) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <CalendarIcon size={16} className="text-purple-400" />
              </div>
              <span className="text-xs font-orbitron font-black uppercase tracking-[0.5em] text-white/60 italic">Solar Cycle Hub</span>
            </div>
            <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4">
            {calendarDates.map((date) => (
              <motion.button
                key={date}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDate(date);
                  setSuggestionPreview(null);
                }}
                className={`flex-shrink-0 w-28 p-4 rounded-[1.5rem] border-2 transition-all relative overflow-hidden group ${
                  selectedDate === date 
                    ? 'bg-purple-600/20 border-purple-500/60 shadow-[0_15px_30px_rgba(147,51,234,0.25)]' 
                    : 'bg-white/5 border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:border-white/20'
                }`}
              >
                {selectedDate === date && (
                   <motion.div layoutId="cal-glow" className="absolute inset-0 bg-purple-500/5 blur-2xl" />
                )}
                <p className={`text-[9px] font-orbitron mb-2 font-black tracking-widest ${selectedDate === date ? 'text-purple-400' : 'text-white/40'}`}>
                  {formatDateLabel(date)}
                </p>
                <p className={`text-xl font-orbitron font-black ${selectedDate === date ? 'text-white' : 'text-white/40'}`}>
                  {date.split('-')[2]}
                </p>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Stats & Suggest */}
          <div className="lg:col-span-3 space-y-10 order-2 lg:order-1">
            <SidePanel stats={stats} onRecharge={handleRecharge} />
            <SuggestHub onSimulate={handleSimulate} isSimulating={isSimulating} />
          </div>

          {/* Center Column: Timeline */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {suggestionPreview ? (
                <motion.div
                  key="suggestion-mode"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="mb-10 p-8 bg-cyan-950/20 border-2 border-cyan-500/30 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.1)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px]" />
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-cyan-500 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                        <Eye size={24} className="text-black" />
                      </div>
                      <div>
                        <h2 className="text-xl font-orbitron font-black text-cyan-400 uppercase tracking-tighter italic">Simulated Reality</h2>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                           <p className="text-[10px] text-cyan-500/60 font-orbitron uppercase tracking-[0.3em] font-bold">Awaiting User Confirmation</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSuggestionPreview(null)}
                        className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white border border-white/10 transition-all hover:bg-white/10"
                      >
                        <X size={24} />
                      </button>
                      <button 
                        onClick={applySuggestion}
                        className="flex items-center gap-3 px-8 py-3.5 bg-cyan-500 rounded-2xl font-orbitron text-[11px] font-black uppercase text-black shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
                      >
                        <CheckCircle2 size={16} /> Merge Timelines
                      </button>
                    </div>
                  </div>
                  <TimePath tasks={suggestionPreview} />
                </motion.div>
              ) : (
                <div key="standard-mode">
                  <div className="flex items-center justify-between mb-12 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
                    <div className="flex flex-col">
                      <h2 className="text-base font-orbitron font-black flex items-center gap-4 uppercase tracking-[0.3em] text-white/90">
                        <Sparkles size={20} className="text-purple-400 animate-pulse" />
                        Active Stream
                      </h2>
                      <div className="flex items-center gap-2 mt-2 ml-9">
                         <div className="w-1 h-3 bg-purple-500/50 rounded-full" />
                         <span className="text-[10px] text-white/40 font-orbitron uppercase tracking-widest font-black">Coordinate: {selectedDate}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNewTask({ ...newTask, date: selectedDate });
                        setIsAddingTask(true);
                      }}
                      className="flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-orbitron text-[11px] font-black uppercase shadow-[0_20px_40px_rgba(147,51,234,0.3)] border border-white/20 hover:shadow-[0_20px_40px_rgba(147,51,234,0.5)] transition-all"
                    >
                      <PlusCircle size={18} /> Add Node
                    </motion.button>
                  </div>
                  
                  {dailyTasks.length > 0 ? (
                    <TimePath tasks={dailyTasks} />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 bg-white/[0.03] rounded-[4rem] border-2 border-dashed border-white/5"
                    >
                      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 relative">
                        <Terminal className="text-white/10" size={40} />
                        <motion.div 
                           animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                           transition={{ repeat: Infinity, duration: 2 }}
                           className="absolute inset-0 bg-purple-500 rounded-full blur-2xl"
                        />
                      </div>
                      <p className="text-sm font-orbitron text-white/20 uppercase tracking-[0.5em] text-center px-12 italic">Void detected in current coordinates.</p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setNewTask({ ...newTask, date: selectedDate });
                          setIsAddingTask(true);
                        }}
                        className="mt-10 px-8 py-3 text-[11px] font-orbitron text-purple-400 font-black uppercase tracking-[0.3em] flex items-center gap-3 bg-purple-500/5 rounded-full border border-purple-500/20 hover:bg-purple-500/10 transition-all"
                      >
                        <Plus size={16} /> Initiate Path
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Protocols */}
          <div className="lg:col-span-3 order-3">
            <div className="sticky top-40 space-y-10">
              <div className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 blur-[80px] -mr-20 -mt-20" />
                
                <h3 className="text-[12px] font-orbitron text-white/40 mb-10 uppercase tracking-[0.4em] font-black italic">Strategic Matrix</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'urgency', label: 'Urgency Matrix', icon: Clock, color: 'text-yellow-400', desc: 'Favors Immediate Deadlines' },
                    { id: 'importance', label: 'Impact Scaling', icon: Target, color: 'text-rose-400', desc: 'Strategic Value Focus' },
                    { id: 'energy', label: 'Energy Balancing', icon: BatteryCharging, color: 'text-cyan-400', desc: 'Metabolic Optimization' }
                  ].map((rule) => (
                    <motion.button
                      key={rule.id}
                      whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.06)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRule(rule.id as PriorityRule)}
                      className={`w-full flex flex-col gap-1 p-5 rounded-[1.5rem] border-2 transition-all text-left relative overflow-hidden ${
                        selectedRule === rule.id 
                          ? 'bg-purple-600/10 border-purple-500/40' 
                          : 'bg-white/[0.02] border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${selectedRule === rule.id ? rule.color : 'text-white/20'}`}>
                           <rule.icon size={18} />
                        </div>
                        <span className={`font-orbitron text-[11px] font-black uppercase tracking-[0.15em] ${selectedRule === rule.id ? 'text-white' : 'text-white/40'}`}>
                          {rule.label}
                        </span>
                      </div>
                      <span className={`text-[9px] mt-2 ml-12 font-space-grotesk font-medium tracking-wider ${selectedRule === rule.id ? 'text-white/40' : 'text-white/10'}`}>
                        {rule.desc}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

                <div className="space-y-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={injectChaos}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group transition-all hover:bg-red-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-500/20 rounded-lg group-hover:animate-pulse">
                         <Flame size={18} />
                      </div>
                      <span className="font-orbitron text-[11px] font-black uppercase tracking-[0.2em]">Chaos Engine</span>
                    </div>
                    <ChevronRight size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={stats.mana >= 20 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={stats.mana >= 20 ? { scale: 0.98 } : {}}
                    onClick={handleResolve}
                    disabled={isResolving || stats.mana < 20 || dailyTasks.length === 0}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 font-orbitron text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-700 relative overflow-hidden group
                      ${isResolving 
                        ? 'bg-purple-900/40 border-purple-500/30 cursor-wait text-white/50' 
                        : (stats.mana < 20 || dailyTasks.length === 0)
                        ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 border-white/20 text-white shadow-[0_20px_50px_rgba(147,51,234,0.4)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <Zap className={isResolving ? 'animate-spin' : 'animate-pulse'} size={24} />
                      <span>{isResolving ? 'SYNCHING...' : stats.mana < 20 ? 'LOW ENERGY' : 'EXECUTE SYNC'}</span>
                    </div>
                    <Sparkles size={20} className="relative z-10" />
                    {!isResolving && stats.mana >= 20 && (
                       <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                       />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#080808] border border-white/10 p-12 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10">
                <button onClick={() => setIsAddingTask(false)} className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                  <X size={28} />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-12">
                <div className="p-4 bg-purple-500/20 rounded-3xl border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <Plus size={32} className="text-purple-400" />
                </div>
                <div>
                   <h2 className="text-4xl font-orbitron font-black text-white uppercase tracking-tighter italic">Anchor Node</h2>
                   <p className="text-xs text-white/30 font-orbitron uppercase tracking-widest mt-1">Initializing temporal sequence</p>
                </div>
              </div>

              <form onSubmit={handleAddTask} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-orbitron text-white/40 uppercase tracking-[0.4em] font-black ml-1">Sequence Identifier</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Operation Name..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-space-grotesk text-2xl placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-orbitron text-white/40 uppercase tracking-[0.4em] font-black ml-1">Coordinate Date</label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-orbitron text-xs"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-orbitron text-white/40 uppercase tracking-[0.4em] font-black ml-1">Time Vector (H)</label>
                    <input
                      type="number"
                      min="7"
                      max="22"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: parseFloat(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-orbitron text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-8 bg-white/[0.02] p-8 rounded-[3rem] border border-white/5">
                  <p className="text-[11px] font-orbitron text-white/20 uppercase tracking-[0.4em] font-black mb-6 text-center italic">Metric Load configuration</p>
                  {[
                    { key: 'urgency', label: 'Urgency Matrix', icon: Flame, color: 'text-yellow-400' },
                    { key: 'importance', label: 'Strategic Impact', icon: Target, color: 'text-rose-500' },
                    { key: 'energyLevel', label: 'Metabolic Load', icon: Zap, color: 'text-cyan-400' },
                  ].map((metric) => (
                    <div key={metric.key} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-orbitron text-white/60 uppercase tracking-widest font-black flex items-center gap-4">
                          <div className={`p-1.5 rounded-lg bg-black/40 ${metric.color}`}>
                             <metric.icon size={16} />
                          </div>
                          {metric.label}
                        </label>
                        <span className="text-sm font-orbitron text-white font-black">{newTask[metric.key as keyof typeof newTask]}/5</span>
                      </div>
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={newTask[metric.key as keyof typeof newTask]}
                          onChange={(e) => setNewTask({ ...newTask, [metric.key]: parseInt(e.target.value) })}
                          className="w-full accent-purple-500 h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-6 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 font-orbitron text-base font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(147,51,234,0.4)] border border-white/20 italic"
                >
                  Deploy Sequence
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-end p-0 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full md:w-[480px] h-full md:h-auto bg-[#0a0a0a] border-l md:border border-white/10 p-12 md:rounded-[4rem] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div>
                   <h2 className="text-2xl font-orbitron font-black text-white uppercase flex items-center gap-4 italic tracking-tighter">
                    <Settings className="text-purple-400" size={32} />
                    Control Panel
                  </h2>
                  <p className="text-[10px] font-orbitron text-white/30 uppercase tracking-[0.3em] mt-2">Zeno Terminal Interface</p>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={32} />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-[11px] font-orbitron text-white/50 mb-6 uppercase tracking-[0.3em] font-black italic">Buffer Maintenance</h3>
                  <button 
                    onClick={handleClearTimeline}
                    className="w-full flex items-center gap-5 p-5 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl transition-all font-orbitron text-[11px] font-black uppercase tracking-[0.2em] shadow-lg group"
                  >
                    <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                       <Trash2 size={20} />
                    </div>
                    Purge Coordinate Nodes
                  </button>
                </div>

                <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                  <h3 className="text-[11px] font-orbitron text-white/50 mb-8 uppercase tracking-[0.3em] font-black italic">System Brief</h3>
                  <div className="space-y-6">
                    <div className="flex gap-5 items-start">
                      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-lg"><BatteryCharging size={18} className="text-cyan-400" /></div>
                      <div>
                        <p className="text-[11px] text-white font-black uppercase font-orbitron tracking-widest">Metabolic Pool</p>
                        <p className="text-[10px] text-white/30 leading-relaxed font-medium mt-1 uppercase tracking-tight">Sync operations require computational mana. replenishment protocols available in HUD.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[9px] font-orbitron text-white/10 text-center uppercase tracking-[0.8em] font-black">CORE_VER_5.2.1-RELEASE</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="fixed bottom-12 right-12 z-[200] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-black/80 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 min-w-[360px] neon-ghost"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Sparkles size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-black text-white uppercase tracking-tight font-orbitron italic">{toast.msg}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_#a855f7]" 
                    />
                  </div>
                  <p className="text-[11px] text-purple-400 font-black font-orbitron tracking-widest whitespace-nowrap">+{toast.xp} XP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
