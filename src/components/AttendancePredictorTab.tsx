import React from "react";
import { 
  UserCheck, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Trash2,
  ListPlus
} from "lucide-react";
import { AttendanceRecord } from "../types";

interface AttendancePredictorTabProps {
  records: AttendanceRecord[];
  onUpdateRecords: (records: AttendanceRecord[]) => void;
}

export default function AttendancePredictorTab({
  records,
  onUpdateRecords
}: AttendancePredictorTabProps) {
  const [newSubjectName, setNewSubjectName] = React.useState("");
  const [newAttended, setNewAttended] = React.useState(15);
  const [newTotal, setNewTotal] = React.useState(20);
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Core Math Calculator Functions
  const calculateAttendance = (attended: number, total: number): number => {
    if (total === 0) return 0;
    return (attended / total) * 100;
  };

  const getPredictorOutput = (attended: number, total: number) => {
    const current = calculateAttendance(attended, total);
    if (current >= 75) {
      // How many classes can we safely miss consecutively?
      // Formula: floor((attended - 0.75 * total) / 0.75)
      // Since each class missed adds 1 to total, and 0 to attended:
      // (attended) / (total + x) >= 0.75 => attended >= 0.75 * total + 0.75 * x => x <= (attended - 0.75 * total) / 0.75
      const maxMiss = Math.floor((attended - 0.75 * total) / 0.75);
      return {
        safe: true,
        count: maxMiss >= 0 ? maxMiss : 0,
        text: `You are in the safe zone! You can consecutively miss `
      };
    } else {
      // How many consecutive classes do we need to attend to reach 75%?
      // Formula: ceil((0.75 * total - attended) / 0.25)
      // Since each class attended adds 1 to attended and 1 to total:
      // (attended + x) / (total + x) >= 0.75 => attended + x >= 0.75 * total + 0.75 * x => 0.25 * x >= 0.75 * total - attended => x >= (0.75 * total - attended) / 0.25
      const reqClasses = Math.ceil((0.75 * total - attended) / 0.25);
      return {
        safe: false,
        count: reqClasses > 0 ? reqClasses : 0,
        text: `Urgent: Attendance below 75%! You must attend next consecutive classes: `
      };
    }
  };

  // State update actions
  const adjustAttendance = (id: string, type: 'attended-up' | 'attended-down' | 'total-up' | 'total-down') => {
    const updated = records.map(rec => {
      if (rec.id === id) {
        let att = rec.attended;
        let tot = rec.total;

        if (type === 'attended-up') {
          att += 1;
          tot += 1; // attending a class adds to both attended and total
        } else if (type === 'attended-down') {
          if (att > 0) {
            att -= 1;
            tot -= 1;
          }
        } else if (type === 'total-up') {
          tot += 1; // missing a class adds 1 to total, but 0 to attended
        } else if (type === 'total-down') {
          if (tot > att && tot > 0) {
            tot -= 1;
          }
        }

        return { ...rec, attended: att, total: tot };
      }
      return rec;
    });
    onUpdateRecords(updated);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newRecord: AttendanceRecord = {
      id: `sub-${Date.now()}`,
      subjectName: newSubjectName.trim(),
      attended: Number(newAttended),
      total: Number(newTotal)
    };

    onUpdateRecords([...records, newRecord]);
    setNewSubjectName("");
    setNewAttended(15);
    setNewTotal(20);
    setShowAddForm(false);
  };

  const handleDeleteSubject = (id: string) => {
    onUpdateRecords(records.filter(r => r.id !== id));
  };

  // Average Calculations
  const averageTotalAttended = records.reduce((acc, rec) => acc + rec.attended, 0);
  const averageTotalClasses = records.reduce((acc, rec) => acc + rec.total, 0);
  const averagePercent = averageTotalClasses > 0 ? (averageTotalAttended / averageTotalClasses) * 100 : 0;

  return (
    <div className="space-y-6" id="attendance-predictor-tab-container">
      {/* Intro Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
            <UserCheck className="h-5.5 w-5.5 text-emerald-500" /> Smart Attendance Predictor
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Predict attendance metrics and calculate exactly how many classes you must attend to achieve the mandated <span className="font-semibold text-slate-700">75% attendance threshold</span>, or how many sessions you can safely miss.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0 transition"
        >
          <ListPlus className="h-4 w-4" /> {showAddForm ? "Close Form" : "Add Subject"}
        </button>
      </div>

      {/* Add New Subject Form Accordion */}
      {showAddForm && (
        <form onSubmit={handleAddSubject} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Subject Name</label>
            <input
              type="text"
              required
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g., Computer Networks, Compiler Design"
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Classes Attended</label>
            <input
              type="number"
              min="0"
              required
              value={newAttended}
              onChange={(e) => setNewAttended(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-sans text-slate-700 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Total Classes Conducted</label>
            <input
              type="number"
              min="0"
              required
              value={newTotal}
              onChange={(e) => setNewTotal(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-sans text-slate-700 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-lg text-xs font-medium cursor-pointer"
          >
            Create Subject Record
          </button>
        </form>
      )}

      {/* Total Aggregate Card */}
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-emerald-100 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/20">
        <div>
          <span className="text-[10px] bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
            Aggregate Campus Average
          </span>
          <h3 className="font-display font-bold text-white text-lg mt-2">Overall Semester Attendance Status</h3>
          <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
            Your aggregate average across {records.length} registered academic subjects is currently <span className="text-white font-semibold underline">{averagePercent.toFixed(1)}%</span>. Keep it above 75% to stay eligible for final semester examinations.
          </p>
        </div>
        <div className="text-center shrink-0">
          <div className="text-4xl font-mono font-bold text-white">{averagePercent.toFixed(1)}%</div>
          <p className="text-[10px] font-mono text-emerald-400 mt-1 uppercase font-bold tracking-wider">
            {averagePercent >= 75 ? "✅ STATUS: ELIGIBLE" : "❌ STATUS: CRITICAL RISK"}
          </p>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((rec) => {
          const percent = calculateAttendance(rec.attended, rec.total);
          const predictor = getPredictorOutput(rec.attended, rec.total);
          const isWarning = percent < 75;
          const isClose = percent >= 75 && percent < 80;

          return (
            <div key={rec.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-md transition">
              
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm">{rec.subjectName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">Registered Academic Core</p>
                </div>
                <button 
                  onClick={() => handleDeleteSubject(rec.id)}
                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                  title="Delete subject"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Attendance values & controls */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">CLASSES ATTENDED</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-mono font-bold text-slate-800">{rec.attended}</span>
                    <span className="text-slate-400 text-xs">/</span>
                    <span className="text-xl font-mono font-bold text-slate-800">{rec.total}</span>
                    <span className="text-slate-500 text-[11px] font-semibold">sessions</span>
                  </div>
                </div>

                {/* Simulated Increment Decrement Triggers */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 w-16 text-right">Attended:</span>
                    <button 
                      onClick={() => adjustAttendance(rec.id, 'attended-up')}
                      className="p-1.5 bg-white border hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 rounded text-slate-600 transition"
                      title="Attended consecutive next class (+1 attended, +1 total)"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      disabled={rec.attended === 0}
                      onClick={() => adjustAttendance(rec.id, 'attended-down')}
                      className="p-1.5 bg-white border hover:bg-slate-100 rounded text-slate-600 transition"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 w-16 text-right">Missed:</span>
                    <button 
                      onClick={() => adjustAttendance(rec.id, 'total-up')}
                      className="p-1.5 bg-white border hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 rounded text-slate-600 transition"
                      title="Missed next class (+0 attended, +1 total)"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      disabled={rec.total === rec.attended}
                      onClick={() => adjustAttendance(rec.id, 'total-down')}
                      className="p-1.5 bg-white border hover:bg-slate-100 rounded text-slate-600 transition"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Gauge and Percentage Indicators */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Current Level</span>
                  <span className={`font-mono font-bold ${isWarning ? 'text-rose-600' : isClose ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isWarning ? 'bg-rose-500 animate-pulse' : isClose ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>

              {/* Warning or prediction alerts */}
              <div className={`p-3 rounded-lg text-xs flex gap-2 leading-relaxed items-start border
                ${isWarning 
                  ? "bg-rose-50 border-rose-100 text-rose-800" 
                  : isClose 
                    ? "bg-amber-50 border-amber-100 text-amber-800" 
                    : "bg-emerald-50 border-emerald-100 text-emerald-800"
                }
              `}>
                <span className="shrink-0 mt-0.5">
                  {isWarning ? (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </span>
                <div>
                  <span className="font-semibold">{predictor.text}</span>
                  <span className="font-mono font-bold underline bg-white/70 px-1 rounded mx-0.5">{predictor.count}</span>
                  <span>classes.</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
