import { 
  StudentProfile, 
  AttendanceRecord, 
  Assignment, 
  ClassSchedule, 
  PlacementItem, 
  LibraryBook, 
  AnalyticsSummary, 
  ExtraAIScoring 
} from "./types";

export const initialStudentProfile: StudentProfile = {
  name: "Saranya S",
  rollNo: "",
  course: "IT Department",
  semester: 5,
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  placementReadinessScore: 0
};

export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: "sub-1", subjectName: "DBMS", attended: 26, total: 28 },
  { id: "sub-2", subjectName: "Operating Systems", attended: 21, total: 28 },
  { id: "sub-3", subjectName: "Computer Networks", attended: 16, total: 28 },
  { id: "sub-4", subjectName: "Java Programming", attended: 24, total: 28 },
  { id: "sub-5", subjectName: "Design & Analysis of Algorithms", attended: 25, total: 28 }
];

export const initialAssignments: Assignment[] = [
  {
    id: "assign-1",
    title: "SQL Query Optimization and Indexing Lab Work",
    subject: "DBMS",
    dueDate: "2026-07-05",
    priority: "High",
    status: "Pending",
    estimatedHours: 3
  },
  {
    id: "assign-2",
    title: "Multithreading and Synchronization Implementation",
    subject: "Operating Systems",
    dueDate: "2026-07-08",
    priority: "High",
    status: "Pending",
    estimatedHours: 4
  },
  {
    id: "assign-3",
    title: "Socket Programming in Java - Chat Application",
    subject: "Computer Networks",
    dueDate: "2026-07-12",
    priority: "Medium",
    status: "Completed",
    estimatedHours: 5,
    fileUploaded: "chat_app_socket.java"
  },
  {
    id: "assign-4",
    title: "Dynamic Programming - Longest Common Subsequence",
    subject: "Design & Analysis of Algorithms",
    dueDate: "2026-07-15",
    priority: "Low",
    status: "Pending",
    estimatedHours: 2
  },
  {
    id: "assign-5",
    title: "Java Swing GUI - College Management System",
    subject: "Java Programming",
    dueDate: "2026-07-20",
    priority: "Medium",
    status: "Pending",
    estimatedHours: 4
  }
];

export const initialSchedules: ClassSchedule[] = [
  // Monday
  { id: "sch-1", day: "Monday", time: "09:00 AM - 10:00 AM", subject: "DBMS", room: "L-301", isLab: false },
  { id: "sch-2", day: "Monday", time: "10:15 AM - 11:15 AM", subject: "Operating Systems", room: "L-302", isLab: false },
  { id: "sch-3", day: "Monday", time: "01:30 PM - 03:30 PM", subject: "Java Programming Lab", room: "Lab-2", isLab: true },
  
  // Tuesday
  { id: "sch-4", day: "Tuesday", time: "09:00 AM - 10:00 AM", subject: "Design & Analysis of Algorithms", room: "L-301", isLab: false },
  { id: "sch-5", day: "Tuesday", time: "11:30 AM - 12:30 PM", subject: "Computer Networks", room: "L-304", isLab: false },
  { id: "sch-6", day: "Tuesday", time: "01:30 PM - 03:30 PM", subject: "Operating Systems Lab", room: "Lab-4", isLab: true },

  // Wednesday
  { id: "sch-7", day: "Wednesday", time: "10:15 AM - 11:15 AM", subject: "DBMS", room: "L-301", isLab: false },
  { id: "sch-8", day: "Wednesday", time: "01:30 PM - 02:30 PM", subject: "Design & Analysis of Algorithms", room: "L-301", isLab: false },
  { id: "sch-9", day: "Wednesday", time: "02:45 PM - 03:45 PM", subject: "Computer Networks", room: "L-304", isLab: false },

  // Thursday
  { id: "sch-10", day: "Thursday", time: "09:00 AM - 11:00 AM", subject: "DBMS SQL Practicals", room: "Lab-1", isLab: true },
  { id: "sch-11", day: "Thursday", time: "11:30 AM - 12:30 PM", subject: "Java Programming", room: "L-302", isLab: false },
  { id: "sch-12", day: "Thursday", time: "01:30 PM - 02:30 PM", subject: "Operating Systems", room: "L-302", isLab: false },

  // Friday
  { id: "sch-13", day: "Friday", time: "09:00 AM - 10:00 AM", subject: "Design & Analysis of Algorithms", room: "L-301", isLab: false },
  { id: "sch-14", day: "Friday", time: "10:15 AM - 11:15 AM", subject: "Computer Networks", room: "L-304", isLab: false },
  { id: "sch-15", day: "Friday", time: "11:30 AM - 12:30 PM", subject: "Java Programming", room: "L-302", isLab: false }
];

