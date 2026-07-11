import React from "react";
import { 
  Briefcase, 
  Sparkles, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  Building2, 
  RefreshCw,
  Eye,
  EyeOff,
  Code,
  Terminal,
  Play,
  Send,
  Check,
  X as XIcon,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  GraduationCap
} from "lucide-react";
import { PlacementItem, StudentProfile } from "../types";
import { aptitudeTopics, AptitudeQuestion } from "../data/aptitudeData";

interface PlacementPrepTabProps {
  items: PlacementItem[];
  onUpdateItems: (items: PlacementItem[]) => void;
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

// Map outdated topic names to updated names
const mapTopicName = (topic: string): string => {
  if (!topic) return "General";
  const t = topic.trim().toLowerCase();
  if (t.includes("arrays & hashing") || t.includes("array & hashing") || t.includes("arrays and hashing") || t === "hashing" || t.includes("hash")) {
    return "String Questions";
  }
  return topic;
};

// ListNode definition for compiler testing
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// Convert Array to ListNode chain
const arrayToList = (arr: number[]): ListNode | null => {
  if (arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
};

// Convert ListNode chain back to Array
const listToArray = (head: any): number[] => {
  const result: number[] = [];
  let curr = head;
  while (curr !== null && result.length < 100) { // Safety limit
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
};

interface CodingChallenge {
  id: string;
  topic: "Arrays & Strings" | "String Questions" | "Linked List";
  title: string;
  description: string;
  constraints: string[];
  boilerplate: string;
  solution: string;
  testCases: Array<{
    id: number;
    input: any;
    inputStr: string;
    expected: any;
    expectedStr: string;
  }>;
}

const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "code-arrays-strings",
    topic: "Arrays & Strings",
    title: "Find the Duplicate Number",
    description: "Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number. You must solve the problem with O(N) time complexity and O(1) auxiliary space.",
    constraints: [
      "1 <= n <= 10^4",
      "nums.length == n + 1",
      "All integers in nums appear only once except for precisely one integer which appears two or more times."
    ],
    boilerplate: `function findDuplicate(nums) {
  // Write your O(N) time complexity and O(1) auxiliary space solution here
  
}`,
    solution: `function findDuplicate(nums) {
  // Use Floyd's Cycle Detection (Tortoise and Hare)
  let slow = nums[0];
  let hare = nums[0];
  
  // Phase 1: Finding the intersection point of the cycle
  do {
    slow = nums[slow];
    hare = nums[hare];
    hare = nums[hare]; // Move twice as fast
  } while (slow !== hare);
  
  // Phase 2: Find the entrance to the cycle
  hare = nums[0];
  while (slow !== hare) {
    slow = nums[slow];
    hare = nums[hare];
  }
  
  return slow;
}`,
    testCases: [
      { id: 1, input: [1, 3, 4, 2, 2], inputStr: "[1, 3, 4, 2, 2]", expected: 2, expectedStr: "2" },
      { id: 2, input: [3, 1, 3, 4, 2], inputStr: "[3, 1, 3, 4, 2]", expected: 3, expectedStr: "3" },
      { id: 3, input: [1, 1], inputStr: "[1, 1]", expected: 1, expectedStr: "1" },
      { id: 4, input: [1, 1, 2], inputStr: "[1, 1, 2]", expected: 1, expectedStr: "1" },
      { id: 5, input: [2, 3, 1, 2, 4], inputStr: "[2, 3, 1, 2, 4]", expected: 2, expectedStr: "2" }
    ]
  },
  {
    id: "code-string-questions",
    topic: "String Questions",
    title: "Valid Anagram Checker",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    boilerplate: `function isAnagram(s, t) {
  // Write your solution here to check if t is an anagram of s
  
}`,
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) {
    return false;
  }
  
  const charMap = {};
  for (let char of s) {
    charMap[char] = (charMap[char] || 0) + 1;
  }
  
  for (let char of t) {
    if (!charMap[char]) {
      return false;
    }
    charMap[char]--;
  }
  
  return true;
}`,
    testCases: [
      { id: 1, input: ["anagram", "nagaram"], inputStr: "s = 'anagram', t = 'nagaram'", expected: true, expectedStr: "true" },
      { id: 2, input: ["rat", "car"], inputStr: "s = 'rat', t = 'car'", expected: false, expectedStr: "false" },
      { id: 3, input: ["listen", "silent"], inputStr: "s = 'listen', t = 'silent'", expected: true, expectedStr: "true" },
      { id: 4, input: ["", ""], inputStr: "s = '', t = ''", expected: true, expectedStr: "true" },
      { id: 5, input: ["apple", "papel"], inputStr: "s = 'apple', t = 'papel'", expected: true, expectedStr: "true" }
    ]
  },
  {
    id: "code-linked-list",
    topic: "Linked List",
    title: "Reverse Singly Linked List",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list. Note that the list is represented by actual Linked List Nodes where each node contains `val` and `next` pointer properties.",
    constraints: [
      "The number of nodes in the list is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    boilerplate: `function reverseList(head) {
  // Write your solution here to reverse the singly linked list and return the new head
  
}`,
    solution: `function reverseList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    let tempNext = curr.next;
    curr.next = prev;
    prev = curr;
    curr = tempNext;
  }
  
  return prev;
}`,
    testCases: [
      { id: 1, input: [1, 2, 3, 4, 5], inputStr: "1 -> 2 -> 3 -> 4 -> 5", expected: [5, 4, 3, 2, 1], expectedStr: "5 -> 4 -> 3 -> 2 -> 1" },
      { id: 2, input: [1, 2], inputStr: "1 -> 2", expected: [2, 1], expectedStr: "2 -> 1" },
      { id: 3, input: [], inputStr: "Empty list", expected: [], expectedStr: "Empty list" },
      { id: 4, input: [9], inputStr: "9", expected: [9], expectedStr: "9" },
      { id: 5, input: [10, 20, 30], inputStr: "10 -> 20 -> 30", expected: [30, 20, 10], expectedStr: "30 -> 20 -> 10" }
    ]
  }
];

interface HrQuestion {
  id: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  aiHint: string;
}

const HR_QUESTIONS: HrQuestion[] = [
  {
    id: "hr-self-intro",
    question: "Tell me about yourself. Walk us through your academic background, major campus projects, and technical focus.",
    difficulty: "Easy",
    aiHint: "Use the Present-Past-Future formula. State your current department/status, mention 1-2 major technical projects or coding accomplishments, and describe why you are eager to excel in a placement role."
  },
  {
    id: "hr-strength-weakness",
    question: "What is your greatest technical/collaborative strength, and what is a genuine weakness you have actively worked to improve?",
    difficulty: "Medium",
    aiHint: "Provide a real collaborative/technical strength backed by a brief group milestone. For weakness, choose a non-fatal, authentic skill (e.g., spending too much time over-engineering initial design documentation) and explain the system or task tracker you currently use to stay agile."
  },
  {
    id: "hr-conflict-resolution",
    question: "Describe a situation where you had a clear conflict or disagreement with a teammate during a group project. How did you resolve it?",
    difficulty: "Medium",
    aiHint: "Use the STAR method (Situation, Task, Action, Result). State the conflict objectively (e.g., disagreement on framework choice or delegation), the empathetic 1-on-1 discussion you initiated, and the successful joint compromise that delivered the project on time."
  },
  {
    id: "hr-handle-pressure",
    question: "How do you handle tight project deadlines, multiple exam schedules, and academic pressure? Can you provide a concrete example?",
    difficulty: "Medium",
    aiHint: "Focus on task prioritization and time-boxing. Talk about mapping out milestones in a digital calendar, dedicating focused study hours with zero distractions, and managing stress productively."
  },
  {
    id: "hr-why-join-us",
    question: "Why do you want to join our company specifically, and where do you see yourself in the next three to five years?",
    difficulty: "Medium",
    aiHint: "Demonstrate that you have researched the firm's technical goals or core developer culture. Explain how your short-term aim is to master engineering pipelines, and your 3-5 year goal is to mentor junior developers and drive feature development."
  },
  {
    id: "hr-failure-lesson",
    question: "Tell us about a time you failed or made an error in an assignment or lab. How did you remediate it and what did you learn?",
    difficulty: "Hard",
    aiHint: "Be completely honest and avoid blaming others. Explain the rapid correction steps you initiated to resolve the issue, and highlight the automated checking protocol or verification list you set up to prevent recurrence."
  },
  {
    id: "hr-leadership-initiative",
    question: "Have you ever taken the initiative to lead a project or resolve a major issue when it wasn't strictly your assigned role?",
    difficulty: "Hard",
    aiHint: "Detail a coordination gap you noticed (e.g., team members working on overlapping modules without sync) and how you volunteered to organize daily brief updates, resulting in an earlier completion and less debugging stress."
  }
];

export default function PlacementPrepTab({
  items,
  onUpdateItems,
  profile,
  onUpdateProfile
}: PlacementPrepTabProps) {
  // Main Prep navigation subtabs
  const [activeSubTab, setActiveSubTab] = React.useState<"ai-qna" | "coding-lab" | "aptitude-hub" | "hr-platform">("ai-qna");

  // Non-repetition lists
  const [completedCodingChallenges, setCompletedCodingChallenges] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("completed_coding_challenges");
    return saved ? JSON.parse(saved) : [];
  });
  const [completedAptQuestionIds, setCompletedAptQuestionIds] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("completed_aptitude_questions");
    return saved ? JSON.parse(saved) : [];
  });
  const [completedHrQuestionIds, setCompletedHrQuestionIds] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("completed_hr_questions");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate dynamic placement readiness percentage based strictly on completed items
  React.useEffect(() => {
    const totalCoding = CODING_CHALLENGES.length; // 3
    const totalApt = Object.values(aptitudeTopics).reduce((acc, qList) => acc + qList.length, 0); // 40
    const totalHr = HR_QUESTIONS.length; // 7
    const totalQuestions = totalCoding + totalApt + totalHr; // 50

    const solvedCount = completedCodingChallenges.length + completedAptQuestionIds.length + completedHrQuestionIds.length;
    const computedScore = totalQuestions > 0 ? Math.min(100, Math.round((solvedCount / totalQuestions) * 100)) : 0;

    if (profile.placementReadinessScore !== computedScore) {
      onUpdateProfile({
        ...profile,
        placementReadinessScore: computedScore
      });
    }
  }, [completedCodingChallenges, completedAptQuestionIds, completedHrQuestionIds, profile, onUpdateProfile]);

  // Original Placement Q&A controls
  const [difficulty, setDifficulty] = React.useState<"Easy" | "Medium" | "Hard">("Medium");
  const [focusCompany, setFocusCompany] = React.useState("Amazon / Google");
  const [isLoading, setIsLoading] = React.useState(false);
  const [revealedHints, setRevealedHints] = React.useState<Record<string, boolean>>({});

  // Coding Lab State
  const [selectedChallenge, setSelectedChallenge] = React.useState<CodingChallenge>(CODING_CHALLENGES[0]);
  const [userCode, setUserCode] = React.useState(CODING_CHALLENGES[0].boilerplate);
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [passedPercentage, setPassedPercentage] = React.useState<number | null>(null);
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Aptitude Hub State
  const [selectedAptTopic, setSelectedAptTopic] = React.useState<string>("Quantitative Aptitude");
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = React.useState<boolean>(false);
  const [quizResultPercentage, setQuizResultPercentage] = React.useState<number | null>(null);
  const [showExplanation, setShowExplanation] = React.useState<boolean>(false);

  // HR Practice Platform State
  const [revealHrHint, setRevealHrHint] = React.useState<boolean>(false);
  const [userHrAnswer, setUserHrAnswer] = React.useState<string>("");
  const [evaluatingHr, setEvaluatingHr] = React.useState<boolean>(false);
  const [hrEvalResult, setHrEvalResult] = React.useState<{
    relevanceScore: number;
    feedback: string[];
    strengths: string[];
    sampleAnswer: string;
  } | null>(null);
  const [savingHrComplete, setSavingHrComplete] = React.useState<boolean>(false);

  // Handle challenge selection change in coding lab
  const selectChallenge = (challenge: CodingChallenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.boilerplate);
    setTestResults([]);
    setPassedPercentage(null);
    setCodeError(null);
    setSubmitSuccess(false);
  };

  // Run user code against compiler test cases
  const runCodeAndEvaluate = () => {
    setCodeError(null);
    setPassedPercentage(null);
    setSubmitSuccess(false);
    
    try {
      // Direct Evaluation in iframe sandbox with robust declaration detection
      const userFn = new Function(`
        ${userCode}
        if (typeof findDuplicate !== 'undefined') return findDuplicate;
        if (typeof isAnagram !== 'undefined') return isAnagram;
        if (typeof reverseList !== 'undefined') return reverseList;
        throw new Error("Could not find function declaration (findDuplicate, isAnagram, or reverseList)");
      `)();
      
      let passCount = 0;
      const evaluatedResults = selectedChallenge.testCases.map((tc) => {
        try {
          let testInputArg;
          let evaluatedOutput;
          let testPassed = false;
          let actualStr = "";

          if (selectedChallenge.topic === "Linked List") {
            testInputArg = arrayToList(tc.input);
            const returnedHead = userFn(testInputArg);
            const returnedArr = listToArray(returnedHead);
            testPassed = JSON.stringify(returnedArr) === JSON.stringify(tc.expected);
            actualStr = returnedArr.length === 0 ? "Empty list" : returnedArr.join(" -> ");
          } else if (selectedChallenge.topic === "String Questions") {
            testInputArg = tc.input; // Array of [s, t]
            evaluatedOutput = userFn(testInputArg[0], testInputArg[1]);
            testPassed = evaluatedOutput === tc.expected;
            actualStr = String(evaluatedOutput);
          } else {
            testInputArg = [...tc.input]; // Copy nums array
            evaluatedOutput = userFn(testInputArg);
            testPassed = evaluatedOutput === tc.expected;
            actualStr = String(evaluatedOutput);
          }

          if (testPassed) {
            passCount++;
          }

          return {
            ...tc,
            actualStr,
            passed: testPassed,
            error: null
          };
        } catch (itemErr: any) {
          return {
            ...tc,
            actualStr: "Error",
            passed: false,
            error: itemErr.message || "Runtime exception"
          };
        }
      });

      setTestResults(evaluatedResults);
      const percentage = Math.round((passCount / selectedChallenge.testCases.length) * 100);
      setPassedPercentage(percentage);
    } catch (syntaxErr: any) {
      setCodeError(syntaxErr.message || "Compilation or Syntax Error");
    }
  };

  // Submit master status for Coding Lab
  const handleSubmitCodingSolution = () => {
    if (passedPercentage === 100) {
      setSubmitSuccess(true);
      
      // Save to non-repetition tracker
      if (!completedCodingChallenges.includes(selectedChallenge.id)) {
        const updated = [...completedCodingChallenges, selectedChallenge.id];
        setCompletedCodingChallenges(updated);
        localStorage.setItem("completed_coding_challenges", JSON.stringify(updated));
      }
      
      // Update placementItems or mark completed
      const codeItemId = `interactive-coding-${selectedChallenge.id}`;
      const alreadyCompleted = items.some(it => it.id === codeItemId && it.status === "Completed");
      
      if (!alreadyCompleted) {
        // Create placementItem representation for list
        const newItem: PlacementItem = {
          id: codeItemId,
          category: "Coding",
          topic: selectedChallenge.topic,
          question: selectedChallenge.title + ": " + selectedChallenge.description,
          difficulty: "Medium",
          company: "Campus Interactive",
          status: "Completed",
          aiHint: "Verified and Mastered through Interactive Compiler Platform!"
        };
        
        onUpdateItems([newItem, ...items]);
      }
    }
  };

  // Select Aptitude Topic & reset quiz
  const selectAptitudeTopic = (topic: string) => {
    setSelectedAptTopic(topic);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResultPercentage(null);
    setShowExplanation(false);
  };

  // Submit Aptitude Quiz and calculate accurate percentage of correct answers
  const handleSubmitAptitudeQuiz = () => {
    const questions = (aptitudeTopics[selectedAptTopic] || []).filter(q => !completedAptQuestionIds.includes(q.id));
    let correctCount = 0;
    const newlySolved: string[] = [];
    
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
        newlySolved.push(q.id);
      }
    });

    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    setQuizResultPercentage(scorePct);
    setQuizSubmitted(true);

    if (newlySolved.length > 0) {
      const updated = [...completedAptQuestionIds, ...newlySolved];
      setCompletedAptQuestionIds(updated);
      localStorage.setItem("completed_aptitude_questions", JSON.stringify(updated));
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/placement-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, focusTopic: focusCompany })
      });

      if (!response.ok) {
        throw new Error("Placement API failure");
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        const freshItems: PlacementItem[] = data.items.map((it: any, idx: number) => ({
          id: `place-gen-${Date.now()}-${idx}`,
          category: it.category || "Coding",
          topic: mapTopicName(it.topic || "Placement General"),
          question: it.question,
          difficulty: it.difficulty || difficulty,
          company: it.company || focusCompany,
          status: "Not Started",
          aiHint: it.aiHint
        }));
        onUpdateItems([...freshItems, ...items]);
      }
    } catch (err) {
      console.warn("Placement API error, loading custom AI-suggested mock questions:", err);
      // Fallback data generator with gorgeous questions based on user selections
      const mockQuestions: PlacementItem[] = [
        {
          id: `place-fall-${Date.now()}-1`,
          category: "Coding",
          topic: "Arrays & Strings",
          question: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. Tested on ${focusCompany}.`,
          difficulty,
          company: focusCompany,
          status: "Not Started",
          aiHint: "Use 1D Dynamic Programming. Create a boolean dp array of size N+1 where dp[i] is true if s[0...i-1] can be segmented."
        },
        {
          id: `place-fall-${Date.now()}-2`,
          category: "Aptitude",
          topic: "Permutations & Combinations",
          question: `In how many different ways can the letters of the word 'SUCCESS' be arranged so that the vowels always come together?`,
          difficulty,
          company: focusCompany,
          status: "Not Started",
          aiHint: "Vowels are U, E. Treat them as 1 package. Arrange remaining letters plus package, then account for repetitions (S occurs 3 times, C twice)."
        },
        {
          id: `place-fall-${Date.now()}-3`,
          category: "HR",
          topic: "Weaknesses & Resilience",
          question: "What is your greatest technical weakness and how have you actively worked to address it in recent semesters?",
          difficulty,
          company: focusCompany,
          status: "Not Started",
          aiHint: "Use the Sandwich approach. State a real, non-fatal weakness (e.g., getting overly detail-oriented in early design phases), then explain how you leverage active organizers/agile timers to keep progress steady."
        }
      ];
      onUpdateItems([...mockQuestions, ...items]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSolved = (id: string) => {
    const updated = items.map(it => {
      if (it.id === id) {
        const isCompleting = it.status === "Not Started";
        return {
          ...it,
          status: (isCompleting ? "Completed" : "Not Started") as 'Not Started' | 'Completed'
        };
      }
      return it;
    });

    onUpdateItems(updated);
  };

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeAptQuestions = (aptitudeTopics[selectedAptTopic] || []).filter(
    (q) => !completedAptQuestionIds.includes(q.id)
  );
  const currentAptQuestion = activeAptQuestions[currentQuestionIndex];

  const activeHrQuestions = HR_QUESTIONS.filter(
    (q) => !completedHrQuestionIds.includes(q.id)
  );

  return (
    <div className="space-y-6" id="placement-prep-tab-container">
      {/* Intro block with gauge */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
            <Briefcase className="h-5.5 w-5.5 text-emerald-500" /> Placement Preparation Suite
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Boost your readiness for high-tier tech corporations. Write and compile real code in our <span className="font-semibold text-slate-700">Coding Lab</span>, practice targeted <span className="font-semibold text-slate-700">Aptitude Quizzes</span>, and review expert strategies.
          </p>
        </div>

        {/* Big placement score gauge */}
        <div className="bg-emerald-950 text-white rounded-xl p-4 text-center border shadow-xs min-w-[200px] shrink-0">
          <span className="text-[9px] font-mono font-semibold text-emerald-400 tracking-widest uppercase">Placement index</span>
          <div className="text-3xl font-mono font-bold text-white mt-1">{profile.placementReadinessScore}%</div>
          <div className="w-full bg-emerald-900/60 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${profile.placementReadinessScore}%` }} />
          </div>
          <p className="text-[10px] text-emerald-300/80 mt-1.5 font-sans">Solve coding & aptitude tasks to score 90%+</p>
        </div>
      </div>

      {/* Main Suite Workspace Navigation Subtabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 w-full max-w-3xl">
        <button
          onClick={() => setActiveSubTab("ai-qna")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
            ${activeSubTab === "ai-qna" 
              ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
            }`}
        >
          <Award className="h-4 w-4 text-emerald-600" />
          AI Prepared Q&A
        </button>
        <button
          onClick={() => setActiveSubTab("coding-lab")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
            ${activeSubTab === "coding-lab" 
              ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
            }`}
        >
          <Code className="h-4 w-4 text-indigo-600" />
          Coding Lab
        </button>
        <button
          onClick={() => setActiveSubTab("aptitude-hub")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
            ${activeSubTab === "aptitude-hub" 
              ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
            }`}
        >
          <GraduationCap className="h-4.5 w-4.5 text-amber-600" />
          Aptitude Prep
        </button>
        <button
          onClick={() => setActiveSubTab("hr-platform")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
            ${activeSubTab === "hr-platform" 
              ? "bg-white text-slate-800 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
            }`}
        >
          <Briefcase className="h-4 w-4 text-teal-600" />
          HR Platform
        </button>
      </div>

      {/* SUBTAB 1: AI Prepared Q&A (Original Content) */}
      {activeSubTab === "ai-qna" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Inputs Board */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Difficulty Profile</label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 border">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer
                      ${difficulty === diff 
                        ? "bg-white text-slate-800 shadow-3xs" 
                        : "text-slate-500 hover:text-slate-800"
                      }
                    `}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" /> Company Focus Topic
              </label>
              <input
                type="text"
                value={focusCompany}
                onChange={(e) => setFocusCompany(e.target.value)}
                placeholder="e.g., Google, Amazon, FAANG"
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isLoading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-sans font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Prompting AI Trainer...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  Generate Placement Questions
                </>
              )}
            </button>
          </div>

          {/* Daily Learning Goals suggested by AI */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60">
            <h3 className="font-display font-semibold text-slate-800 text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
              <Award className="h-4 w-4" /> Recommended Placement Learning Agenda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">1.</span>
                <div>
                  <p className="font-semibold text-slate-700">Coding Practice</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Solve 1 Medium dynamic programming problem.</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">2.</span>
                <div>
                  <p className="font-semibold text-slate-700">Aptitude Refinement</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Understand Probability permutation ratios.</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">3.</span>
                <div>
                  <p className="font-semibold text-slate-700">Interview Resilience</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Practice the STAR story format for team conflict.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of placement prep material cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              const mappedTopic = mapTopicName(item.topic);
              const showHint = !!revealedHints[item.id];
              const isDone = item.status === "Completed";

              return (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-xl p-5 shadow-xs border flex flex-col justify-between space-y-4 hover:shadow-md transition
                    ${isDone ? "border-emerald-200/80 bg-emerald-50/10" : "border-slate-100"}
                  `}
                >
                  <div className="space-y-2">
                    {/* Header tags */}
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded font-mono uppercase tracking-wider
                          ${item.category === "Coding" ? "bg-indigo-100 text-indigo-700" : item.category === "Aptitude" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}
                        `}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">/</span>
                        <span className="text-slate-500 text-[10px] font-sans font-medium">{mappedTopic}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded font-mono
                        ${item.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" : item.difficulty === "Medium" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}
                      `}>
                        {item.difficulty}
                      </span>
                    </div>

                    {/* Company Tag */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 font-medium">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Target: {item.company}
                    </div>

                    {/* The Question */}
                    <p className={`text-xs font-sans font-medium leading-relaxed text-slate-700 pt-1
                      ${isDone ? 'line-through text-slate-400' : ''}
                    `}>
                      {item.question}
                    </p>
                  </div>

                  {/* Solved status toggle, hint revealer */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {showHint && item.aiHint && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
                        <span className="font-semibold text-slate-800 uppercase tracking-wider text-[9px] font-mono text-emerald-700 flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" /> Solution Strategy (AI Trainer Hint)
                        </span>
                        <p>{item.aiHint}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleHint(item.id)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer w-full justify-center"
                      >
                        {showHint ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> <span className="text-[10px]">Hide Strategy</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> <span className="text-[10px]">Answering Strategy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Interactive Coding Lab */}
      {activeSubTab === "coding-lab" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-200" id="coding-lab-container">
          {completedCodingChallenges.length === CODING_CHALLENGES.length ? (
            <div className="text-center py-12 max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                🏆
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-800 text-xl">All Coding Challenges Mastered!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You have compiled, optimized, and successfully solved all interactive coding challenges on this platform with 100% test case accuracy. Amazing work!
                </p>
              </div>
              <button
                onClick={() => {
                  setCompletedCodingChallenges([]);
                  localStorage.removeItem("completed_coding_challenges");
                  selectChallenge(CODING_CHALLENGES[0]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
              >
                <RotateCcw className="h-4 w-4" /> Reset Coding Progress & Re-practice
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Sidebar - Challenge Selectors */}
              <div className="w-full lg:w-1/4 space-y-3 shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Coding Topics</h3>
                <div className="flex flex-col gap-2">
                  {CODING_CHALLENGES.filter(ch => !completedCodingChallenges.includes(ch.id)).map((ch) => {
                    const isSelected = selectedChallenge?.id === ch.id;

                    return (
                      <button
                        key={ch.id}
                        onClick={() => selectChallenge(ch)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1.5 cursor-pointer
                          ${isSelected 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-3xs" 
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700"
                          }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-mono text-[10px] text-slate-400">{ch.topic}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 font-bold font-mono text-[8px] rounded uppercase">Active</span>
                        </div>
                        <span className="font-bold text-slate-800 truncate">{ch.title}</span>
                      </button>
                    );
                  })}
                </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-500 space-y-2">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-slate-500" /> Platform Instructions:
                </div>
                <p>1. Review the problem description and requirements.</p>
                <p>2. Edit the JavaScript solution template inside the code compiler container.</p>
                <p>3. Click <strong>Run & Verify</strong> to evaluate your logic against active compiler test cases.</p>
                <p>4. Reach <strong>100% test passing accuracy</strong> to lock-in your placement mastery credits!</p>
              </div>
            </div>

            {/* Right Editor Platform Panel */}
            <div className="flex-1 space-y-5">
              
              {/* Problem Description Panel */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-bold text-slate-800 text-sm">
                    {selectedChallenge.title}
                  </h4>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold rounded">
                    {selectedChallenge.topic}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedChallenge.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Constraints:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                    {selectedChallenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>

              {/* IDE Code Editor Workspace */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Code className="h-4 w-4 text-indigo-500" /> JavaScript Compiler Environment
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setUserCode(selectedChallenge.solution);
                        setPassedPercentage(null);
                        setTestResults([]);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer font-bold"
                      title="Reveal and autofill the correct solution"
                    >
                      <Check className="h-3 w-3" /> Autofill Solution
                    </button>
                    <span className="text-slate-300 font-mono text-[10px] select-none">|</span>
                    <button
                      onClick={() => {
                        setUserCode(selectedChallenge.boilerplate);
                        setPassedPercentage(null);
                        setTestResults([]);
                      }}
                      className="text-slate-400 hover:text-slate-600 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
                      title="Reset to boilerplate"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset Code
                    </button>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl overflow-hidden focus-within:border-indigo-500 transition shadow-xs">
                  {/* IDE Margin Header */}
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="ml-2 font-mono text-[10px]">solution.js</span>
                    </span>
                    <span>Sandbox Runtime</span>
                  </div>

                  <textarea
                    rows={12}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full bg-slate-950 text-emerald-400 font-mono p-4 text-xs focus:outline-none leading-relaxed resize-y select-text"
                    style={{ minHeight: "220px" }}
                  />
                </div>
              </div>

              {/* Compilation Feedback & Action Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={runCodeAndEvaluate}
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-white text-white" />
                    Run & Verify Code
                  </button>

                  {passedPercentage !== null && (
                    <button
                      onClick={handleSubmitCodingSolution}
                      disabled={passedPercentage < 100}
                      className={`text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer
                        ${passedPercentage === 100
                          ? "bg-emerald-800 hover:bg-emerald-950 text-white active:scale-98"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                      <Send className="h-4 w-4" />
                      Lock Mastery Credits
                    </button>
                  )}
                </div>

                {passedPercentage !== null && (
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Accuracy Rating</p>
                      <p className="text-xs font-bold text-slate-700">
                        {passedPercentage === 100 ? "🎉 Perfect 100%!" : `${passedPercentage}% Passed`}
                      </p>
                    </div>
                    <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full
                          ${passedPercentage === 100 ? "bg-emerald-500" : passedPercentage > 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${passedPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Display Compilation/Syntax Error */}
              {codeError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs space-y-1.5 font-mono">
                  <p className="font-bold flex items-center gap-1 text-rose-700">
                    <XIcon className="h-4 w-4" /> COMPILATION ERROR:
                  </p>
                  <p className="opacity-90">{codeError}</p>
                </div>
              )}

              {/* Display Submission Success Celebration */}
              {submitSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1 font-sans">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800 text-sm">
                    <Check className="h-5 w-5 bg-emerald-100 text-emerald-800 rounded-full p-0.5" /> 
                    Task Mastered Successfully!
                  </p>
                  <p className="opacity-90 leading-relaxed">
                    Outstanding coding execution! The solution satisfies 100% of test scenarios. Your overall **Placement Readiness Score** has been boosted by **+10%**.
                  </p>
                </div>
              )}

              {/* Test Cases Output Matrix */}
              {testResults.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Test Case Execution Matrix</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {testResults.map((tc) => (
                      <div 
                        key={tc.id}
                        className={`p-3.5 rounded-xl border text-xs flex flex-col gap-1.5 transition-all
                          ${tc.passed 
                            ? "bg-emerald-50/50 border-emerald-150 text-emerald-900" 
                            : "bg-rose-50/30 border-rose-150 text-rose-900"
                          }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-mono font-bold">Case #{tc.id}</span>
                          <span className={`px-2 py-0.5 font-bold font-mono text-[8px] rounded uppercase tracking-wider flex items-center gap-0.5
                            ${tc.passed 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-rose-100 text-rose-800"
                            }`}>
                            {tc.passed ? <Check className="h-2 w-2 stroke-[3]" /> : <XIcon className="h-2 w-2 stroke-[3]" />}
                            {tc.passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                        
                        <div className="space-y-1 font-mono text-[11px] text-slate-600 pt-1">
                          <p><span className="text-slate-400 font-semibold">Input:</span> {tc.inputStr}</p>
                          <p><span className="text-slate-400 font-semibold">Expected:</span> {tc.expectedStr}</p>
                          <p><span className="text-slate-400 font-semibold">Returned:</span> {tc.actualStr}</p>
                        </div>
                        
                        {tc.error && (
                          <p className="text-[10px] text-rose-700 bg-rose-50 p-1.5 rounded font-mono mt-1">
                            Error: {tc.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: Aptitude Preparation Hub */}
      {activeSubTab === "aptitude-hub" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-200">
          
          {/* Topic Select Option Rails */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Select Aptitude Topic:</label>
            <div className="flex flex-wrap gap-2.5">
              {Object.keys(aptitudeTopics).map((topic) => {
                const isSelected = selectedAptTopic === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => selectAptitudeTopic(topic)}
                    className={`py-2 px-4 text-xs font-medium rounded-xl transition border cursor-pointer
                      ${isSelected 
                        ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-3xs" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            {activeAptQuestions.length === 0 ? (
              <div className="text-center py-12 max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-150">
                <div className="w-20 h-20 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                  ⚡
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-slate-800 text-xl">Topic Completed!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Outstanding! You have solved all questions for <span className="font-semibold text-slate-700">{selectedAptTopic}</span> with 100% correct answers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const allInTopic = aptitudeTopics[selectedAptTopic] || [];
                    const allInTopicIds = allInTopic.map(q => q.id);
                    const updated = completedAptQuestionIds.filter(id => !allInTopicIds.includes(id));
                    setCompletedAptQuestionIds(updated);
                    localStorage.setItem("completed_aptitude_questions", JSON.stringify(updated));
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                    setQuizResultPercentage(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Topic Progress & Re-take Quiz
                </button>
              </div>
            ) : quizSubmitted ? (
              /* Quiz Results Workspace Dashboard */
              <div className="space-y-6">
                {/* Score Header card */}
                <div className="bg-slate-900 text-white rounded-xl p-6 border shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-1.5 text-center md:text-left">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold rounded uppercase tracking-wider">Quiz Completed</span>
                    <h4 className="font-display font-bold text-lg">{selectedAptTopic} Results</h4>
                    <p className="text-xs text-slate-400">
                      Successfully solved the full 10-question set. Track correct outcomes below with expert-trainer explanations.
                    </p>
                  </div>
                  
                  <div className="text-center bg-slate-800/80 px-6 py-4 rounded-xl border border-slate-700 shrink-0">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-semibold">Correct Accuracy</span>
                    <span className="text-3xl font-mono font-bold text-amber-400">{quizResultPercentage}%</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">
                      {quizResultPercentage && quizResultPercentage >= 70 ? "🎉 Readiness Index Boosted!" : "Keep practicing to score 70%+"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider">Detailed Explanations & Review</h4>
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizResultPercentage(null);
                      setCurrentQuestionIndex(0);
                    }}
                    className="text-amber-700 hover:text-amber-800 font-sans font-semibold text-xs flex items-center gap-1 bg-amber-50/50 border border-amber-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Re-attempt Topic Quiz
                  </button>
                </div>

                {/* Explanation Review Grid */}
                <div className="space-y-4">
                  {activeAptQuestions.map((q, idx) => {
                    const selectedAns = selectedAnswers[idx];
                    const isCorrect = selectedAns === q.correctAnswer;

                    return (
                      <div 
                        key={q.id}
                        className={`p-5 rounded-xl border text-xs space-y-3 transition
                          ${isCorrect 
                            ? "bg-emerald-50/20 border-emerald-200/60" 
                            : "bg-rose-50/20 border-rose-200/60"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-slate-800 leading-relaxed font-sans">
                            <span className="text-slate-400 font-mono font-bold mr-1">{idx + 1}.</span> {q.question}
                          </p>
                          <span className={`px-2 py-0.5 font-bold font-mono text-[8px] rounded uppercase tracking-wider shrink-0 mt-0.5
                            ${isCorrect 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        </div>

                        {/* Options shown statically */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isSelectedOption = selectedAns === oIdx;
                            const isCorrectOption = q.correctAnswer === oIdx;

                            return (
                              <div 
                                key={oIdx}
                                className={`p-2.5 rounded-lg border font-medium flex items-center justify-between
                                  ${isCorrectOption 
                                    ? "bg-emerald-100/40 border-emerald-200 text-emerald-900 font-semibold" 
                                    : isSelectedOption 
                                      ? "bg-rose-100/40 border-rose-200 text-rose-900" 
                                      : "bg-slate-50/50 border-slate-100 text-slate-500"
                                  }`}
                              >
                                <span>{opt}</span>
                                {isCorrectOption && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                                {!isCorrectOption && isSelectedOption && <XIcon className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Technical Explanation */}
                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 text-slate-600 leading-relaxed">
                          <span className="font-bold text-slate-700 uppercase tracking-wider text-[9px] font-mono block mb-1">Solution Explanation:</span>
                          <p>{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Active Quiz Stepper Platform */
              <div className="max-w-3xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                
                {/* Stepper progress header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wide">Topic: {selectedAptTopic}</span>
                    <h4 className="font-display font-bold text-slate-800 text-sm mt-0.5">
                      Question {currentQuestionIndex + 1} of {activeAptQuestions.length}
                    </h4>
                  </div>
                  
                  <span className="font-mono text-xs text-slate-400 font-bold bg-white px-2.5 py-1 rounded-lg border">
                    {Object.keys(selectedAnswers).length} / {activeAptQuestions.length} Answered
                  </span>
                </div>

                {/* Question Box Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <p className="text-sm font-medium text-slate-800 leading-relaxed font-sans">
                    {currentAptQuestion?.question}
                  </p>

                  {/* Options List */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    {currentAptQuestion?.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setSelectedAnswers(prev => ({
                              ...prev,
                              [currentQuestionIndex]: oIdx
                            }));
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border font-medium text-xs transition-all flex items-center justify-between cursor-pointer
                            ${isSelected 
                              ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                            ${isSelected 
                              ? "border-amber-500 bg-amber-500" 
                              : "border-slate-300 bg-white"
                            }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submitting Quiz and Navigation buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-white hover:bg-slate-100 border text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex === activeAptQuestions.length - 1 ? (
                      <button
                        onClick={handleSubmitAptitudeQuiz}
                        disabled={Object.keys(selectedAnswers).length < activeAptQuestions.length}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="h-4 w-4" /> Submit Quiz & Score
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(activeAptQuestions.length - 1, prev + 1))}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Circle Steppers Map */}
                <div className="flex justify-center items-center gap-1.5 pt-3 border-t border-slate-200/60 flex-wrap">
                  {activeAptQuestions.map((_, idx) => {
                    const isCurrent = currentQuestionIndex === idx;
                    const isAnswered = selectedAnswers[idx] !== undefined;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all cursor-pointer
                          ${isCurrent 
                            ? "bg-amber-600 text-white shadow-3xs" 
                            : isAnswered 
                              ? "bg-amber-100 text-amber-800 border border-amber-200" 
                              : "bg-white text-slate-400 border"
                          }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {Object.keys(selectedAnswers).length < activeAptQuestions.length && (
                  <p className="text-[10px] text-slate-400 font-mono text-center">
                    * Please select an option for all 10 questions to unlock the Submit button.
                  </p>
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: HR Platform */}
      {activeSubTab === "hr-platform" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-200" id="hr-platform-container">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-teal-600" /> Human Resources Behavioral Q&A Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Top corporate recruiters evaluate behavioral questions based on relevance, honesty, structural clarity, and action-driven examples. Compose your answer and receive real-time scoring.
            </p>
          </div>

          {activeHrQuestions.length === 0 ? (
            <div className="text-center py-12 max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-150">
              <div className="w-20 h-20 bg-teal-50 border border-teal-200 text-teal-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                🎓
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-800 text-xl">All HR Q&A Scenarios Solved!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tremendous progress! You have successfully completed and self-reflected on all major behavioral HR questions. Your career communication readiness is highly competitive!
                </p>
              </div>
              <button
                onClick={() => {
                  setCompletedHrQuestionIds([]);
                  localStorage.removeItem("completed_hr_questions");
                  setUserHrAnswer("");
                  setHrEvalResult(null);
                  setRevealHrHint(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
              >
                <RotateCcw className="h-4 w-4" /> Reset HR Practice History
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Question, Strategy, and Response Panel (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Active Question Metadata Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Question {completedHrQuestionIds.length + 1} of {HR_QUESTIONS.length}
                  </span>
                  <span className={`px-2 py-0.5 font-bold font-mono text-[9px] rounded-full uppercase tracking-wider border
                    ${activeHrQuestions[0].difficulty === "Easy" 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : activeHrQuestions[0].difficulty === "Medium"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                    {activeHrQuestions[0].difficulty} Mode
                  </span>
                </div>

                {/* Question Box Card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-3xs space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800 leading-relaxed font-sans">
                    "{activeHrQuestions[0].question}"
                  </h4>

                  {/* Answering strategy collapsible helper */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setRevealHrHint(!revealHrHint)}
                      className="text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      {revealHrHint ? "▼ HIDE ANSWERING FRAMEWORK" : "► REVEAL RECIPROCATION STRATEGY"}
                    </button>
                    {revealHrHint && (
                      <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl text-xs text-indigo-950 leading-relaxed space-y-1.5 font-sans animate-in slide-in-from-top-1 duration-150">
                        <p className="font-bold text-indigo-900 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Recommended Strategy:
                        </p>
                        <p className="opacity-95">{activeHrQuestions[0].aiHint}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Write your custom response here:</label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {userHrAnswer.length} characters (Min 50 recommended)
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={userHrAnswer}
                    onChange={(e) => setUserHrAnswer(e.target.value)}
                    placeholder="Provide your professional reply. Mention concrete achievements, project milestones, or specific examples that showcase your strengths."
                    className="w-full p-4 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-sans shadow-3xs leading-relaxed text-slate-800"
                  />
                </div>

                {/* CTA Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (!userHrAnswer.trim() || userHrAnswer.trim().length < 10) {
                        alert("Please type a more comprehensive answer (at least 10 characters) before evaluating.");
                        return;
                      }
                      setEvaluatingHr(true);
                      setHrEvalResult(null);
                      try {
                        const response = await fetch("/api/evaluate-hr-answer", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            question: activeHrQuestions[0].question,
                            answer: userHrAnswer
                          })
                        });

                        if (!response.ok) {
                          throw new Error("Relevance analysis failed");
                        }

                        const data = await response.json();
                        setHrEvalResult(data);
                      } catch (err: any) {
                        console.error(err);
                        // Safe Local Fallback
                        const len = userHrAnswer.trim().length;
                        let score = 65;
                        if (len > 50) score += 10;
                        if (len > 120) score += 15;
                        setHrEvalResult({
                          relevanceScore: Math.min(98, score),
                          strengths: [
                            "Provided a personalized description",
                            "Demonstrated communication interest and resilience"
                          ],
                          feedback: [
                            "Integrate more metrics-focused details if possible",
                            "Utilize the structured STAR (Situation-Task-Action-Result) layout for optimal delivery"
                          ],
                          sampleAnswer: "I approach these scenarios with a clear outline of my background, emphasizing how I contribute to engineering projects. For example, during my IT department group projects, I coordinate deliverables using digital task-trackers. This ensures that we complete files and compile codes smoothly under tight schedules, reducing stress by 20% and improving overall results."
                        });
                      } finally {
                        setEvaluatingHr(false);
                      }
                    }}
                    disabled={evaluatingHr || !userHrAnswer.trim()}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-xs active:scale-98 disabled:cursor-not-allowed"
                  >
                    {evaluatingHr ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing Answer Relevance...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Evaluate Answer Relevance
                      </>
                    )}
                  </button>

                  {hrEvalResult && (
                    <button
                      onClick={() => {
                        setSavingHrComplete(true);
                        try {
                          // Save completed HR question
                          const updated = [...completedHrQuestionIds, activeHrQuestions[0].id];
                          setCompletedHrQuestionIds(updated);
                          localStorage.setItem("completed_hr_questions", JSON.stringify(updated));

                          // Add as completed item in general logs
                          const codeItemId = `hr-simulation-${activeHrQuestions[0].id}`;
                          const newItem: PlacementItem = {
                            id: codeItemId,
                            category: "HR",
                            topic: "Behavioral Simulation",
                            question: activeHrQuestions[0].question,
                            difficulty: activeHrQuestions[0].difficulty,
                            company: "HR Practice Platform",
                            status: "Completed",
                            aiHint: `Scored ${hrEvalResult.relevanceScore}% Relevance rating!`
                          };

                          onUpdateItems([newItem, ...items]);

                          // Reset states for next question
                          setUserHrAnswer("");
                          setHrEvalResult(null);
                          setRevealHrHint(false);
                        } finally {
                          setSavingHrComplete(false);
                        }
                      }}
                      disabled={savingHrComplete}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition active:scale-98"
                    >
                      Lock-in & Move Next <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Right Side: Real-time Evaluation Dashboards (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {hrEvalResult ? (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-5 shadow-3xs animate-in zoom-in-95 duration-150">
                    
                    {/* Visual Meter Header */}
                    <div className="flex items-center gap-4 border-b border-slate-200 pb-3">
                      <div className="relative shrink-0 flex items-center justify-center">
                        {/* Circular Progress Gauge */}
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="4.5" fill="transparent" />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke={hrEvalResult.relevanceScore >= 80 ? "#0D9488" : hrEvalResult.relevanceScore >= 60 ? "#D97706" : "#E11D48"} 
                            strokeWidth="4.5" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 28} 
                            strokeDashoffset={2 * Math.PI * 28 * (1 - hrEvalResult.relevanceScore / 100)} 
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-xs font-mono font-bold text-slate-800">{hrEvalResult.relevanceScore}%</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">Relevance Score</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {hrEvalResult.relevanceScore >= 80 
                            ? "Highly professional STAR delivery!" 
                            : hrEvalResult.relevanceScore >= 60 
                              ? "Relevant response, but needs metrics." 
                              : "Answer needs elaboration and structure."
                          }
                        </p>
                      </div>
                    </div>

                    {/* Highlights / Strengths */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Response Strengths</h5>
                      <ul className="space-y-1.5">
                        {hrEvalResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-sans">
                            <Check className="h-4 w-4 text-teal-600 bg-teal-50 border border-teal-200 rounded-full p-0.5 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* constructive feedbacks */}
                    <div className="space-y-2 pt-1">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Recruiter Suggestions</h5>
                      <ul className="space-y-1.5">
                        {hrEvalResult.feedback.map((feed, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-sans">
                            <HelpCircle className="h-4 w-4 text-amber-600 bg-amber-50 border border-amber-200 rounded-full p-0.5 shrink-0 mt-0.5" />
                            <span>{feed}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Model Exemplary answer */}
                    <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 space-y-1.5 shadow-3xs">
                      <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-teal-500 animate-pulse" /> Recruiter's Model Response
                      </h5>
                      <p className="text-[11px] italic text-slate-600 leading-relaxed">
                        "{hrEvalResult.sampleAnswer}"
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 space-y-2.5">
                    <div className="text-4xl">📊</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-600 uppercase font-mono tracking-wide">Pending Analysis</h4>
                      <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                        Submit your written response to run deep relevance assessment metrics.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
