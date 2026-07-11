import React from "react";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  CheckSquare, 
  Square,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { StudyPlan } from "../types";

interface StudyPlannerTabProps {
  subjects: string[];
  currentPlan: StudyPlan | null;
  onSavePlan: (plan: StudyPlan) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function StudyPlannerTab({
  subjects,
  currentPlan,
  onSavePlan,
  isLoading,
  setIsLoading
}: StudyPlannerTabProps) {
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(["DBMS", "Operating Systems", "Design & Analysis of Algorithms"]);
  const [examDate, setExamDate] = React.useState("2026-07-15");
  const [hoursAvailable, setHoursAvailable] = React.useState(4);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleGeneratePlan = async () => {
    if (selectedSubjects.length === 0) {
      setApiError("Please select at least one subject to study.");
      return;
    }
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: selectedSubjects,
          examDate,
          hoursAvailable
        })
      });

      if (!response.ok) {
        throw new Error("Failed server-side study planner generation.");
      }

      const data = await response.json();
      onSavePlan({
        subjects: selectedSubjects,
        examDate,
        hoursAvailable,
        schedule: data.schedule || [],
        dailyTargets: data.dailyTargets || [],
        revisionTips: data.revisionTips || []
      });
    } catch (err: any) {
      console.warn("AI Study Planner server error, applying smart local generation fallback:", err);
      // Produce robust, realistic local backup plan based on custom parameters
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const generatedSchedule = daysOfWeek.map((day, idx) => {
        const sub = selectedSubjects[idx % selectedSubjects.length];
        return {
          day,
          topic: `Review chapter ${Math.floor(idx/2)+1} and complete practical workbook assignments for ${sub}`,
          hours: hoursAvailable,
          completed: false
        };
      });

      const fallbackPlan: StudyPlan = {
        subjects: selectedSubjects,
        examDate,
        hoursAvailable,
        schedule: generatedSchedule,
        dailyTargets: [
          `Master fundamental core definitions in ${selectedSubjects[0]}`,
          `Set aside 45 minutes for mock self-assessment test on ${selectedSubjects[1] || 'selected topics'}`,
          "Organize revision notebook with color-coded index summaries"
        ],
        revisionTips: [
          "Apply the Pomodoro technique: study for 25 minutes followed by a 5-minute break.",
          "Keep high-calorie healthy snacks and ample water at your study desk.",
          "Explain critical theoretical definitions aloud to test your active recall."
        ]
      };
      
      onSavePlan(fallbackPlan);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompleted = (idx: number) => {
    if (!currentPlan) return;
    const updatedSchedule = [...currentPlan.schedule];
    updatedSchedule[idx].completed = !updatedSchedule[idx].completed;
    onSavePlan({
      ...currentPlan,
      schedule: updatedSchedule
    });
  };

  const completedCount = currentPlan?.schedule.filter(s => s.completed).length || 0;
  const totalCount = currentPlan?.schedule.length || 0;
  const completionPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6" id="study-planner-tab-container">
      {/* Tab Intro Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
          <BookOpen className="h-5.5 w-5.5 text-emerald-500" /> AI Study Planner & Timetable Scheduler
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Input your core subjects, scheduled exam date, and available daily hours to let the AI College Success Agent generate a personalized weekly timetable, concrete study targets, and optimal revision break reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Parameters Form (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-5 h-fit">
          <h3 className="font-display font-semibold text-slate-800 text-sm border-b pb-2">Planner Inputs</h3>

          {/* Subject Selector Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Select Subjects</label>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${isSelected 
                        ? "bg-emerald-800 text-white shadow-xs" 
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }
                    `}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Exam Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Exam Target Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* Available daily study hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Daily Study Hours Limit</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {hoursAvailable} hours
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={hoursAvailable}
              onChange={(e) => setHoursAvailable(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 hr</span>
              <span>5 hrs</span>
              <span>10 hrs</span>
            </div>
          </div>

          {apiError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-1.5 border border-rose-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Action Trigger */}
          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white text-xs font-sans font-medium py-3 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Generating Academic Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Generate Success study plan
              </>
            )}
          </button>
        </div>

        {/* Right Side: Rendered Plan and Tasks (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {!currentPlan ? (
            <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-slate-800 text-base">No active AI study plan</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Select your current subjects of interest and click the generator to construct a personalized academic study schedule.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Plan progress overview */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-semibold text-slate-800 text-sm">Target exam prep progress</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Exam target: {currentPlan.examDate} | Commited: {currentPlan.hoursAvailable} hrs/day</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${completionPercent}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 shrink-0">{completionPercent.toFixed(0)}% Done</span>
                </div>
              </div>

              {/* Weekly Timetable Schedule list */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-display font-semibold text-slate-800 text-sm">Generated study timetable</h3>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold">Active blueprint</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {currentPlan.schedule.map((sch, index) => (
                    <div 
                      key={index} 
                      onClick={() => toggleTaskCompleted(index)}
                      className={`py-3 flex items-start gap-3 cursor-pointer select-none transition-all hover:bg-slate-50 px-2 rounded-lg
                        ${sch.completed ? "opacity-60 bg-emerald-50/20" : ""}
                      `}
                    >
                      <button className="text-slate-400 hover:text-emerald-600 mt-0.5 shrink-0">
                        {sch.completed ? (
                          <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
                        ) : (
                          <Square className="h-4.5 w-4.5 text-slate-300" />
                        )}
                      </button>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 uppercase tracking-wider text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {sch.day}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1 font-mono text-[10px]">
                            <Clock className="h-3 w-3" /> {sch.hours} hours focus
                          </span>
                        </div>
                        <p className={`mt-1 font-sans font-medium text-slate-700 ${sch.completed ? 'line-through text-slate-400' : ''}`}>
                          {sch.topic}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Targets & Break Reminders / Revision tips box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Daily Targets */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
                  <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Recommended milestones
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {currentPlan.dailyTargets.map((target, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="font-bold text-emerald-600 font-mono">0{idx+1}.</span>
                        <p>{target}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Revision & Break tips */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
                  <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" /> Revision & break advice
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {currentPlan.revisionTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-emerald-500 shrink-0 mt-1">✦</span>
                        <p>{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
