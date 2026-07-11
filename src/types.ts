/**
 * Types and interfaces for the AI College Success Agent
 */

export interface StudentProfile {
  name: string;
  rollNo: string;
  course: string;
  semester: number;
  avatar: string;
  placementReadinessScore: number; // 0 - 100
}

export interface AttendanceRecord {
  id: string;
  subjectName: string;
  attended: number;
  total: number;
}

export interface StudentSubmission {
  studentName: string;
  rollNo: string;
  status: 'Pending' | 'Completed';
  fileUploaded?: string;
  submittedAt?: string;
  marks?: number; // 0 to 100
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  estimatedHours: number;
  fileUploaded?: string; // name of simulated file
  submissions?: StudentSubmission[];
}

export interface ClassSchedule {
  id: string;
  day: string; // 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  time: string;
  subject: string;
  room: string;
  isLab: boolean;
}

export interface PlacementItem {
  id: string;
  category: 'Coding' | 'Aptitude' | 'HR';
  topic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  status: 'Not Started' | 'Completed';
  aiHint?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  borrowedDate: string;
  status: 'Borrowed' | 'Returned';
  fine: number;
}

export interface StudyPlan {
  subjects: string[];
  examDate: string;
  hoursAvailable: number;
  schedule: Array<{
    day: string;
    topic: string;
    hours: number;
    completed: boolean;
  }>;
  dailyTargets: string[];
  revisionTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  weeklyStudyHours: Array<{ day: string; planned: number; actual: number }>;
  codingSolved: Array<{ month: string; problems: number }>;
  marksHistory: Array<{ exam: string; score: number; average: number }>;
  weeklyProgress: Array<{ week: string; studyHours: number; assignmentsCompleted: number }>;
}

export interface ExtraAIScoring {
  semesterSuccessScore: number;
  reasons: string[];
  productivityAnalyzer: {
    plannedHours: number;
    actualHours: number;
    suggestion: string;
  };
  weeklyReport: {
    attendanceSummary: string;
    assignmentsSummary: string;
    studyHoursSummary: string;
    codingSummary: string;
    suggestions: string[];
  };
  examReadiness: Array<{
    subject: string;
    percentage: number;
  }>;
  motivationQuote: string;
}
