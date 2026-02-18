
import { GoogleGenAI, Type } from "@google/genai";
import { Task, PriorityRule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const resolveConflicts = async (tasks: Task[], globalRule: PriorityRule): Promise<Task[]> => {
  let strategyDescription = "";
  
  switch(globalRule) {
    case 'urgency':
      strategyDescription = "GLOBAL STRATEGY: URGENCY. Prioritize tasks with high 'urgency'. Treat urgent tasks as immutable and shift non-urgent tasks to the earliest possible open slots.";
      break;
    case 'importance':
      strategyDescription = "GLOBAL STRATEGY: STRATEGIC IMPACT. Prioritize tasks with high 'importance'. Ensure high-impact tasks occupy optimal day slots. Move low-importance tasks to accommodate them.";
      break;
    case 'energy':
      strategyDescription = "GLOBAL STRATEGY: ENERGY FLOW. Distribute 'energyLevel' 4-5 tasks so they aren't clumped. Use low energy tasks as buffers.";
      break;
    default:
      strategyDescription = "Balanced optimization across all metrics.";
  }

  const prompt = `
    You are ZENO, a Master of Temporal Mechanics. Your goal is to resolve all scheduling overlaps in the provided task list.
    
    SYSTEM DIRECTIVES:
    1. ZERO TOLERANCE FOR OVERLAPS: No two tasks can occupy the same time slot. 
    2. ANCHOR CHAOS NODES: Tasks with type 'Chaos' are temporal emergencies. They are FIXED ANCHORS. Do NOT move them unless absolutely impossible to resolve otherwise. Move ALL OTHER tasks around them.
    3. PRIORITY HIERARCHY: ${strategyDescription}
    4. TIME BOUNDARIES: Work only within 07:00 and 23:00.
    5. DATA INTEGRITY: Do not change the 'date', 'id', 'duration', or 'title' of any task. Only modify 'startTime'.
    
    Current Tasks (with conflicts):
    ${JSON.stringify(tasks)}
    
    Return a valid JSON array of ALL input tasks with resolved 'startTime' values.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              startTime: { type: Type.NUMBER },
              duration: { type: Type.NUMBER },
              type: { type: Type.STRING },
              urgency: { type: Type.NUMBER },
              importance: { type: Type.NUMBER },
              energyLevel: { type: Type.NUMBER },
              manaCost: { type: Type.NUMBER },
              priority: { type: Type.NUMBER },
            },
            required: ["id", "title", "date", "startTime", "duration", "type", "urgency", "importance", "energyLevel", "manaCost", "priority"]
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      console.log("ZENO Sync Result:", result);
      return result;
    }
    return tasks;
  } catch (error) {
    console.error("Gemini Resolution Error:", error);
    return fallbackResolver(tasks);
  }
};

export const suggestTasks = async (
  currentTasks: Task[], 
  backlog: { title: string; duration: number; importance: number }[],
  globalRule: PriorityRule,
  date: string
): Promise<Task[]> => {
  const prompt = `
    You are ZENO, an AI Temporal Simulation Engine.
    Current Schedule for ${date}: ${JSON.stringify(currentTasks)}.
    Items to Integrate: ${JSON.stringify(backlog)}.
    
    Strategy: ${globalRule}.
    
    Task:
    1. Integrate backlog items into the timeline.
    2. Shift existing tasks if necessary to fit high-importance items.
    3. Ensure no overlaps.
    4. Boundaries: 07:00 to 23:00.
    
    Output the COMPLETE merged list of all Task objects in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 12000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              startTime: { type: Type.NUMBER },
              duration: { type: Type.NUMBER },
              type: { type: Type.STRING },
              urgency: { type: Type.NUMBER },
              importance: { type: Type.NUMBER },
              energyLevel: { type: Type.NUMBER },
              manaCost: { type: Type.NUMBER },
              priority: { type: Type.NUMBER },
              date: { type: Type.STRING }
            },
            required: ["id", "title", "startTime", "duration", "type", "urgency", "importance", "energyLevel", "manaCost", "priority", "date"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return currentTasks;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return currentTasks;
  }
};

function fallbackResolver(tasks: Task[]): Task[] {
  // Sort: Chaos first, then importance + urgency
  const sorted = [...tasks].sort((a, b) => {
    if (a.type === 'Chaos' && b.type !== 'Chaos') return -1;
    if (b.type === 'Chaos' && a.type !== 'Chaos') return 1;
    return (b.importance + b.urgency) - (a.importance + a.urgency);
  });

  const resolved: Task[] = [];
  let currentEnd = 7.0; // Start day at 7 AM

  sorted.forEach(task => {
    let start = Math.max(currentEnd, 7.0);
    // If it's chaos, try to keep it where it was if possible, otherwise move after
    if (task.type === 'Chaos') {
      // Very naive logic just to ensure no overlap in fallback
      resolved.push({ ...task, startTime: start });
    } else {
      resolved.push({ ...task, startTime: start });
    }
    currentEnd = start + task.duration;
  });

  return resolved;
}
