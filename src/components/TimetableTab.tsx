import React from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  GraduationCap,
  Edit2,
  Check,
  X,
  BookOpen,
  Hash
} from "lucide-react";
import { ClassSchedule } from "../types";

interface TimetableTabProps {
  schedule: ClassSchedule[];
  onUpdateSchedule: (schedule: ClassSchedule[]) => void;
}

interface ExamScheduleItem {
  id: string;
  subject: string;
  date: string;
  time: string;
  hall: string;
  regStart: string; // Starting registration number
  regEnd: string;   // Ending registration number
}

const initialExams: ExamScheduleItem[] = [
  { id: "ex-1", subject: "DBMS", date: "2026-07-15", time: "10:00 AM - 01:00 PM", hall: "Exam Hall A", regStart: "REG-2026-001", regEnd: "REG-2026-045" },
  { id: "ex-2", subject: "Operating Systems", date: "2026-07-17", time: "10:00 AM - 01:00 PM", hall: "Exam Hall A", regStart: "REG-2026-001", regEnd: "REG-2026-045" },
  { id: "ex-3", subject: "Computer Networks", date: "2026-07-20", time: "02:00 PM - 05:00 PM", hall: "Exam Hall B", regStart: "REG-2026-046", regEnd: "REG-2026-090" },
  { id: "ex-4", subject: "Java Programming", date: "2026-07-22", time: "10:00 AM - 01:00 PM", hall: "Seminar Hall 1", regStart: "REG-2026-001", regEnd: "REG-2026-090" }
];

const isExamExpired = (dateStr: string, timeStr: string): boolean => {
  try {
    const today = new Date();
    
    // Parse dateStr "YYYY-MM-DD"
    const dateParts = dateStr.split("-");
    if (dateParts.length !== 3) return false;
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // 0-indexed month
    const day = parseInt(dateParts[2], 10);

    // Default target date is the end of that day (23:59:59)
    let targetDate = new Date(year, month, day, 23, 59, 59);

    // Try to parse end time from timeStr e.g. "10:00 AM - 01:00 PM"
    const separators = ["-", "to", "—"];
    let endPart = "";
    for (const sep of separators) {
      if (timeStr.includes(sep)) {
        const parts = timeStr.split(sep);
        endPart = parts[parts.length - 1].trim();
        break;
      }
    }

    if (!endPart) {
      endPart = timeStr.trim();
    }

    const timeRegex = /(\d+)(?::(\d+))?\s*(AM|PM)?/i;
    const match = endPart.match(timeRegex);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3] ? match[3].toUpperCase() : null;

      if (meridiem) {
        if (meridiem === "PM" && hours < 12) {
          hours += 12;
        } else if (meridiem === "AM" && hours === 12) {
          hours = 0;
        }
      }
      
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        targetDate = new Date(year, month, day, hours, minutes, 0);
      }
    }

    return today > targetDate;
  } catch (e) {
    return false;
  }
};