export const initialPlacementItems: PlacementItem[] = [
  {
    id: "place-1",
    category: "Coding",
    topic: "Arrays & Strings",
    question: "Find the duplicate number in an array of N+1 integers where each integer is between 1 and N. Time complexity must be O(N) and extra space O(1).",
    difficulty: "Medium",
    company: "Amazon / Microsoft",
    status: "Completed",
    aiHint: "Use Floyd's Cycle Detection algorithm (two pointers: fast and slow)."
  },
  {
    id: "place-2",
    category: "Coding",
    topic: "Linked List",
    question: "Reverse a Linked List in groups of given size K.",
    difficulty: "Hard",
    company: "Google / Adobe",
    status: "Not Started",
    aiHint: "Process each K group recursively or iteratively, reversing links and reconnecting."
  },
  {
    id: "place-3",
    category: "Aptitude",
    topic: "Probability",
    question: "A bag contains 5 red and 3 blue balls. If two balls are drawn at random without replacement, what is the probability that both are red?",
    difficulty: "Easy",
    company: "TCS / Infosys",
    status: "Not Started",
    aiHint: "Total ways: 8C2. Favorable red draws: 5C2. Divide favorable by total."
  },
  {
    id: "place-4",
    category: "HR",
    topic: "Situational",
    question: "How do you handle conflict in a technical team environment? Give a past project example.",
    difficulty: "Medium",
    company: "Generic High-Tier HR",
    status: "Completed",
    aiHint: "Use the STAR technique. Emphasize active listening, collaborative compromise, and objective technical metrics."
  }
];

export const initialLibraryBooks: LibraryBook[] = [
  {
    id: "bk-1",
    title: "Database System Concepts (7th Edition)",
    author: "Silberschatz, Korth & Sudarshan",
    borrowedDate: "2026-06-17",
    dueDate: "2026-07-01",
    status: "Borrowed",
    fine: 10 // calculated based on overdue
  },
  {
    id: "bk-2",
    title: "Operating System Concepts",
    author: "Avi Silberschatz",
    borrowedDate: "2026-06-26",
    dueDate: "2026-07-10",
    status: "Borrowed",
    fine: 0
  },
  {
    id: "bk-3",
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest & Stein",
    borrowedDate: "2026-06-06",
    dueDate: "2026-06-20",
    status: "Borrowed",
    fine: 120
  },
  {
    id: "bk-4",
    title: "Computer Networks: A Systems Approach",
    author: "Larry Peterson & Bruce Davie",
    borrowedDate: "2026-06-11",
    dueDate: "2026-07-25",
    status: "Borrowed",
    fine: 0
  }
];

export const initialAnalyticsSummary: AnalyticsSummary = {
  weeklyStudyHours: [
    { day: "Mon", planned: 6, actual: 4.5 },
    { day: "Tue", planned: 5, actual: 5.5 },
    { day: "Wed", planned: 6, actual: 3.0 },
    { day: "Thu", planned: 4, actual: 4.5 },
    { day: "Fri", planned: 5, actual: 4.0 },
    { day: "Sat", planned: 6, actual: 6.5 },
    { day: "Sun", planned: 3, actual: 2.0 }
  ],
  codingSolved: [
    { month: "Feb", problems: 12 },
    { month: "Mar", problems: 18 },
    { month: "Apr", problems: 25 },
    { month: "May", problems: 32 },
    { month: "Jun", problems: 44 }
  ],
  marksHistory: [
    { exam: "Unit Test 1", score: 82, average: 71 },
    { exam: "Mid-Term", score: 85, average: 74 },
    { exam: "Unit Test 2", score: 89, average: 73 }
  ],
  weeklyProgress: [
    { week: "Wk 22", studyHours: 25, assignmentsCompleted: 2 },
    { week: "Wk 23", studyHours: 28, assignmentsCompleted: 3 },
    { week: "Wk 24", studyHours: 22, assignmentsCompleted: 1 },
    { week: "Wk 25", studyHours: 32, assignmentsCompleted: 4 },
    { week: "Wk 26", studyHours: 30, assignmentsCompleted: 3 }
  ]
};

export const initialAIScoring: ExtraAIScoring = {
  semesterSuccessScore: 84,
  reasons: [
    "✔ Overall attendance stands tall at an excellent 88%",
    "✔ Solved 44 complex coding & aptitude preparation questions",
    "✔ Completed critical socket network communication labs on time",
    "⚠ 2 major assignments in DBMS & OS require submission within 6 days",
    "⚠ Database indexing & normalization schemas require additional revision"
  ],
  productivityAnalyzer: {
    plannedHours: 35,
    actualHours: 30,
    suggestion: "Your focus was low on Wednesday. Try shifting complex programming work to Thursday morning to preserve cognitive energy."
  },
  weeklyReport: {
    attendanceSummary: "Attendance is solid. Safe above the 75% requirement across all five registered subjects.",
    assignmentsSummary: "Submitted 1 major practical work. 3 pending tasks have been automatically scheduled.",
    studyHoursSummary: "Spent 30 hours of actual focused studying, achieving 85.7% of your target commitment.",
    codingSummary: "Mastered linked lists reversing and array search string questions. Readiness rating raised by 3.5%.",
    suggestions: [
      "Dedicate Sunday morning to complete DBMS query plans.",
      "Engage with Operating System multi-threading practical tasks.",
      "Review the dynamic programming LCS algorithm on Saturday evening."
    ]
  },
  examReadiness: [
    { subject: "DBMS", percentage: 92 },
    { subject: "Operating Systems", percentage: 75 },
    { subject: "Computer Networks", percentage: 58 },
    { subject: "Java/Programming", percentage: 88 },
    { subject: "DSA/Algorithms", percentage: 89 }
  ],
  motivationQuote: "You are making tremendous, structured strides. Stay focused, stick to the generated planner, and let's lock in an outstanding semester!"
};
