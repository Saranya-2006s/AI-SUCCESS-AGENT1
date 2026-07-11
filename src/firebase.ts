import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { 
  StudentProfile, 
  AttendanceRecord, 
  Assignment, 
  ClassSchedule, 
  PlacementItem, 
  LibraryBook, 
  ChatMessage, 
  ExtraAIScoring 
} from "./types";

// Firebase configuration from environment variables
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase projectId is provided
const isConfigured = !!firebaseConfig.projectId;

let app: any = null;
let db: any = null;
let firebaseEnabled = false;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    firebaseEnabled = true;
    console.log("Firebase initialized successfully with project ID:", firebaseConfig.projectId);
  } catch (error) {
    console.warn("Failed to initialize Firebase app:", error);
  }
} else {
  console.log("Firebase is not fully configured yet. Running in Local Storage fallback mode.");
}

export { db };
export const isFirebaseActive = () => firebaseEnabled;

// Custom Error throwing standard following SKILL.md rules
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operation: OperationType;
  collection: string;
  projectId: string;
}

function handleFirestoreError(err: any, op: OperationType, col: string): never {
  const errorInfo: FirestoreErrorInfo = {
    error: err.message || String(err),
    operation: op,
    collection: col,
    projectId: firebaseConfig.projectId || "unknown"
  };
  throw new Error(JSON.stringify(errorInfo));
}

// ----------------------------------------------------
// Core Student Profile Sync
// ----------------------------------------------------
export async function saveStudentProfile(profile: StudentProfile): Promise<void> {
  if (!db) {
    localStorage.setItem("success_agent_profile", JSON.stringify(profile));
    return;
  }
  try {
    const docRef = doc(db, "student_profiles", "saranya_sasikumar");
    await setDoc(docRef, profile);
    localStorage.setItem("success_agent_profile", JSON.stringify(profile));
  } catch (error: any) {
    console.error("saveStudentProfile Firestore error:", error);
    localStorage.setItem("success_agent_profile", JSON.stringify(profile));
    handleFirestoreError(error, OperationType.WRITE, "student_profiles");
  }
}

export async function loadStudentProfile(): Promise<StudentProfile | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_profile");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const docRef = doc(db, "student_profiles", "saranya_sasikumar");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as StudentProfile;
      localStorage.setItem("success_agent_profile", JSON.stringify(data));
      return data;
    }
    const saved = localStorage.getItem("success_agent_profile");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadStudentProfile Firestore error, falling back to local:", error);
    const saved = localStorage.getItem("success_agent_profile");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Attendance Records Sync
// ----------------------------------------------------
export async function saveAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
  localStorage.setItem("success_agent_attendance", JSON.stringify(records));
  if (!db) return;

  try {
    const batch = writeBatch(db);
    records.forEach(record => {
      const docRef = doc(db, "attendance_records", record.id);
      batch.set(docRef, record);
    });
    await batch.commit();
  } catch (error: any) {
    console.error("saveAttendanceRecords Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "attendance_records");
  }
}

export async function loadAttendanceRecords(): Promise<AttendanceRecord[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_attendance");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const colRef = collection(db, "attendance_records");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const records: AttendanceRecord[] = [];
      querySnapshot.forEach(doc => {
        records.push(doc.data() as AttendanceRecord);
      });
      localStorage.setItem("success_agent_attendance", JSON.stringify(records));
      return records;
    }
    const saved = localStorage.getItem("success_agent_attendance");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadAttendanceRecords Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_attendance");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Assignments Sync
// ----------------------------------------------------
export async function saveAssignments(assignments: Assignment[]): Promise<void> {
  localStorage.setItem("success_agent_assignments", JSON.stringify(assignments));
  if (!db) return;

  try {
    const batch = writeBatch(db);
    assignments.forEach(assignment => {
      const docRef = doc(db, "assignments", assignment.id);
      batch.set(docRef, assignment);
    });
    await batch.commit();
  } catch (error: any) {
    console.error("saveAssignments Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "assignments");
  }
}

export async function loadAssignments(): Promise<Assignment[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_assignments");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const colRef = collection(db, "assignments");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const list: Assignment[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data() as Assignment);
      });
      localStorage.setItem("success_agent_assignments", JSON.stringify(list));
      return list;
    }
    const saved = localStorage.getItem("success_agent_assignments");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadAssignments Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_assignments");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Schedules Sync
// ----------------------------------------------------
export async function saveSchedules(schedules: ClassSchedule[]): Promise<void> {
  localStorage.setItem("success_agent_schedule", JSON.stringify(schedules));
  if (!db) return;

  try {
    const batch = writeBatch(db);
    schedules.forEach(sched => {
      const docRef = doc(db, "schedules", sched.id);
      batch.set(docRef, sched);
    });
    await batch.commit();
  } catch (error: any) {
    console.error("saveSchedules Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "schedules");
  }
}

export async function loadSchedules(): Promise<ClassSchedule[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_schedule");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const colRef = collection(db, "schedules");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const list: ClassSchedule[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data() as ClassSchedule);
      });
      localStorage.setItem("success_agent_schedule", JSON.stringify(list));
      return list;
    }
    const saved = localStorage.getItem("success_agent_schedule");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadSchedules Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_schedule");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Placement Progress Sync
