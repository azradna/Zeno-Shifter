
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
  Activity,
  Award,
  Maximize2
} from 'lucide-react';
import { INITIAL_TASKS, CHAOS_EVENTS } from './constants';
import { Task, PlayerStats, PriorityRule, TaskType } from './types';
import { resolveConflicts, suggestTasks } from './services/geminiService';
import StressMeter from './components/StressMeter';
import SidePanel from './components/SidePanel';
import TimePath from './components/TimePath';
import CustomCursor from './components/CustomCursor';
import SuggestHub from './components/SuggestHub';
import UserManual from './components/UserManual';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedRule, setSelectedRule] = useState<PriorityRule>('urgency');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
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
    shards: 120,
  });
  const [isResolving, setIsResolving] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; msg: string; xp: number; shards?: number }[]>([]);

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

  const dailyTasks = useMemo(() => tasks.filter(t => t.date === selectedDate), [tasks, selectedDate]);
  const dayLoad = useMemo(() => Math.min((dailyTasks.length / 10) * 100, 100), [dailyTasks]);

  const addToast = (msg: string, xp: number, shards: number = 0) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, xp, shards }]);
    setStats(prev => ({ 
      ...prev, 
      xp: prev.xp + xp,
      shards: prev.shards + shards,
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
    addToast("New Node Anchored", 50, 5);
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
    addToast("Temporal Chaos Injected!", 100, 20);
  };

  const handleResolve = async () => {
    if (isResolving) return;
    if (stats.mana < 20) {
      addToast("Reactor Low! Meditate.", 0);
      return;
    }
    
    setIsResolving(true);
    try {
      const otherTasks = tasks.filter(t => t.date !== selectedDate);
      const resolvedDaily = await resolveConflicts(dailyTasks, selectedRule);
      setTasks([...otherTasks, ...resolvedDaily]);
      addToast(`Timeline Sync Optimized`, 250, 50);
      setStats(prev => ({
        ...prev,
        mana: Math.max(prev.mana - 20, 0),
      }));
    } catch (err) {
      addToast("Sync Protocol Failure", 0);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSimulate = async (backlog: any[]) => {
    if (isSimulating || stats.mana < 30) {
      addToast("Insufficient Aether (30 MP)", 0);
      return;
    }
    setIsSimulating(true);
    try {
      const suggestion = await suggestTasks(dailyTasks, backlog, selectedRule, selectedDate);
      setSuggestionPreview(suggestion);
      addToast("Simulation Strategy Found", 100, 15);
      setStats(prev => ({ ...prev, mana: Math.max(0, prev.mana - 30) }));
    } catch (err) {
      addToast("Simulation Matrix Error", 0);
    } finally {
      setIsSimulating(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestionPreview) return;
    const otherTasks = tasks.filter(t => t.date !== selectedDate);
    setTasks([...otherTasks, ...suggestionPreview]);
    setSuggestionPreview(null);
    addToast("Reality Rewrite Applied", 300, 100);
  };

  const handleRecharge = () => {
    if (stats.mana >= 100) return;
    setStats(prev => ({ ...prev, mana: Math.min(prev.mana + 30, 100) }));
    addToast("Reactor Core Charging", 25, 2);
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
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) return "CURRENT";
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  return (
    <div className="min-h-screen relative text-slate-700 selection:bg-indigo-100 selection:text-indigo-900">
      <CustomCursor />

      <header className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-3xl border-b border-white px-10 py-5">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-[0_15px_35px_rgba(99,102,241,0.3)] border border-white/40 group-hover:rotate-6 transition-transform">
                <Dna className="text-white" size={32} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 border-4 border-white rounded-full" />
            </div>
            <div>
              <h1 className="text-4xl font-orbitron font-black tracking-tighter text-slate-800 uppercase italic">ZENO</h1>
              <div className="flex items-center gap-2 mt-0.5 opacity-60">
                 <div className="w-1.5 h-3 bg-indigo-500 rounded-full animate-pulse" />
                 <p className="text-[10px] font-orbitron text-slate-500 tracking-[0.4em] uppercase font-black">Temporal OS v6.2</p>
              </div>
            </div>
          </div>

          <StressMeter conflictCount={getConflictCount()} />

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end opacity-40">
                <span className="text-[8px] font-orbitron font-black uppercase tracking-widest">Reactor_Core: ONLINE</span>
                <span className="text-[8px] font-orbitron font-black uppercase tracking-widest">Link_Quality: 98%</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-md"
            >
              <Settings size={24} />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto pt-48 pb-40 px-10">
        <div className="mb-20">
          <div className="flex items-center gap-5 mb-8">
             <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-200" />
             <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm">
                <CalendarIcon size={14} className="text-indigo-500" />
                <span className="text-[10px] font-orbitron font-black uppercase tracking-[0.4em] text-slate-500">Coordinate Map</span>
             </div>
             <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-200" />
          </div>
          <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-hide no-scrollbar -mx-4 px-4">
            {calendarDates.map((date) => (
              <motion.button
                key={date}
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDate(date);
                  setSuggestionPreview(null);
                }}
                className={`flex-shrink-0 w-32 p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${
                  selectedDate === date 
                    ? 'bg-white border-indigo-500 shadow-2xl' 
                    : 'bg-white/40 border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'
                }`}
              >
                {selectedDate === date && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />}
                <p className={`text-[10px] font-orbitron mb-3 font-black tracking-widest ${selectedDate === date ? 'text-indigo-500' : 'text-slate-400'}`}>
                  {formatDateLabel(date)}
                </p>
                <p className={`text-2xl font-orbitron font-black ${selectedDate === date ? 'text-slate-800' : 'text-slate-400'}`}>
                  {date.split('-')[2]}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-8">
          <div className="lg:col-span-3 xl:col-span-2 order-1">
            <UserManual />
          </div>

          <div className="lg:col-span-3 xl:col-span-3 space-y-8 order-3 lg:order-2">
            <SidePanel stats={stats} onRecharge={handleRecharge} dayLoad={dayLoad} />
            <SuggestHub onSimulate={handleSimulate} isSimulating={isSimulating} />
          </div>

          <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-3">
            <AnimatePresence mode="wait">
              {suggestionPreview ? (
                <motion.div
                  key="suggestion-mode"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="mb-12 p-10 bg-teal-50 border-2 border-teal-200 rounded-[4rem] shadow-2xl relative overflow-hidden hud-border"
                >
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-teal-500 rounded-3xl shadow-[0_10px_30px_rgba(20,184,166,0.3)]">
                        <Maximize2 size={28} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-orbitron font-black text-teal-800 uppercase italic tracking-tighter">Reality Preview</h2>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setSuggestionPreview(null)} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                        <X size={28} />
                      </button>
                      <button onClick={applySuggestion} className="flex items-center gap-4 px-10 py-5 bg-teal-600 rounded-3xl font-orbitron text-[13px] font-black uppercase text-white shadow-xl hover:bg-teal-700 transition-all border border-teal-400/50">
                        <CheckCircle2 size={18} /> Merge Reality
                      </button>
                    </div>
                  </div>
                  <TimePath tasks={suggestionPreview} />
                </motion.div>
              ) : (
                <div key="standard-mode">
                  <div className="flex items-center justify-between mb-16 glass-card p-8 rounded-[3rem] shadow-xl hud-border">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-orbitron font-black flex items-center gap-5 uppercase tracking-[0.1em] text-slate-800">
                        <Sparkles size={24} className="text-indigo-500 animate-pulse" />
                        Temporal Stream
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddingTask(true)}
                      className="flex items-center gap-4 px-9 py-5 bg-indigo-600 rounded-3xl font-orbitron text-[13px] font-black uppercase text-white shadow-2xl border border-indigo-400 hover:bg-indigo-700 transition-all"
                    >
                      <PlusCircle size={22} /> Anchor Node
                    </motion.button>
                  </div>
                  {dailyTasks.length > 0 ? (
                    <TimePath tasks={dailyTasks} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/20 rounded-[5rem] border-2 border-dashed border-slate-200">
                      <Terminal className="text-slate-200 mb-8" size={64} />
                      <p className="text-lg font-orbitron text-slate-300 uppercase tracking-[0.6em] font-black text-center">Empty Horizon</p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-12 xl:col-span-2 order-4">
            <div className="sticky top-48 space-y-8">
              <div className="glass-card p-10 rounded-[4rem] shadow-xl relative overflow-hidden hud-border">
                <h3 className="text-[13px] font-orbitron text-slate-400 mb-12 uppercase tracking-[0.4em] font-black italic">Command Core</h3>
                <div className="space-y-5">
                  {['urgency', 'importance', 'energy'].map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRule(id as PriorityRule)}
                      className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                        selectedRule === id ? 'bg-white border-indigo-500 shadow-xl' : 'bg-white/40 border-transparent opacity-50'
                      }`}
                    >
                      <span className="font-orbitron text-[11px] font-black uppercase tracking-[0.1em] text-slate-700">{id}</span>
                    </button>
                  ))}
                </div>
                <div className="h-[1px] bg-slate-100 my-10" />
                <div className="space-y-6">
                  <button onClick={injectChaos} className="w-full flex items-center justify-between p-5 rounded-3xl bg-rose-50 border border-rose-100 text-rose-500 font-orbitron text-[11px] font-black uppercase tracking-widest shadow-md">
                    <span>Chaos</span>
                    <Flame size={18} />
                  </button>
                  <button
                    onClick={handleResolve}
                    disabled={isResolving || stats.mana < 20 || dailyTasks.length === 0}
                    className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-indigo-600 text-white font-orbitron text-[12px] font-black uppercase tracking-[0.2em] shadow-xl disabled:bg-slate-100 disabled:text-slate-300"
                  >
                    <span>{isResolving ? 'Resolving' : 'Sync Stream'}</span>
                    <RefreshCcw size={18} className={isResolving ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingTask(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100 hud-border">
              <button onClick={() => setIsAddingTask(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-800 transition-all">
                 <X size={40} />
              </button>
              <h2 className="text-4xl font-orbitron font-black text-slate-800 uppercase tracking-tighter mb-12 italic">Anchor Node</h2>
              <form onSubmit={handleAddTask} className="space-y-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-orbitron font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Title</label>
                    <input required autoFocus value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Operation designation..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-2xl focus:border-indigo-500 focus:outline-none transition-all font-space-grotesk placeholder:opacity-30" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-orbitron font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Temporal Date</label>
                      <input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-[14px] font-orbitron font-black text-slate-700" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-orbitron font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Start Vector (H)</label>
                      <input type="number" min="7" max="23" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-[14px] font-orbitron font-black text-slate-700" />
                   </div>
                </div>
                <button type="submit" className="w-full py-8 rounded-[2.5rem] bg-indigo-600 text-white font-orbitron font-black text-lg uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-700 transition-all border border-indigo-400">Deploy Link</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-12 right-12 z-[200] flex flex-col gap-6 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 100, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.9 }} className="bg-white/90 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.1)] border border-white flex items-center gap-8 min-w-[420px]">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-inner">
                <Award size={32} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-black text-slate-800 uppercase tracking-tighter font-orbitron italic">{toast.msg}</p>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <p className="text-[12px] text-indigo-600 font-black font-orbitron tracking-widest">+{toast.xp} XP</p>
                  </div>
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
