import React from "react";
import { 
  Target, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2,
  ListTodo
} from "lucide-react";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: 'Study' | 'Coding' | 'Reading' | 'Assignment' | 'Personal';
}

const initialGoals: Goal[] = [
  { id: "g-1", text: "Complete SQL DBMS indexing laboratory queries.", completed: false, category: "Assignment" },
  { id: "g-2", text: "Revise process scheduling algorithms & semaphores.", completed: false, category: "Study" },
  { id: "g-3", text: "Solve 1 Medium level Array duplicate coding puzzle on LeetCode.", completed: true, category: "Coding" },
  { id: "g-4", text: "Read 10 pages of Introduction to Algorithms CLRS chapter 4.", completed: false, category: "Reading" }
];

export default function GoalGeneratorTab() {
  const [goals, setGoals] = React.useState<Goal[]>(() => {
    const saved = localStorage.getItem("success_agent_goals");
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [newGoalText, setNewGoalText] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<'Study' | 'Coding' | 'Reading' | 'Assignment' | 'Personal'>('Study');
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  // Save to local storage
  React.useEffect(() => {
    localStorage.setItem("success_agent_goals", JSON.stringify(goals));
  }, [goals]);

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      text: newGoalText.trim(),
      completed: false,
      category: newCategory
    };

    setGoals([...goals, newGoal]);
    setNewGoalText("");
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleGenerateAIGoals = async () => {
    setIsLoadingAI(true);
    // Simulate AI Goals generation
    setTimeout(() => {
      const generated: Goal[] = [
        { id: `g-ai-${Date.now()}-1`, text: "Review Socket Programming in Java and debug connection locks.", completed: false, category: "Study" },
        { id: `g-ai-${Date.now()}-2`, text: "Solve Reverse Linked List problem in groups of K.", completed: false, category: "Coding" },
        { id: `g-ai-${Date.now()}-3`, text: "Complete Operating Systems lab thread synchronization workbook.", completed: false, category: "Assignment" },
        { id: `g-ai-${Date.now()}-4`, text: "Analyze Technical Interview STAR response frameworks.", completed: false, category: "Reading" }
      ];
      setGoals([...generated, ...goals.filter(g => !g.id.startsWith("g-ai-"))]);
      setIsLoadingAI(false);
    }, 1200);
  };

  // Calculations
  const total = goals.length;
  const completed = goals.filter(g => g.completed).length;
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-6" id="goals-generator-tab-container">
      {/* Intro Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
            <Target className="h-5.5 w-5.5 text-emerald-500" /> Dynamic AI Goal Generator & Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Generate and track targeted, modular tasks tailored to your college assignments, coding prep, and general study timeline. Keep your streak alive!
          </p>
        </div>

        <button
          onClick={handleGenerateAIGoals}
          disabled={isLoadingAI}
          className="bg-emerald-800 hover:bg-emerald-950 disabled:bg-slate-300 text-white font-sans font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-3xs"
        >
          {isLoadingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-emerald-300" />}
          <span>Generate New AI Goals</span>
        </button>
      </div>

      {/* Goal Progress Ring/Bar */}
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-5 rounded-xl border border-emerald-800/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] bg-emerald-800 border border-emerald-700 text-emerald-300 px-2.5 py-1 rounded-full font-mono font-bold tracking-wider">
            DAILY GOAL MATRIX
          </span>
          <h3 className="font-display font-bold text-white text-base mt-2.5">Today's Milestone Tracker</h3>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-md">
            You have completed <span className="text-white font-bold">{completed}</span> of your <span className="text-white font-bold">{total}</span> target goals today. Complete them all to trigger a positive evaluation from your academic coach!
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center bg-emerald-900/40 rounded-full border border-emerald-800">
            <span className="text-sm font-mono font-bold text-white">{percent.toFixed(0)}%</span>
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-mono font-bold uppercase">DAILY PROGRESS</div>
            <div className="text-[10px] text-emerald-300 mt-0.5 font-sans font-semibold">
              {percent === 100 ? "🌟 ALL GOALS MASTERED!" : percent >= 50 ? "👍 Good daily momentum!" : "💪 Keep working on it!"}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Add form & list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create Goal Form (4 Columns) */}
        <form onSubmit={handleAddGoal} className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4 h-fit">
          <h3 className="font-display font-semibold text-slate-800 text-sm border-b pb-2 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-emerald-600" /> Add Custom Goal
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Goal Description</label>
            <input
              type="text"
              required
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="e.g., Read CLRS chapter 5 on recurrence trees"
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Category Label</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="Study">Study Focus</option>
              <option value="Coding">Coding Practice</option>
              <option value="Reading">Reading Target</option>
              <option value="Assignment">Assignment Due</option>
              <option value="Personal">Personal Routine</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-sans font-medium py-2.5 rounded-lg text-xs cursor-pointer transition shadow-3xs"
          >
            Create Custom Goal
          </button>
        </form>

        {/* Right Side: Goal Checklist (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <ListTodo className="h-4.5 w-4.5 text-emerald-500" /> Active Goal Checklist
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold">Active Tracker</span>
          </div>

          <div className="divide-y divide-slate-100">
            {goals.length === 0 ? (
              <p className="p-8 text-center border border-dashed rounded-lg text-slate-400 text-xs">
                All daily goals cleared! Click "Generate New AI Goals" to pull suggestions.
              </p>
            ) : (
              goals.map((g) => (
                <div 
                  key={g.id}
                  className={`py-3.5 flex items-start justify-between gap-4 group transition px-1 rounded-lg hover:bg-slate-50/50
                    ${g.completed ? "opacity-60 bg-emerald-50/10" : ""}
                  `}
                >
                  <div 
                    onClick={() => toggleGoal(g.id)}
                    className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                  >
                    <span className="mt-0.5 text-slate-400 group-hover:text-emerald-700 transition">
                      {g.completed ? (
                        <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300" />
                      )}
                    </span>

                    <div className="text-xs">
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold font-mono rounded uppercase tracking-wider
                        ${g.category === "Coding" ? "bg-indigo-100 text-indigo-700" : g.category === "Study" ? "bg-emerald-100 text-emerald-700" : g.category === "Reading" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}
                      `}>
                        {g.category}
                      </span>
                      <p className={`mt-1 font-sans font-medium text-slate-700 leading-relaxed ${g.completed ? 'line-through text-slate-400' : ''}`}>
                        {g.text}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition shrink-0 opacity-0 group-hover:opacity-100"
                    title="Delete Goal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
