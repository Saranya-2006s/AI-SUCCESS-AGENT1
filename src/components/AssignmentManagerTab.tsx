import React from "react";
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle, 
  Download, 
  Upload, 
  Search,
  Filter,
  GraduationCap,
  UserCog,
  Lock,
  BookOpen,
  Award,
  FileText,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Trash2,
  ShieldCheck,
  BookCheck,
  Edit2,
  Save
} from "lucide-react";
import { Assignment, StudentSubmission } from "../types";

interface AssignmentManagerTabProps {
  assignments: Assignment[];
  onUpdateAssignments: (assignments: Assignment[]) => void;
  subjects: string[];
}

const FIRST_NAMES = [
  "Saranya", "Amit", "Priya", "Rahul", "Sneha", "Abhinav", "Aditi", "Anirudh", "Ananya", "Arjun",
  "Aishwarya", "Deepak", "Divya", "Ganesh", "Gouri", "Hari", "Haritha", "Ishaan", "Isha", "Karthik",
  "Kavya", "Madhav", "Meera", "Manoj", "Nandini", "Naveen", "Nisha", "Pranav", "Pritha", "Rajesh",
  "Ritu", "Rohan", "Riya", "Sanjay", "Shruti", "Siddharth", "Swathi", "Varun", "Vidyut", "Yash",
  "Karan", "Kunal", "Maya", "Neha", "Pooja", "Raman", "Shweta", "Vikram", "Vivek", "Preeti",
  "Kiran", "Sujit", "Alok", "Dev", "Arun"
];
const LAST_NAMES = [
  "S", "Patel", "Sen", "Sharma", "Reddy", "Kumar", "Rao", "Nair", "Iyer", "Joshi",
  "Pillai", "Das", "Mehta", "Singh", "Verma", "Gupta", "Bose", "Choudhury", "Menon", "Prasad"
];

// Generate exactly 105 students deterministically
const generateDefaultStudents = () => {
  const list = [{ studentName: "Saranya S", rollNo: "22IT01" }];
  let rollCounter = 2;
  
  for (let i = 0; i < FIRST_NAMES.length; i++) {
    for (let j = 0; j < LAST_NAMES.length; j++) {
      const name = `${FIRST_NAMES[i]} ${LAST_NAMES[j]}`;
      // Skip duplicating "Saranya S"
      if (name.toLowerCase() === "saranya s") continue;
      
      if (list.length < 105) {
        const rollStr = `22IT${rollCounter < 10 ? '0' + rollCounter : rollCounter}`;
        list.push({ studentName: name, rollNo: rollStr });
        rollCounter++;
      } else {
        break;
      }
    }
    if (list.length >= 105) break;
  }
  return list;
};

const DEFAULT_STUDENTS = generateDefaultStudents();

// Helper to get submissions for a single assignment dynamically
const getAssignmentSubmissions = (a: Assignment): StudentSubmission[] => {
  if (a.submissions && a.submissions.length > 0) {
    // If some students are not present in a.submissions, we should merge with DEFAULT_STUDENTS
    if (a.submissions.length < DEFAULT_STUDENTS.length) {
      const merged = DEFAULT_STUDENTS.map(ds => {
        const existing = a.submissions?.find(s => s.studentName.toLowerCase() === ds.studentName.toLowerCase());
        if (existing) return existing;
        return {
          studentName: ds.studentName,
          rollNo: ds.rollNo,
          status: "Pending" as const
        };
      });
      return merged;
    }
    return a.submissions;
  }
  // Otherwise, return initial stable dummy submissions based on student's name & assignment ID
  return DEFAULT_STUDENTS.map(s => {
    if (s.studentName === "Saranya S") {
      return {
        studentName: s.studentName,
        rollNo: s.rollNo,
        status: a.status,
        fileUploaded: a.fileUploaded,
        submittedAt: a.status === "Completed" ? a.dueDate : undefined,
        marks: a.status === "Completed" ? 85 : undefined
      };
    } else {
      // Stable semi-random statuses for mock class students
      const charCodeSum = s.studentName.charCodeAt(0) + a.id.charCodeAt(a.id.length - 1);
      // Give about 30% of students a mock "Completed" status so the grading view starts populated
      const isCompleted = charCodeSum % 3 === 0;
      const file = isCompleted ? `${a.subject.toLowerCase().replace(/[^a-z0-9]/g, "_")}_report_${s.studentName.toLowerCase().replace(" ", "_")}.pdf` : undefined;
      return {
        studentName: s.studentName,
        rollNo: s.rollNo,
        status: isCompleted ? "Completed" : "Pending",
        fileUploaded: file,
        submittedAt: isCompleted ? a.dueDate : undefined,
        marks: isCompleted ? (78 + (charCodeSum % 21)) : undefined
      };
    }
  });
};

// Simulated current system date (using reference date July 4, 2026)
const CURRENT_DATE = "2026-07-04";

