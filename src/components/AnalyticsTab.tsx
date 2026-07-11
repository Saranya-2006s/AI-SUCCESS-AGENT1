import React from "react";
import { 
  TrendingUp, 
  BarChart2, 
  Clock, 
  Code, 
  BookOpen,
  Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from "recharts";
import { AnalyticsSummary, AttendanceRecord } from "../types";

interface AnalyticsTabProps {
  analytics: AnalyticsSummary;
  attendanceRecords: AttendanceRecord[];
}

export default function AnalyticsTab({
  analytics,
  attendanceRecords
}: AnalyticsTabProps) {

  // Prepare attendance dataset for vertical BarChart
  const attendanceData = attendanceRecords.map(rec => {
    const percentage = rec.total > 0 ? (rec.attended / rec.total) * 100 : 0;
    return {
      subject: rec.subjectName,
      "Attendance %": Math.round(percentage),
      Threshold: 75
    };
  });

  return (
    <div className="space-y-6" id="analytics-tab-container">
      {/* Tab Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
          <TrendingUp className="h-5.5 w-5.5 text-emerald-500" /> Academic & Productivity Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Monitor your real-time academic milestones, compare planned vs. actual daily study hours, view coding problem achievements, and analyze subject attendance records using modern visual metrics.
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Attendance across Subjects */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-emerald-500" /> Subject Attendance Levels
            </h3>
            <p className="text-[11px] text-slate-400 font-mono uppercase">Target threshold set at 75%</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Planned vs Actual study hours */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500" /> Daily Study Commitment: Planned vs Actual
            </h3>
            <p className="text-[11px] text-slate-400 font-mono uppercase">Weekly focus calibration hours</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weeklyStudyHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="planned" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" name="Planned Hours" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" name="Actual Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Progress - Study hours vs Assignments completed */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-500" /> Weekly Academic Load Index
            </h3>
            <p className="text-[11px] text-slate-400 font-mono uppercase">Cumulative study hours & assignment completions</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="studyHours" stroke="#3b82f6" strokeWidth={2} name="Study Hours" activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="assignmentsCompleted" stroke="#f59e0b" strokeWidth={2} name="Assignments Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Coding Solved problems */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Code className="h-4 w-4 text-emerald-500" /> Coding & Aptitude Problem Milestone
            </h3>
            <p className="text-[11px] text-slate-400 font-mono uppercase">Cumulative monthly questions solved</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.codingSolved} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="problems" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} name="Solved Problems" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Standout Bottom Evaluation Box */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-500" /> Weekly Academic Milestones Review
          </h4>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>✔ Completed <span className="font-semibold text-slate-800">4 core technical queries</span> in DBMS database optimizer labs on Thursday.</p>
            <p>✔ Standardized Socket Programming logic for Computer Networks ahead of the June 30 due date.</p>
            <p>⚠ <span className="font-semibold text-slate-800">Attention Area:</span> Study session was interrupted on Wednesday, causing actual focus to hit only 50% of the daily study goal. Suggested recovery scheduled for Saturday morning.</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed space-y-1.5 flex flex-col justify-center">
          <p className="font-semibold text-emerald-950">AI College Success Agent Diagnostics:</p>
          <p>
            "You are maintaining excellent technical progress with consistent coding practice. To further boost your Semester Success Score from 84% to 90%+, resolve the remaining Operating Systems thread locks tasks on Saturday afternoon."
          </p>
        </div>
      </div>
    </div>
  );
}