export default function TimetableTab({
  schedule,
  onUpdateSchedule
}: TimetableTabProps) {
  const [activeDay, setActiveDay] = React.useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday">("Monday");
  const [exams, setExams] = React.useState<ExamScheduleItem[]>(() => {
    const saved = localStorage.getItem("success_agent_exams");
    return saved ? JSON.parse(saved) : initialExams;
  });

  // Save exams to localstorage on change
  React.useEffect(() => {
    localStorage.setItem("success_agent_exams", JSON.stringify(exams));
  }, [exams]);

  // Weekday Class Addition/Editing Form states
  const [showAddClassForm, setShowAddClassForm] = React.useState(false);
  const [newClassSub, setNewClassSub] = React.useState("");
  const [newClassTime, setNewClassTime] = React.useState("09:00 AM - 10:00 AM");
  const [newClassRoom, setNewClassRoom] = React.useState("L-301");
  const [newClassIsLab, setNewClassIsLab] = React.useState(false);

  // Editing existing Class Lecture state
  const [editingClassId, setEditingClassId] = React.useState<string | null>(null);
  const [editClassSub, setEditClassSub] = React.useState("");
  const [editClassTime, setEditClassTime] = React.useState("");
  const [editClassRoom, setEditClassRoom] = React.useState("");
  const [editClassIsLab, setEditClassIsLab] = React.useState(false);

  // Form states to add new exam
  const [showExamForm, setShowExamForm] = React.useState(false);
  const [newSub, setNewSub] = React.useState("");
  const [newDate, setNewDate] = React.useState("2026-07-24");
  const [newTime, setNewTime] = React.useState("10:00 AM - 01:00 PM");
  const [newHall, setNewHall] = React.useState("Exam Hall A");
  const [newRegStart, setNewRegStart] = React.useState("REG-2026-001");
  const [newRegEnd, setNewRegEnd] = React.useState("REG-2026-060");

  // Editing existing Exam state
  const [editingExamId, setEditingExamId] = React.useState<string | null>(null);
  const [editExamSub, setEditExamSub] = React.useState("");
  const [editExamDate, setEditExamDate] = React.useState("");
  const [editExamTime, setEditExamTime] = React.useState("");
  const [editExamHall, setEditExamHall] = React.useState("");
  const [editExamRegStart, setEditExamRegStart] = React.useState("");
  const [editExamRegEnd, setEditExamRegEnd] = React.useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

  // Filter schedule by active day
  const filteredSchedule = schedule.filter(s => s.day === activeDay);

  // Handlers for class lectures
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassSub.trim() || !newClassTime.trim() || !newClassRoom.trim()) return;

    const newClass: ClassSchedule = {
      id: `sch-${Date.now()}`,
      day: activeDay,
      subject: newClassSub.trim(),
      time: newClassTime.trim(),
      room: newClassRoom.trim(),
      isLab: newClassIsLab
    };

    onUpdateSchedule([...schedule, newClass]);
    setNewClassSub("");
    setShowAddClassForm(false);
  };

  const startEditingClass = (cl: ClassSchedule) => {
    setEditingClassId(cl.id);
    setEditClassSub(cl.subject);
    setEditClassTime(cl.time);
    setEditClassRoom(cl.room);
    setEditClassIsLab(cl.isLab);
  };

  const handleSaveClassEdit = (id: string) => {
    if (!editClassSub.trim() || !editClassTime.trim() || !editClassRoom.trim()) return;

    const updated = schedule.map(cl => {
      if (cl.id === id) {
        return {
          ...cl,
          subject: editClassSub.trim(),
          time: editClassTime.trim(),
          room: editClassRoom.trim(),
          isLab: editClassIsLab
        };
      }
      return cl;
    });

    onUpdateSchedule(updated);
    setEditingClassId(null);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("Are you sure you want to delete this class lecture from the timetable?")) {
      onUpdateSchedule(schedule.filter(cl => cl.id !== id));
    }
  };

  // Handlers for exams
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.trim() || !newTime.trim() || !newHall.trim() || !newRegStart.trim() || !newRegEnd.trim()) return;

    const newItem: ExamScheduleItem = {
      id: `ex-${Date.now()}`,
      subject: newSub.trim(),
      date: newDate,
      time: newTime.trim(),
      hall: newHall.trim(),
      regStart: newRegStart.trim(),
      regEnd: newRegEnd.trim()
    };

    setExams([...exams, newItem]);
    setNewSub("");
    setShowExamForm(false);
  };

  const startEditingExam = (ex: ExamScheduleItem) => {
    setEditingExamId(ex.id);
    setEditExamSub(ex.subject);
    setEditExamDate(ex.date);
    setEditExamTime(ex.time);
    setEditExamHall(ex.hall);
    setEditExamRegStart(ex.regStart || "");
    setEditExamRegEnd(ex.regEnd || "");
  };

  const handleSaveExamEdit = (id: string) => {
    if (!editExamSub.trim() || !editExamTime.trim() || !editExamHall.trim() || !editExamRegStart.trim() || !editExamRegEnd.trim()) return;

    const updated = exams.map(ex => {
      if (ex.id === id) {
        return {
          ...ex,
          subject: editExamSub.trim(),
          date: editExamDate,
          time: editExamTime.trim(),
          hall: editExamHall.trim(),
          regStart: editExamRegStart.trim(),
          regEnd: editExamRegEnd.trim()
        };
      }
      return ex;
    });

    setExams(updated);
    setEditingExamId(null);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm("Are you sure you want to remove this exam plan?")) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6" id="timetable-tab-container">
      {/* Intro Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
          <Calendar className="h-5.5 w-5.5 text-emerald-500" /> Weekly Timetable & Exam Schedule Assistant
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Access and customize your weekly registered class lectures, laboratory sessions (now including Saturdays!), and official semester exams complete with custom timings, exam halls, and student registration number ranges.
        </p>
      </div>
 
      {/* Grid of Timetable Days and active listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekday Lecture Timetable (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Class Lectures</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Customize lectures for any day of the week</p>
            </div>
            <button
              onClick={() => setShowAddClassForm(!showAddClassForm)}
              className="text-[10px] text-emerald-800 hover:underline font-mono uppercase tracking-wider font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100/50"
            >
              {showAddClassForm ? "Cancel" : "+ Add Lecture"}
            </button>
          </div>

          {/* Weekday Selector Tabs */}
          <div className="flex bg-slate-50 border p-1 rounded-lg overflow-x-auto gap-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setActiveDay(d);
                  setEditingClassId(null);
                  setShowAddClassForm(false);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all shrink-0 cursor-pointer text-center px-1.5 min-w-[55px]
                  ${activeDay === d 
                    ? "bg-emerald-800 text-white shadow-3xs" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }
                `}
              >
                {d.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Add Lecture Form Accordion */}
          {showAddClassForm && (
            <form onSubmit={handleAddClass} className="p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-xl space-y-3.5 text-xs">
              <h4 className="font-display font-bold text-emerald-900 text-xs">Add Class Lecture for {activeDay}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-800 font-semibold block">LECTURE SUBJECT *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design & Analysis of Algorithms"
                    value={newClassSub}
                    onChange={(e) => setNewClassSub(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-800 font-semibold block">ROOM NUMBER *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L-301"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-800 font-semibold block">CLASS TIME INTERVAL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM - 10:00 AM"
                    value={newClassTime}
                    onChange={(e) => setNewClassTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 rounded text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={newClassIsLab}
                      onChange={(e) => setNewClassIsLab(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Is this a Practical Lab session?</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer transition shadow-3xs"
              >
                + Save Lecture onto Timetable
              </button>
            </form>
          )}
 
          {/* Schedule List */}
          <div className="space-y-3 pt-1">
            {filteredSchedule.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-lg text-slate-400 text-xs">
                No classes scheduled for {activeDay}. Enjoy your personal study block!
              </div>
            ) : (
              filteredSchedule.map((cl) => {
                const isEditing = editingClassId === cl.id;
                return (
                  <div 
                    key={cl.id} 
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-all
                      ${cl.isLab 
                        ? "bg-amber-50/20 border-amber-200/40" 
                        : "bg-white border-slate-100"
                      }
                    `}
                  >
                    {isEditing ? (
                      /* Inline Class Edit Mode Form */
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-slate-700 font-mono text-[10px]">EDIT CLASS LECTURE</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{activeDay}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 font-semibold block mb-1">SUBJECT NAME</label>
                            <input
                              type="text"
                              value={editClassSub}
                              onChange={(e) => setEditClassSub(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-emerald-600"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 font-semibold block mb-1">CLASS TIMING</label>
                            <input
                              type="text"
                              value={editClassTime}
                              onChange={(e) => setEditClassTime(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-emerald-600 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 font-semibold block mb-1">ROOM / LAB NO</label>
                            <input
                              type="text"
                              value={editClassRoom}
                              onChange={(e) => setEditClassRoom(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-emerald-600 font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                            <input
                              type="checkbox"
                              checked={editClassIsLab}
                              onChange={(e) => setEditClassIsLab(e.target.checked)}
                              className="rounded border-slate-300 text-emerald-600 h-3.5 w-3.5"
                            />
                            <span className="text-[11px]">Practical Lab Session</span>
                          </label>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveClassEdit(cl.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3 w-3" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingClassId(null)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <X className="h-3 w-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div className="flex justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans font-semibold text-xs text-slate-800">{cl.subject}</h4>
                            {cl.isLab && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold font-mono text-[8px] rounded uppercase tracking-wider">
                                LAB
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" /> {cl.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 border text-[10px] font-mono text-slate-600 font-bold rounded-lg flex items-center gap-1 shrink-0">
                            <MapPin className="h-3 w-3 text-slate-400" /> Room {cl.room}
                          </span>

                          <div className="flex items-center gap-0.5 ml-2 border-l pl-2">
                            <button
                              onClick={() => startEditingClass(cl)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition shrink-0"
                              title="Edit Lecture Details"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cl.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition shrink-0"
                              title="Delete Lecture"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
 
        {/* Exam Schedule (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-500" /> Semester Exams Plan
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Manage exam times, halls, and register ranges</p>
            </div>
            <button
              onClick={() => {
                setShowExamForm(!showExamForm);
                setEditingExamId(null);
              }}
              className="text-[10px] text-emerald-800 hover:underline font-mono uppercase tracking-wider font-bold"
            >
              {showExamForm ? "Cancel" : "+ADD Semester Exam"}
            </button>
          </div>
 
          {/* Exam Registration Form Accordion */}
          {showExamForm && (
            <form onSubmit={handleAddExam} className="p-4 bg-slate-50 border rounded-xl space-y-3.5 text-xs">
              <h4 className="font-display font-bold text-slate-700 text-xs flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-500" /> New Exam Detail
              </h4>
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Exam Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Networks"
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  className="w-full bg-white border p-2 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-slate-400"
                />
              </div>
 
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white border p-2 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Exam Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 10:00 AM - 01:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border p-2 rounded-lg text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Location/Hall *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Exam Hall B"
                  value={newHall}
                  onChange={(e) => setNewHall(e.target.value)}
                  className="w-full bg-white border p-2 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-100/50 p-2.5 rounded-lg border border-slate-200/50">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 block">REG NO START *</label>
                  <input
                    type="text"
                    required
                    placeholder="REG-2026-001"
                    value={newRegStart}
                    onChange={(e) => setNewRegStart(e.target.value)}
                    className="w-full bg-white border p-1.5 rounded text-xs font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 block">REG NO END *</label>
                  <input
                    type="text"
                    required
                    placeholder="REG-2026-060"
                    value={newRegEnd}
                    onChange={(e) => setNewRegEnd(e.target.value)}
                    className="w-full bg-white border p-1.5 rounded text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
 
              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-medium py-2 rounded-lg text-xs transition"
              >
                Register Exam Schedule
              </button>
            </form>
          )}
 
          {/* Exams Listing */}
          <div className="space-y-3">
            {exams.length === 0 ? (
              <p className="text-xs text-slate-400 text-center border border-dashed rounded-lg p-6">
                No exams registered. Enjoy a worry-free session!
              </p>
            ) : (
              exams.map((ex) => {
                const isEditingExam = editingExamId === ex.id;
                const expired = isExamExpired(ex.date, ex.time);
                return (
                  <div 
                    key={ex.id} 
                    className={`p-4 rounded-xl border text-xs transition-all ${
                      expired 
                        ? "bg-rose-50/30 border-rose-200/60 hover:bg-rose-50/50 shadow-3xs" 
                        : "bg-slate-50 hover:bg-slate-100/70 border-slate-150/70"
                    }`}
                  >
                    {isEditingExam ? (
                      /* Inline Exam Editing Form */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-1">
                          <span className="font-mono text-[9px] font-bold text-slate-500">EDIT EXAM DETAILS</span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] font-mono text-slate-400 font-semibold block">EXAM NAME / SUBJECT</label>
                            <input
                              type="text"
                              value={editExamSub}
                              onChange={(e) => setEditExamSub(e.target.value)}
                              className="w-full bg-white border p-1.5 rounded text-xs font-semibold text-slate-700 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 font-semibold block">DATE</label>
                              <input
                                type="date"
                                value={editExamDate}
                                onChange={(e) => setEditExamDate(e.target.value)}
                                className="w-full bg-white border p-1.5 rounded text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 font-semibold block">TIME</label>
                              <input
                                type="text"
                                value={editExamTime}
                                onChange={(e) => setEditExamTime(e.target.value)}
                                className="w-full bg-white border p-1.5 rounded text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-slate-400 font-semibold block">EXAM HALL</label>
                            <input
                              type="text"
                              value={editExamHall}
                              onChange={(e) => setEditExamHall(e.target.value)}
                              className="w-full bg-white border p-1.5 rounded text-xs font-sans focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 bg-slate-200/50 p-2 rounded-lg border border-slate-300/40">
                            <div>
                              <label className="text-[8px] font-mono text-slate-500 font-bold block">START REGISTER NO</label>
                              <input
                                type="text"
                                value={editExamRegStart}
                                onChange={(e) => setEditExamRegStart(e.target.value)}
                                className="w-full bg-white border p-1 rounded text-xs font-mono focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-mono text-slate-500 font-bold block">END REGISTER NO</label>
                              <input
                                type="text"
                                value={editExamRegEnd}
                                onChange={(e) => setEditExamRegEnd(e.target.value)}
                                className="w-full bg-white border p-1 rounded text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveExamEdit(ex.id)}
                            className="bg-emerald-800 hover:bg-emerald-950 text-white px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3 w-3" /> Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingExamId(null)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <X className="h-3 w-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Exam Display Card */
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 overflow-hidden w-full">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-semibold truncate ${expired ? "text-rose-900/80 font-medium line-through" : "text-slate-800"}`}>
                              {ex.subject}
                            </p>
                            {expired && (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200/50 font-bold font-mono text-[8px] rounded uppercase tracking-wider flex items-center gap-0.5 shadow-3xs">
                                Finished
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-[10px] font-mono flex items-center gap-1 ${expired ? "text-rose-600/70" : "text-slate-500"}`}>
                            <Calendar className={`h-3 w-3 ${expired ? "text-rose-400" : "text-slate-400"}`} /> Date: {ex.date}
                          </p>
                          <p className={`text-[10px] font-mono flex items-center gap-1 ${expired ? "text-rose-700 font-medium" : "text-slate-500"}`}>
                            <Clock className={`h-3 w-3 ${expired ? "text-rose-400" : "text-slate-400"}`} /> {ex.time}
                          </p>
                          <p className={`text-[10px] font-mono font-medium flex items-center gap-1 border rounded px-1.5 py-0.5 w-fit ${
                            expired 
                              ? "text-rose-800 bg-rose-50 border-rose-100" 
                              : "text-emerald-700 bg-emerald-50/50 border-emerald-100/50"
                          }`}>
                            <MapPin className={`h-3.5 w-3.5 ${expired ? "text-rose-500" : "text-emerald-600"}`} /> {ex.hall}
                          </p>

                          {/* Register No range */}
                          <div className={`text-[10px] font-mono px-2 py-1 rounded-md border mt-1 flex items-center gap-1.5 ${
                            expired 
                              ? "bg-rose-100/25 text-rose-800 border-rose-100/40" 
                              : "bg-slate-200/40 text-slate-600 border-slate-200/60"
                          }`}>
                            <Hash className={`h-3 w-3 ${expired ? "text-rose-400" : "text-slate-400"}`} />
                            <span>Reg Nos: </span>
                            <span className={`font-bold ${expired ? "text-rose-900" : "text-slate-700"}`}>{ex.regStart || "N/A"}</span>
                            <span>&mdash;</span>
                            <span className={`font-bold ${expired ? "text-rose-900" : "text-slate-700"}`}>{ex.regEnd || "N/A"}</span>
                          </div>
                        </div>
 
                        <div className="flex items-center gap-1.5 border-l pl-2">
                          <button
                            onClick={() => startEditingExam(ex)}
                            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-emerald-800 rounded transition shrink-0"
                            title="Edit Exam"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(ex.id)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition shrink-0"
                            title="Delete Exam"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
 
      </div>
    </div>
  );
}