export default function AssignmentManagerTab({
  assignments,
  onUpdateAssignments,
  subjects
}: AssignmentManagerTabProps) {
  // Mode selection: "student" or "professor"
  const [currentMode, setCurrentMode] = React.useState<"student" | "professor">("student");
  
  // Password prompt states for Professor Dashboard
  const [passwordInput, setPasswordInput] = React.useState("");
  const [isProfUnlocked, setIsProfUnlocked] = React.useState(() => {
    return localStorage.getItem("prof_dashboard_unlocked") === "true";
  });
  const [passwordError, setPasswordError] = React.useState(false);

  // Professor Tab sub-navigation
  const [profSubTab, setProfSubTab] = React.useState<"post" | "progress" | "grading">("post");

  // Student upload/interactive states
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<string | null>(null);
  const [studentFileName, setStudentFileName] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [studentNameInput, setStudentNameInput] = React.useState("Saranya S");
  const [submitError, setSubmitError] = React.useState("");

  // Assignment Posting form states
  const [postTitle, setPostTitle] = React.useState("");
  const [postSubject, setPostSubject] = React.useState(subjects[0] || "DBMS");
  const [postDueDate, setPostDueDate] = React.useState("2026-07-15");
  const [postPriority, setPostPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [postHours, setPostHours] = React.useState(4);

  // Assignment Editing states
  const [editingAssignmentId, setEditingAssignmentId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editSubject, setEditSubject] = React.useState("");
  const [editDueDate, setEditDueDate] = React.useState("");
  const [editPriority, setEditPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editHours, setEditHours] = React.useState(4);

  const handleStartEditAssignment = (a: Assignment) => {
    setEditingAssignmentId(a.id);
    setEditTitle(a.title);
    setEditSubject(a.subject);
    setEditDueDate(a.dueDate);
    setEditPriority(a.priority);
    setEditHours(a.estimatedHours);
  };

  const handleSaveEditAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignmentId || !editTitle.trim() || !editSubject.trim()) return;

    const updated = assignments.map(a => {
      if (a.id === editingAssignmentId) {
        return {
          ...a,
          title: editTitle.trim(),
          subject: editSubject.trim(),
          dueDate: editDueDate,
          priority: editPriority,
          estimatedHours: editHours
        };
      }
      return a;
    });

    onUpdateAssignments(updated);
    setEditingAssignmentId(null);
    alert("Assignment details successfully updated!");
  };

  const handleCancelEditAssignment = () => {
    setEditingAssignmentId(null);
  };

  // Filter/Search states
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Pending' | 'Completed'>('All');

  // Grading states
  const [gradingAssignmentId, setGradingAssignmentId] = React.useState<string>("");
  const [gradingStudentName, setGradingStudentName] = React.useState<string>("");
  const [assignedMarks, setAssignedMarks] = React.useState<number>(85);
  const [gradingSearchQuery, setGradingSearchQuery] = React.useState("");

  // Effect to automatically select defaults for grading if lists update
  React.useEffect(() => {
    if (assignments.length > 0) {
      if (!gradingAssignmentId) {
        setGradingAssignmentId(assignments[0].id);
      }
    }
  }, [assignments, gradingAssignmentId]);

  React.useEffect(() => {
    if (gradingAssignmentId) {
      const selectedAssign = assignments.find(a => a.id === gradingAssignmentId);
      if (selectedAssign) {
        const subs = getAssignmentSubmissions(selectedAssign);
        if (subs.length > 0 && !gradingStudentName) {
          setGradingStudentName(subs[0].studentName);
          setAssignedMarks(subs[0].marks || 85);
        }
      }
    }
  }, [gradingAssignmentId, assignments, gradingStudentName]);

  // Handle password entry
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin") {
      setIsProfUnlocked(true);
      setPasswordError(false);
      localStorage.setItem("prof_dashboard_unlocked", "true");
    } else {
      setPasswordError(true);
      setIsProfUnlocked(false);
    }
  };

  // Log out or lock professor portal
  const handleLockProfessor = () => {
    setIsProfUnlocked(false);
    setPasswordInput("");
    localStorage.removeItem("prof_dashboard_unlocked");
  };

  // Handle student simulated submission file upload
  const handleStudentFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setStudentFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudentFileName(e.target.files[0].name);
    }
  };

  // Handle student locks-in their assignment
  const handleStudentSubmitTask = (assignmentId: string) => {
    if (!studentFileName.trim()) return;
    
    if (!studentNameInput.trim()) {
      setSubmitError("Please enter your registered student name.");
      return;
    }

    const matched = DEFAULT_STUDENTS.find(
      s => s.studentName.trim().toLowerCase() === studentNameInput.trim().toLowerCase()
    );

    if (!matched) {
      setSubmitError(`"${studentNameInput}" is not in the pre-registered 105-student ledger. Please enter your valid registered name (e.g. "Saranya S", "Amit Patel", "Priya Sen").`);
      return;
    }

    setSubmitError("");

    const updated = assignments.map(a => {
      if (a.id === assignmentId) {
        const subs = getAssignmentSubmissions(a);
        const updatedSubs = subs.map(s => {
          if (s.studentName.toLowerCase() === matched.studentName.toLowerCase()) {
            return {
              ...s,
              status: "Completed" as const,
              fileUploaded: studentFileName,
              submittedAt: CURRENT_DATE
            };
          }
          return s;
        });

        const isSaranya = matched.studentName.toLowerCase() === "saranya s";
        return {
          ...a,
          status: isSaranya ? ("Completed" as const) : a.status,
          fileUploaded: isSaranya ? studentFileName : a.fileUploaded,
          submissions: updatedSubs
        };
      }
      return a;
    });

    onUpdateAssignments(updated);
    setStudentFileName("");
    setSelectedAssignmentId(null);
  };

  // Handle professor posting a new assignment
  const handleProfessorPostAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    const newAssignmentId = `assign-${Date.now()}`;
    const newAssignment: Assignment = {
      id: newAssignmentId,
      title: postTitle.trim(),
      subject: postSubject,
      dueDate: postDueDate,
      priority: postPriority,
      status: "Pending",
      estimatedHours: postHours
    };

    // Pre-initialize submissions for this assignment
    const initialSubs = DEFAULT_STUDENTS.map(s => {
      return {
        studentName: s.studentName,
        rollNo: s.rollNo,
        status: "Pending" as const
      };
    });
    newAssignment.submissions = initialSubs;

    onUpdateAssignments([newAssignment, ...assignments]);
    setPostTitle("");
    alert(`Successfully posted new assignment for ${postSubject}!`);
  };

  // Handle deleting an assignment
  const handleDeleteAssignment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const updated = assignments.filter(a => a.id !== id);
      onUpdateAssignments(updated);
    }
  };

  // Handle professor grading a student submission
  const handleSaveStudentGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignmentId || !gradingStudentName) return;

    const updated = assignments.map(a => {
      if (a.id === gradingAssignmentId) {
        const subs = getAssignmentSubmissions(a);
        const updatedSubs = subs.map(s => {
          if (s.studentName === gradingStudentName) {
            return {
              ...s,
              marks: Number(assignedMarks)
            };
          }
          return s;
        });

        // Sync main student file metrics if graded student is Saranya S
        const isSaranya = gradingStudentName === "Saranya S";
        return {
          ...a,
          status: isSaranya ? "Completed" as const : a.status,
          submissions: updatedSubs
        };
      }
      return a;
    });

    onUpdateAssignments(updated);
    alert(`Successfully saved grade (${assignedMarks}/100) for ${gradingStudentName}!`);
  };

  // Helper: check if due date is passed
  const isPastDueDate = (dueDateStr: string) => {
    return dueDateStr < CURRENT_DATE;
  };

  // Subject completion progress calculations
  const getSubjectProgressMetrics = () => {
    const subjectProgress: Record<string, { total: number; completed: number; assignmentsCount: number }> = {};
    
    // Initialize standard subjects
    subjects.forEach(s => {
      subjectProgress[s] = { total: 0, completed: 0, assignmentsCount: 0 };
    });

    // Traverse all assignments
    assignments.forEach(a => {
      if (!subjectProgress[a.subject]) {
        subjectProgress[a.subject] = { total: 0, completed: 0, assignmentsCount: 0 };
      }
      subjectProgress[a.subject].assignmentsCount += 1;
      
      const subs = getAssignmentSubmissions(a);
      subs.forEach(s => {
        subjectProgress[a.subject].total += 1;
        if (s.status === "Completed") {
          subjectProgress[a.subject].completed += 1;
        }
      });
    });

    return subjectProgress;
  };

  const subjectMetrics = getSubjectProgressMetrics();

  // General counts for students
  const pendingCount = assignments.filter(a => a.status === "Pending").length;
  const completedCount = assignments.filter(a => a.status === "Completed").length;

  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const filteredAndSortedAssignments = assignments
    .filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.subject.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const pDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const selectedGradingAssignObj = assignments.find(a => a.id === gradingAssignmentId);
  const gradingSubmissions = selectedGradingAssignObj ? getAssignmentSubmissions(selectedGradingAssignObj) : [];
  const selectedStudentSubObj = gradingSubmissions.find(s => s.studentName === gradingStudentName);

  // Generate a mock PDF preview visual component dynamically based on selected assignment and student
  const renderPdfDocument = (assignmentTitle: string, studentName: string, subject: string) => {
    return (
      <div className="bg-white border-2 border-slate-300 shadow-lg p-6 max-w-full mx-auto space-y-5 font-serif text-slate-800 min-h-[580px] relative rounded-md select-none">
        {/* Mock PDF Viewer Toolbar Header decoration */}
        <div className="absolute top-2 right-2 bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          ACADEMIC SUBMISSION PDF
        </div>

        <div className="text-center border-b border-slate-200 pb-3 space-y-1 mt-3">
          <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900 font-sans">{subject} LAB EXPERIMENT</h1>
          <p className="text-[10px] text-slate-500 font-mono">
            Candidate: <span className="font-semibold text-slate-700">{studentName}</span> | Roll: 22IT_{studentName.split(" ")[0].toUpperCase()}
          </p>
          <p className="text-[9px] text-slate-400 font-mono">Timestamp: 2026-07-03 14:22:15 UTC | Grade Status: {selectedStudentSubObj?.marks !== undefined ? `Graded (${selectedStudentSubObj.marks}/100)` : "Pending Evaluation"}</p>
        </div>

        <div className="space-y-3.5 text-[11px] leading-relaxed text-justify">
          <h2 className="text-xs font-bold text-slate-900 font-sans border-l-4 border-slate-700 pl-2">
            Task Definition: {assignmentTitle}
          </h2>
          
          <p className="indent-4 italic text-slate-600">
            <strong>Abstract Summary —</strong> This submission represents the technical findings, system implementation constraints, and algorithmic complexity metrics compiled during the execution of this module's coursework. All code vectors have been optimized to compile seamlessly.
          </p>

          <div className="bg-slate-950 p-3 rounded font-mono text-[9px] text-emerald-400 border border-slate-800 overflow-x-auto whitespace-pre leading-snug">
            {`/**
 * Verified Solution Block for ${studentName}
 * Subject: ${subject}
 */
public class CoreSolutionsUnit {
    public static void main(String[] args) {
        System.out.println("Initializing runtime testing harness...");
        long initTime = System.nanoTime();
        
        // Execute dynamic solver routine
        boolean result = runAlgorithmicVerification();
        
        long totalMs = (System.nanoTime() - initTime) / 1000000;
        System.out.println("Status: " + (result ? "SUCCESS" : "FAIL"));
        System.out.println("Latency: " + totalMs + "ms");
    }

    private static boolean runAlgorithmicVerification() {
        // Optimal time and space complexity constraints implemented
        return true;
    }
}`}
          </div>

          <h3 className="font-bold text-slate-900 font-sans text-xs mt-3">Methodology & Performance Analysis</h3>
          <p>
            The execution characteristics adhere strictly to the module requirements. We implemented efficient space optimization techniques, minimizing memory allocation overhead. Under concurrency load testing (up to 1,000 requests/sec), memory footprint stable states were achieved, indicating a 15% latency reduction.
          </p>

          <h3 className="font-bold text-slate-900 font-sans text-xs">Conclusion</h3>
          <p>
            The project operates successfully. No syntax warnings or structural leaks were detected. Ready for modules certification.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3 text-center text-[9px] text-slate-400 font-mono absolute bottom-4 left-0 right-0">
          Page 1 of 1 — Secure Digital PDF Document Viewer
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="assignment-manager-tab-container">
      
      {/* Role Switcher & Header Bar */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-emerald-600" /> Academic Assignment Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Manage academic work scopes, upload digital solutions, check due date blocks, track student completion statistics, and execute professional PDF grading.
          </p>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setCurrentMode("student")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
              ${currentMode === "student" 
                ? "bg-white text-slate-800 shadow-xs border border-slate-200" 
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            <GraduationCap className="h-4 w-4 text-indigo-600" /> Student View
          </button>
          
          <button
            onClick={() => setCurrentMode("professor")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
              ${currentMode === "professor" 
                ? "bg-white text-slate-800 shadow-xs border border-slate-200" 
                : "text-slate-500 hover:text-slate-800"
              }`}
            id="prof-mode-btn"
          >
            <UserCog className="h-4 w-4 text-emerald-600" /> Professor View
          </button>
        </div>
      </div>

      {/* STUDENT MODE WORKSPACE */}
      {currentMode === "student" && (
        <div className="space-y-6">
          
          {/* Analytics Row for Student */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">YOUR PENDING ASSIGNMENTS</span>
                <div className="font-mono font-bold text-xl text-slate-800">{pendingCount} Tasks</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">YOUR COMPLETED SUBMISSIONS</span>
                <div className="font-mono font-bold text-xl text-slate-800">{completedCount} Submissions</div>
              </div>
            </div>
          </div>

          {/* Interactive Assignment Submit Drawer/Form (if active) */}
          {selectedAssignmentId && (() => {
            const activeAssign = assignments.find(a => a.id === selectedAssignmentId);
            if (!activeAssign) return null;
            const overdue = isPastDueDate(activeAssign.dueDate);

            return (
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/80 shadow-md space-y-4 animate-in slide-in-from-top-4 duration-200">
                <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-sans flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-indigo-600" /> Submit Assignment Workspace
                    </h3>
                    <p className="text-xs text-indigo-950 mt-0.5">Title: "{activeAssign.title}"</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedAssignmentId(null);
                      setStudentFileName("");
                    }}
                    className="p-1 hover:bg-slate-200 rounded-lg transition"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-600">Subject:</span>
                    <span className="ml-1 px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[11px] font-bold">{activeAssign.subject}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-600">Due Submission Date:</span>
                    <span className="ml-1 text-slate-800 font-mono font-bold flex items-center gap-1 inline-flex">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" /> {activeAssign.dueDate} 
                      {overdue && <span className="text-[10px] bg-red-100 border border-red-300 text-red-700 px-1.5 py-0.2 rounded uppercase font-bold ml-1">Expired</span>}
                    </span>
                  </div>
                </div>

                {overdue ? (
                  <div className="p-5 bg-red-50 border border-red-200 rounded-xl space-y-2 text-center text-red-950">
                    <div className="text-2xl">🚫</div>
                    <h4 className="font-bold text-red-800 text-sm">Submission Locked (Past Due Date)</h4>
                    <p className="text-xs leading-relaxed max-w-md mx-auto">
                      This assignment was due on <strong className="font-mono">{activeAssign.dueDate}</strong>. The deadline has completed, so you are no longer permitted to upload support files or submit coursework files. Please contact your course administrator.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Student Name Override Input */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Your Registered Student Name</label>
                      <input
                        type="text"
                        value={studentNameInput}
                        onChange={(e) => {
                          setStudentNameInput(e.target.value);
                          setSubmitError("");
                        }}
                        placeholder="e.g. Saranya S"
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                      />
                      <p className="text-[10px] text-slate-400">
                        Type your name exactly as registered (case-insensitive). You can enter other registered names to submit on behalf of other classmates (e.g. <strong>Amit Patel</strong>, <strong>Priya Sen</strong>).
                      </p>
                      {submitError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-[11px] font-medium leading-relaxed">
                          ⚠️ {submitError}
                        </div>
                      )}
                    </div>

                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleStudentFileDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                        ${isDragging ? "border-indigo-500 bg-indigo-50/20" : "border-slate-300 bg-white hover:bg-slate-50"}
                      `}
                    >
                      <input
                        type="file"
                        id="student-file-picker"
                        className="hidden"
                        onChange={handleStudentFileChange}
                      />
                      <label htmlFor="student-file-picker" className="cursor-pointer space-y-2 block">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto shadow-2xs">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-xs font-sans text-slate-600">
                          {studentFileName ? (
                            <span className="font-mono font-semibold text-indigo-700">{studentFileName}</span>
                          ) : (
                            <span>Drag and drop your report here, or <span className="text-indigo-600 font-bold underline">click to browse</span></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">PDF format recommended (Max 20MB)</p>
                      </label>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(null);
                          setStudentFileName("");
                          setSubmitError("");
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-4 py-2.5 rounded-lg font-bold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleStudentSubmitTask(activeAssign.id)}
                        disabled={!studentFileName.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-xs px-6 py-2.5 rounded-lg font-bold transition disabled:cursor-not-allowed shadow-xs"
                      >
                        Submit Active Coursework File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Student Assignments List */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coursework title or subject..."
                  className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto justify-end">
                <span className="text-slate-400 shrink-0 text-xs flex items-center gap-1 font-sans">
                  <Filter className="h-3 w-3" /> Filters:
                </span>
                <div className="flex bg-slate-100 rounded-lg p-0.5 border">
                  {(['All', 'Pending', 'Completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer
                        ${statusFilter === status 
                          ? "bg-white text-slate-800 shadow-3xs" 
                          : "text-slate-500 hover:text-slate-800"
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredAndSortedAssignments.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed rounded-lg text-slate-400 text-xs">
                No coursework assignments matching your search criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedAssignments.map((as) => {
                  const overdue = isPastDueDate(as.dueDate);
                  const submissions = getAssignmentSubmissions(as);
                  const mySubmission = submissions.find(s => s.studentName === "Saranya S");
                  const marks = mySubmission?.marks;

                  return (
                    <div 
                      key={as.id} 
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition hover:shadow-3xs
                        ${as.status === "Completed" ? "bg-slate-50/50 border-slate-200/80" : "bg-white border-slate-100"}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {as.status === "Completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : overdue ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-slate-300 rounded-full" />
                          )}
                        </div>

                        <div>
                          <h4 className={`font-sans font-semibold text-xs leading-snug text-slate-800 ${as.status === "Completed" ? 'line-through text-slate-400' : ''}`}>
                            {as.title}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold uppercase">{as.subject}</span>
                            
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Due: {as.dueDate}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {as.estimatedHours} hrs est.
                            </span>

                            {overdue && !as.fileUploaded && (
                              <span className="text-red-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                [Deadline Completed - Cannot Submit]
                              </span>
                            )}
                          </div>

                          {as.fileUploaded && (
                            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50/60 px-2 py-1 rounded border border-emerald-100 w-fit">
                              <FileCheck className="h-3.5 w-3.5" /> File Uploaded: {as.fileUploaded}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        {/* Grades Display if graded */}
                        {marks !== undefined ? (
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-indigo-600" /> Grade: {marks}/100
                          </span>
                        ) : as.status === "Completed" ? (
                          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-mono font-bold uppercase">
                            Pending Grading
                          </span>
                        ) : null}

                        <span className={`px-2 py-1 text-[9px] font-bold rounded font-mono uppercase tracking-wider
                          ${as.priority === 'High' ? 'bg-rose-100 text-rose-700' : as.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}
                        `}>
                          {as.priority} PRIORITY
                        </span>

                        {as.status !== "Completed" && (
                          <button
                            onClick={() => {
                              setSelectedAssignmentId(as.id);
                              setStudentFileName("");
                            }}
                            className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg cursor-pointer transition
                              ${overdue 
                                ? "bg-slate-300 hover:bg-slate-400 cursor-not-allowed" 
                                : "bg-indigo-600 hover:bg-indigo-700"
                              }`}
                          >
                            {overdue ? "View Closed" : "Submit File"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* PROFESSOR MODE WORKSPACE */}
      {currentMode === "professor" && (
        <div className="space-y-6">
          
          {/* Password Authentication Portal */}
          {!isProfUnlocked ? (
            <div className="bg-white rounded-xl border border-slate-100 p-8 max-w-md mx-auto shadow-sm space-y-6 text-center animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-800 text-base">Professor Authentication Required</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The academic grading ledger and curriculum designer require verified credential overrides. Please enter the professor portal security key.
                </p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">Security Password</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                  {passwordError && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">
                      ❌ Invalid professor security password. Try again.
                    </p>
                  )}
                </div>



                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                >
                  Unlock Professor Portal
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Authenticated Header & Subtabs */}
              <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-lg">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Professor Session Overrides Active</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">Faculty User ID: <code>prof_academic_editor_2026</code></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex bg-emerald-100/50 rounded-lg p-0.5 border border-emerald-200">
                    <button
                      onClick={() => setProfSubTab("post")}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all
                        ${profSubTab === "post" ? "bg-white text-emerald-900 shadow-3xs" : "text-emerald-700 hover:text-emerald-900"}`}
                    >
                      1. Assignment Posting
                    </button>
                    <button
                      onClick={() => setProfSubTab("progress")}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all
                        ${profSubTab === "progress" ? "bg-white text-emerald-900 shadow-3xs" : "text-emerald-700 hover:text-emerald-900"}`}
                    >
                      2. Student Progress
                    </button>
                    <button
                      onClick={() => setProfSubTab("grading")}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all
                        ${profSubTab === "grading" ? "bg-white text-emerald-900 shadow-3xs" : "text-emerald-700 hover:text-emerald-900"}`}
                    >
                      3. Submission Grading
                    </button>
                  </div>

                  <button
                    onClick={handleLockProfessor}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                  >
                    Lock Portal
                  </button>
                </div>
              </div>

              {/* PROFESSOR TAB 1: Assignment Posting */}
              {profSubTab === "post" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                  
                  {/* Left: Posting Form or Edit Form (5 cols) */}
                  {editingAssignmentId ? (
                    <form onSubmit={handleSaveEditAssignment} className="lg:col-span-5 bg-amber-50/75 p-6 rounded-xl border border-amber-200 shadow-sm space-y-4 h-fit">
                      <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                        <h3 className="font-display font-semibold text-amber-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Edit2 className="h-4 w-4" /> Curriculum Task Editor
                        </h3>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                          Editing
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-900 block">Assignment Subject Name</label>
                        <input
                          type="text"
                          required
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          placeholder="e.g., DBMS, Computer Networks"
                          className="w-full bg-white border border-amber-200 p-2.5 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                        />
                        <p className="text-[10px] text-amber-800/80 leading-normal">
                          Modify the subject name to dynamically update all references across active student progress models.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-900 block">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="e.g., Relational schema design and data modeling"
                          className="w-full bg-white border border-amber-200 p-2.5 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-900 block">Due Date to Complete Column</label>
                        <input
                          type="date"
                          required
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="w-full bg-white border border-amber-200 p-2.5 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-amber-900 block">Priority Level</label>
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as any)}
                            className="w-full bg-white border border-amber-200 p-2.5 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:border-amber-600"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-amber-900 block">Estimated Hours</label>
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={editHours}
                            onChange={(e) => setEditHours(Number(e.target.value))}
                            className="w-full bg-white border border-amber-200 p-2.5 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelEditAssignment}
                          className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-xs rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save className="h-4 w-4" /> Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleProfessorPostAssignment} className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 h-fit">
                      <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider text-slate-400 font-mono border-b pb-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4 text-emerald-600" /> Coursework Curriculum Designer
                      </h3>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Assignment Subject Category</label>
                        <select
                          value={postSubject}
                          onChange={(e) => setPostSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        >
                          {subjects.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          placeholder="e.g., Relational schema design and data modeling"
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Due Date to Complete Column</label>
                        <input
                          type="date"
                          required
                          value={postDueDate}
                          onChange={(e) => setPostDueDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">Priority Level</label>
                          <select
                            value={postPriority}
                            onChange={(e) => setPostPriority(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">Estimated Hours</label>
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={postHours}
                            onChange={(e) => setPostHours(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Post New Academic Task
                      </button>
                    </form>
                  )}

                  {/* Right: Active Posting Log (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider text-slate-400 font-mono">
                      Current Curriculum Deliverables Log ({assignments.length})
                    </h3>

                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                      {assignments.map(as => {
                        const overdue = isPastDueDate(as.dueDate);
                        const isBeingEdited = as.id === editingAssignmentId;
                        return (
                          <div 
                            key={as.id} 
                            className={`p-3 border rounded-lg flex justify-between items-center gap-3 transition
                              ${isBeingEdited 
                                ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-100" 
                                : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"}`}
                          >
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-bold text-slate-800 leading-tight">{as.title}</h4>
                              
                              <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-mono text-slate-500">
                                <span className="px-1.5 py-0.2 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded uppercase font-bold">{as.subject}</span>
                                <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> Due: {as.dueDate}</span>
                                {overdue && <span className="text-rose-600 font-bold uppercase">[LOCKED - DEADLINE EXPIRED]</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditAssignment(as)}
                                className="p-1.5 bg-amber-50 border border-amber-100 hover:bg-amber-500 hover:text-white text-amber-700 rounded transition cursor-pointer"
                                title="Edit / Update Subject Name & Title"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteAssignment(as.id)}
                                className="p-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:text-white text-rose-700 rounded transition cursor-pointer font-bold"
                                title="Delete Assignment"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* PROFESSOR TAB 2: Student Progress Percentage (Subject-wise) */}
              {profSubTab === "progress" && (
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="border-b pb-3 border-slate-100">
                    <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                      <BookCheck className="h-5 w-5 text-emerald-600" /> Student Progress Percentage by Subject Separately
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Calculates the aggregate completion percentage of the class across all assignments registered under each course subject separately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(subjectMetrics).map(([subjectName, data]) => {
                      const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                      
                      return (
                        <div key={subjectName} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 shadow-3xs transition hover:border-emerald-200">
                          <div className="flex justify-between items-center">
                            <span className="font-sans font-bold text-slate-800 text-xs">{subjectName}</span>
                            <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              {percentage}% Completed
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>{data.assignmentsCount} Assignment(s) Registered</span>
                            <span>{data.completed} / {data.total} Submissions Received</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PROFESSOR TAB 3: Student Submissions & PDF Grading Lab */}
              {profSubTab === "grading" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-200">
                  
                  {/* Left Section: 105+ Student Ledger Spreadsheet Gradebook Grid (xl:col-span-7) */}
                  <div className="xl:col-span-7 bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 flex flex-col overflow-hidden">
                    <div className="border-b pb-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            <GraduationCap className="h-5 w-5 text-emerald-600" /> Faculty Ledger Gradebook Matrix
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Click any student's name or assignment cell directly to review the report document in <strong>PDF format only</strong> and evaluate coursework marks out of 100.
                          </p>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded font-mono font-semibold">
                          Spreadsheet Active
                        </span>
                      </div>
                    </div>

                    {/* Search Candidate Bar */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Search className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={gradingSearchQuery}
                        onChange={(e) => setGradingSearchQuery(e.target.value)}
                        placeholder="Search gradebook by student name or roll number (e.g. Saranya S, 22IT01)..."
                        className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>

                    {/* Scrollable Spreadsheet Table Container */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-500 divide-x divide-slate-200/80">
                              <th className="p-3 w-20 font-bold sticky top-0 bg-slate-50 z-10">Roll No</th>
                              <th className="p-3 w-44 font-bold sticky top-0 bg-slate-50 z-10">Student Name</th>
                              
                              {/* Dynamic Assignment Columns (projects) */}
                              {assignments.map((as, idx) => (
                                <th key={as.id} className="p-3 w-48 text-center font-bold sticky top-0 bg-slate-50 z-10">
                                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight truncate">
                                    {as.subject}
                                  </div>
                                  <div className="text-[8px] font-mono text-slate-400 capitalize truncate mt-0.5" title={as.title}>
                                    P{idx + 1}: {as.title}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150">
                            {(() => {
                              const filteredStudents = DEFAULT_STUDENTS.filter(s => {
                                const query = gradingSearchQuery.toLowerCase().trim();
                                if (!query) return true;
                                return s.studentName.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query);
                              });

                              if (filteredStudents.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={2 + assignments.length} className="p-8 text-center text-xs text-slate-400 font-sans">
                                      No registered student records match "{gradingSearchQuery}".
                                    </td>
                                  </tr>
                                );
                              }

                              return filteredStudents.map((ds, rIdx) => {
                                const isRowSelected = ds.studentName.toLowerCase() === gradingStudentName.toLowerCase();
                                return (
                                  <tr 
                                    key={ds.studentName} 
                                    className={`divide-x divide-slate-100 text-xs transition-colors duration-150
                                      ${isRowSelected ? "bg-emerald-50/30" : rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                                    `}
                                  >
                                    {/* Roll No */}
                                    <td className="p-3 font-mono font-bold text-slate-600">
                                      {ds.rollNo}
                                    </td>

                                    {/* Student Name */}
                                    <td className={`p-3 font-sans font-bold text-slate-800
                                      ${isRowSelected ? "text-emerald-900" : ""}
                                    `}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setGradingStudentName(ds.studentName);
                                          // Load marks for the currently selected assignment
                                          const currentAssign = assignments.find(a => a.id === gradingAssignmentId) || assignments[0];
                                          if (currentAssign) {
                                            setGradingAssignmentId(currentAssign.id);
                                            const subs = getAssignmentSubmissions(currentAssign);
                                            const subObj = subs.find(s => s.studentName.toLowerCase() === ds.studentName.toLowerCase());
                                            setAssignedMarks(subObj?.marks || 85);
                                          }
                                        }}
                                        className="hover:underline text-left w-full focus:outline-none cursor-pointer"
                                      >
                                        {ds.studentName}
                                      </button>
                                    </td>

                                    {/* Dynamic Project Columns */}
                                    {assignments.map(as => {
                                      const subs = getAssignmentSubmissions(as);
                                      const subObj = subs.find(s => s.studentName.toLowerCase() === ds.studentName.toLowerCase());
                                      const isCellSelected = (gradingStudentName.toLowerCase() === ds.studentName.toLowerCase()) && (gradingAssignmentId === as.id);
                                      const isSubmitted = subObj?.status === "Completed";
                                      
                                      return (
                                        <td 
                                          key={as.id} 
                                          onClick={() => {
                                            setGradingAssignmentId(as.id);
                                            setGradingStudentName(ds.studentName);
                                            setAssignedMarks(subObj?.marks || 85);
                                          }}
                                          className={`p-2.5 text-center transition-all cursor-pointer select-none relative group
                                            ${isCellSelected 
                                              ? "bg-emerald-100/60 ring-2 ring-emerald-500 ring-inset" 
                                              : "hover:bg-slate-100/50"}`}
                                        >
                                          {isSubmitted ? (
                                            subObj.marks !== undefined ? (
                                              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-md text-[10px] font-mono font-bold inline-block shadow-3xs">
                                                ★ {subObj.marks} / 100
                                              </span>
                                            ) : (
                                              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[9px] font-semibold inline-block font-sans">
                                                Submitted
                                              </span>
                                            )
                                          ) : (
                                            <span className="text-rose-600 bg-rose-50/50 border border-rose-100 px-2 py-0.5 rounded text-[9px] font-semibold inline-block">
                                              Not Submitted
                                            </span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Evaluation & Dynamic PDF Viewer (xl:col-span-5) */}
                  <div className="xl:col-span-5 space-y-6">
                    
                    {/* Selected Student Grading Form */}
                    {selectedStudentSubObj ? (
                      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <div className="border-b pb-2.5 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Candidate Profile</h4>
                            <h2 className="text-sm font-bold text-slate-800 font-sans mt-0.5">{selectedStudentSubObj.studentName}</h2>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {selectedStudentSubObj.rollNo}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-500">Submission Statement Status:</span>
                            <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px]
                              ${selectedStudentSubObj.status === "Completed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-200"}`}
                            >
                              {selectedStudentSubObj.status === "Completed" ? "SUBMITTED" : "NOT SUBMITTED"}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-500">Digital Document:</span>
                            <span className="font-mono text-slate-700 break-all text-right max-w-[200px]">
                              {selectedStudentSubObj.fileUploaded || "Not Submitted"}
                            </span>
                          </div>

                          {selectedStudentSubObj.marks !== undefined && (
                            <div className="flex justify-between items-center border-t pt-2 mt-2">
                              <span className="font-semibold text-slate-500">Awarded Score:</span>
                              <span className="font-bold font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100 text-xs">
                                {selectedStudentSubObj.marks} / 100
                              </span>
                            </div>
                          )}
                        </div>

                        {selectedStudentSubObj.status === "Completed" ? (
                          <form onSubmit={handleSaveStudentGrade} className="space-y-4 pt-1">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700">Assign Grade Marks (0 - 100)</label>
                                <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                  {assignedMarks} / 100
                                </span>
                              </div>
                              
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={assignedMarks}
                                onChange={(e) => setAssignedMarks(Number(e.target.value))}
                                className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                              
                              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                <span>0 = Fail</span>
                                <span>100 = Perfect</span>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Award className="h-4 w-4" /> Save Grade & Marks Override
                            </button>
                          </form>
                        ) : (
                          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-center text-xs text-amber-900 leading-relaxed font-sans space-y-1">
                            <p className="font-bold">⚠️ Submission Statement: Not Submitted</p>
                            <p className="text-[11px] text-amber-800">
                              This student has not submitted this coursework yet. Grade evaluation and feedback parameters are locked until the candidate logs in and transmits their coursework document.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* PDF Reader Panel */}
                    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
                      {/* PDF Reader toolbar */}
                      <div className="flex items-center justify-between border-b pb-2 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-rose-500 shrink-0" /> 
                          Secure_Acrobat_PDF_v5.4.1
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold">100%</span>
                          <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold">Page 1/1</span>
                        </div>
                      </div>

                      {/* PDF Render */}
                      {selectedGradingAssignObj && selectedStudentSubObj && selectedStudentSubObj.status === "Completed" ? (
                        renderPdfDocument(
                          selectedGradingAssignObj.title, 
                          selectedStudentSubObj.studentName, 
                          selectedGradingAssignObj.subject
                        )
                      ) : (
                        <div className="bg-white border rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center h-[320px] shadow-xs border-dashed border-slate-300">
                          <div className="text-4xl">📄</div>
                          <h4 className="font-mono text-xs font-bold text-slate-600 uppercase mt-4">Waiting for Submitted Document</h4>
                          <p className="text-[11px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                            No active document is available to render. Please select a student from the ledger who has already "Submitted" their coursework files.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
