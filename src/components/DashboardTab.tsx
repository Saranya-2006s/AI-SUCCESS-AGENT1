import React from "react";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Target, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { 
  StudentProfile, 
  AttendanceRecord, 
  Assignment, 
  ClassSchedule, 
  ExtraAIScoring 
} from "../types";

interface DashboardTabProps {
  profile: StudentProfile;
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  schedule: ClassSchedule[];
  aiScoring: ExtraAIScoring;
  setActiveTab: (tab: string) => void;
  isLoadingAI: boolean;
  onRefreshAI: () => void;
}

export default function DashboardTab({
  profile,
  attendanceRecords,
  assignments,
  schedule,
  aiScoring,
  setActiveTab,
  isLoadingAI,
  onRefreshAI
}: DashboardTabProps) {
  
  // Calculate average attendance
  const totalAttended = attendanceRecords.reduce((acc, rec) => acc + rec.attended, 0);
  const totalClasses = attendanceRecords.reduce((acc, rec) => acc + rec.total, 0);
  const averageAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  // Find pending assignments
  const pendingAssignments = assignments.filter(a => a.status === "Pending");
  
  // Get today's classes
  const getDayOfWeekName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // For realistic campus testing, we will use "Thursday" as default if it is weekend
    const currentDay = days[new Date().getDay()];
    return currentDay === "Saturday" || currentDay === "Sunday" ? "Monday" : currentDay;
  };

  const todayName = getDayOfWeekName();
  const todaysClasses = schedule.filter(s => s.day.toLowerCase() === todayName.toLowerCase());

  return (
    <div className="space-y-6" id="dashboard-tab-container">
      {/* Top Banner - AI Motivation Coach */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg border border-emerald-700/30">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-mono font-medium tracking-wide flex items-center gap-1.5 border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" /> AI SUCCESS COACH
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
              Hello, {profile.name}!
            </h1>
            <p className="text-emerald-100/90 italic font-sans text-sm mt-2 leading-relaxed">
              "{aiScoring.motivationQuote}"
            </p>
          </div>
          <button 
            onClick={onRefreshAI}
            disabled={isLoadingAI}
            className="self-start md:self-center bg-white text-emerald-900 font-sans font-medium text-xs px-4 py-2.5 rounded-lg shadow-sm hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            {isLoadingAI ? (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-950 border-t-transparent animate-spin" /> Evaluating...
              </span>
            ) : (
              <>
                <BrainCircuit className="h-3.5 w-3.5" /> Analyze Success Index
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Semester Success Score Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800 text-sm">Semester Success Score</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-700">AI Predicted</span>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={175} 
                    strokeDashoffset={175 - (175 * aiScoring.semesterSuccessScore) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute font-mono font-bold text-lg text-slate-800">{aiScoring.semesterSuccessScore}%</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Based on attendance, assignments, and placement prep tasks.</p>
                <p className="text-xs font-semibold text-slate-700 mt-1">Status: Excellent Track</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setActiveTab("analytics")} 
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition"
            >
              View detailed analytics <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Attendance Index Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800 text-sm">Overall Attendance</h3>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${averageAttendance >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {averageAttendance >= 75 ? 'Safe (75%+)' : 'Warning'}
              </span>
            </div>
            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-slate-800">{averageAttendance.toFixed(1)}%</span>
                <span className="text-xs text-slate-500">({totalAttended}/{totalClasses} sessions)</span>
              </div>
              {/* Simple progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${averageAttendance >= 80 ? 'bg-emerald-500' : averageAttendance >= 75 ? 'bg-teal-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, averageAttendance)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setActiveTab("attendance")} 
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition"
            >
              Analyze attendance predictor <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Placement readiness Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-800 text-sm">Placement Readiness</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-100 text-indigo-700">Pre-Assessment</span>
            </div>
            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-slate-800">{profile.placementReadinessScore}/100</span>
                <span className="text-xs text-slate-500">Target: 90+</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${profile.placementReadinessScore}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setActiveTab("placement")} 
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition"
            >
              Unlock company prep questions <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Layout Block: AI Success Analysis & Active Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Dynamic AI Evaluator (8 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-emerald-500" /> Success Score Reasonings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated diagnostics generated dynamically by the AI College Success Agent.</p>
          </div>

          <div className="space-y-3">
            {aiScoring.reasons.map((reason, idx) => {
              const isWarning = reason.startsWith("⚠");
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-lg border text-xs leading-relaxed transition-all
                    ${isWarning 
                      ? "bg-amber-50/50 border-amber-100/70 text-slate-700" 
                      : "bg-emerald-50/30 border-emerald-100/50 text-slate-700"
                    }
                  `}
                >
                  <span className="shrink-0 font-bold select-none mt-0.5">
                    {isWarning ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                  </span>
                  <div>{reason.replace(/^✔\s*/, "").replace(/^⚠\s*/, "")}</div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-emerald-600" /> Productivity Analytics
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600 max-w-md">
                <span className="font-semibold text-slate-800">Feedback:</span> {aiScoring.productivityAnalyzer.suggestion}
              </div>
              <div className="shrink-0 flex items-center gap-2 font-mono text-xs">
                <div className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                  Planned: <span className="font-bold text-slate-800">{aiScoring.productivityAnalyzer.plannedHours}h</span>
                </div>
                <div className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100 text-emerald-700">
                  Actual: <span className="font-bold text-emerald-800">{aiScoring.productivityAnalyzer.actualHours}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active Lists (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
          
          {/* Today's Classes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-500" /> Today's Schedule ({todayName})
              </h3>
              <button 
                onClick={() => setActiveTab("timetable")} 
                className="text-[11px] text-emerald-600 font-medium hover:underline"
              >
                Full week
              </button>
            </div>

            {todaysClasses.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-4 text-center border border-dashed border-slate-200">
                No classes scheduled for today. Time for some self-study!
              </p>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((cl, idx) => (
                  <div 
                    key={cl.id} 
                    className={`p-3 rounded-lg border text-xs flex justify-between items-center transition-all hover:bg-slate-50
                      ${cl.isLab ? "bg-amber-50/30 border-amber-100/50" : "bg-slate-50/50 border-slate-100"}
                    `}
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{cl.subject}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5 flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3 text-slate-400" /> {cl.time}
                      </p>
                    </div>
                    <span className="font-mono bg-white px-2 py-0.5 border rounded text-[10px] text-slate-600 font-semibold shadow-2xs">
                      {cl.room}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Pending Assignments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-emerald-500" /> Pending Assignments
              </h3>
              <button 
                onClick={() => setActiveTab("assignments")} 
                className="text-[11px] text-emerald-600 font-medium hover:underline"
              >
                Add new
              </button>
            </div>

            {pendingAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-4 text-center border border-dashed">
                All assignments completed! 🌟
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.slice(0, 3).map((as) => (
                  <div key={as.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs flex items-center justify-between gap-2 hover:bg-slate-50">
                    <div className="overflow-hidden">
                      <p className="font-medium text-slate-800 truncate">{as.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-semibold text-slate-500 px-1 bg-slate-200/80 rounded font-mono">{as.subject}</span>
                        <span className="text-[10px] text-slate-400">Due: {as.dueDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded font-mono shrink-0
                      ${as.priority === 'High' ? 'bg-rose-100 text-rose-700' : as.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}
                    `}>
                      {as.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Extra AI Standouts Row: Subject Exam Readiness meters & AI Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Exam Readiness Meter */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-500" /> AI Exam Readiness Meter
            </h3>
            <p className="text-xs text-slate-500">Real-time prediction of subject performance for upcoming end-sem exam.</p>
          </div>

          <div className="space-y-3">
            {aiScoring.examReadiness.map((er, idx) => {
              const score = er.percentage;
              const color = score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-rose-500";
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{er.subject}</span>
                    <span className="text-slate-800 font-mono font-semibold">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50 text-[11px] text-emerald-800 leading-relaxed">
            💡 <span className="font-semibold">AI Recommendation:</span> Focus priority on <span className="font-bold underline">Computer Networks</span>. Take the smart study planner quiz to design an intensive revision schedule today.
          </div>
        </div>

        {/* AI Goal Suggestions Quickbox */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-500" /> Suggested Daily Targets
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-2 py-0.5 rounded border border-emerald-100">Live AI</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Smart target objectives aligned with assignment dues and placement scores.</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>Complete SQL Optimizations & practice 3 query execution plans.</div>
            </div>
            <div className="flex gap-2.5 items-start p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>Review operating systems thread synchronization locks.</div>
            </div>
            <div className="flex gap-2.5 items-start p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>Solve 1 Hard Coding Question regarding Reverse Linked Lists.</div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab("goals")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-sans font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            Launch Goal Generator Tracker <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