// ----------------------------------------------------
export async function savePlacementItems(items: PlacementItem[]): Promise<void> {
  localStorage.setItem("success_agent_placement", JSON.stringify(items));
  if (!db) return;

  try {
    const batch = writeBatch(db);
    items.forEach(item => {
      const docRef = doc(db, "placement_items", item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (error: any) {
    console.error("savePlacementItems Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "placement_items");
  }
}

export async function loadPlacementItems(): Promise<PlacementItem[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_placement");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const colRef = collection(db, "placement_items");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const list: PlacementItem[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data() as PlacementItem);
      });
      localStorage.setItem("success_agent_placement", JSON.stringify(list));
      return list;
    }
    const saved = localStorage.getItem("success_agent_placement");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadPlacementItems Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_placement");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Library Books Sync
// ----------------------------------------------------
export async function saveLibraryBooks(books: LibraryBook[]): Promise<void> {
  localStorage.setItem("success_agent_books", JSON.stringify(books));
  if (!db) return;

  try {
    const batch = writeBatch(db);
    books.forEach(book => {
      const docRef = doc(db, "library_books", book.id);
      batch.set(docRef, book);
    });
    await batch.commit();
  } catch (error: any) {
    console.error("saveLibraryBooks Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "library_books");
  }
}

export async function loadLibraryBooks(): Promise<LibraryBook[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_books");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const colRef = collection(db, "library_books");
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const list: LibraryBook[] = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data() as LibraryBook);
      });
      localStorage.setItem("success_agent_books", JSON.stringify(list));
      return list;
    }
    const saved = localStorage.getItem("success_agent_books");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadLibraryBooks Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_books");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Study Plan Sync
// ----------------------------------------------------
export async function saveStudyPlan(plan: any): Promise<void> {
  localStorage.setItem("success_agent_study_plan", JSON.stringify(plan));
  if (!db) return;

  try {
    const docRef = doc(db, "study_plans", "current_plan");
    await setDoc(docRef, plan ? { data: plan } : {});
  } catch (error: any) {
    console.error("saveStudyPlan Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "study_plans");
  }
}

export async function loadStudyPlan(): Promise<any | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_study_plan");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const docRef = doc(db, "study_plans", "current_plan");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const fileData = snap.data();
      if (fileData && fileData.data) {
        localStorage.setItem("success_agent_study_plan", JSON.stringify(fileData.data));
        return fileData.data;
      }
    }
    const saved = localStorage.getItem("success_agent_study_plan");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadStudyPlan Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_study_plan");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// Chat History Sync
// ----------------------------------------------------
export async function saveChatHistory(history: ChatMessage[]): Promise<void> {
  localStorage.setItem("success_agent_chat_history", JSON.stringify(history));
  if (!db) return;

  try {
    const docRef = doc(db, "chat_history", "current_history");
    await setDoc(docRef, { messages: history });
  } catch (error: any) {
    console.error("saveChatHistory Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "chat_history");
  }
}

export async function loadChatHistory(): Promise<ChatMessage[] | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_chat_history");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const docRef = doc(db, "chat_history", "current_history");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.messages) {
        localStorage.setItem("success_agent_chat_history", JSON.stringify(data.messages));
        return data.messages as ChatMessage[];
      }
    }
    const saved = localStorage.getItem("success_agent_chat_history");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadChatHistory Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_chat_history");
    return saved ? JSON.parse(saved) : null;
  }
}

// ----------------------------------------------------
// AI Scoring Sync
// ----------------------------------------------------
export async function saveAiScoring(scoring: ExtraAIScoring): Promise<void> {
  localStorage.setItem("success_agent_ai_scoring", JSON.stringify(scoring));
  if (!db) return;

  try {
    const docRef = doc(db, "ai_scoring", "current_scoring");
    await setDoc(docRef, scoring);
  } catch (error: any) {
    console.error("saveAiScoring Firestore error:", error);
    handleFirestoreError(error, OperationType.WRITE, "ai_scoring");
  }
}

export async function loadAiScoring(): Promise<ExtraAIScoring | null> {
  if (!db) {
    const saved = localStorage.getItem("success_agent_ai_scoring");
    return saved ? JSON.parse(saved) : null;
  }
  try {
    const docRef = doc(db, "ai_scoring", "current_scoring");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ExtraAIScoring;
      localStorage.setItem("success_agent_ai_scoring", JSON.stringify(data));
      return data;
    }
    const saved = localStorage.getItem("success_agent_ai_scoring");
    return saved ? JSON.parse(saved) : null;
  } catch (error: any) {
    console.warn("loadAiScoring Firestore error, using local:", error);
    const saved = localStorage.getItem("success_agent_ai_scoring");
    return saved ? JSON.parse(saved) : null;
  }
}
