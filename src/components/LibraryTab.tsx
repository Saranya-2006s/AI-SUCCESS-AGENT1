import React from "react";
import { 
  Bookmark, 
  Search, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Tag
} from "lucide-react";
import { LibraryBook } from "../types";

interface LibraryTabProps {
  books: LibraryBook[];
  onUpdateBooks: (books: LibraryBook[]) => void;
}

interface AIRecommendItem {
  title: string;
  author: string;
  reason: string;
  difficulty: string;
}

export default function LibraryTab({
  books,
  onUpdateBooks
}: LibraryTabProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [overdueDays, setOverdueDays] = React.useState<number>(5);
  const [calculatedFine, setCalculatedFine] = React.useState<number>(5); // 5 days * ₹1

  // AI Recommendation states
  const [topic, setTopic] = React.useState("Artificial Intelligence");
  const [aiRecommends, setAiRecommends] = React.useState<AIRecommendItem[]>([]);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  // Form states for manual borrowing
  const [newTitle, setNewTitle] = React.useState("");
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newBorrowedDate, setNewBorrowedDate] = React.useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [newDueDate, setNewDueDate] = React.useState("");

  // Calculate exact days overdue for a book
  const getOverdueDays = (bk: LibraryBook) => {
    if (bk.status === "Returned") return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(bk.dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (isNaN(due.getTime())) return 0;
    
    if (today > due) {
      const diffTime = today.getTime() - due.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    return 0;
  };

  // Calculate dynamic fine for any given book (₹1 per day overdue)
  const getDynamicFine = (bk: LibraryBook) => {
    return getOverdueDays(bk) * 1; // ₹1 per day
  };

  // Calculate fine instantly when days overdue changes in the calculator tool
  React.useEffect(() => {
    // ₹1 fine per day overdue
    setCalculatedFine(overdueDays * 1);
  }, [overdueDays]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate || !newBorrowedDate) return;

    const newBook: LibraryBook = {
      id: `bk-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || "Unknown Author",
      borrowedDate: newBorrowedDate,
      dueDate: newDueDate,
      status: "Borrowed",
      fine: 0
    };

    onUpdateBooks([newBook, ...books]);
    setNewTitle("");
    setNewAuthor("");
    setNewDueDate("");
    setNewBorrowedDate(new Date().toISOString().split('T')[0]);
  };

  const handleFetchRecommendations = async () => {
    if (!topic.trim()) return;
    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/book-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestTopic: topic.trim() })
      });

      if (!response.ok) {
        throw new Error("Failed to load recommendations");
      }

      const data = await response.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setAiRecommends(data.recommendations);
      }
    } catch (err) {
      console.warn("AI recommendations error, applying standard librarian fallbacks:", err);
      // Fallback curated books
      const fallbacks: AIRecommendItem[] = [
        {
          title: "Artificial Intelligence: A Modern Approach (4th Edition)",
          author: "Stuart Russell & Peter Norvig",
          reason: "The absolute gold-standard, definitive bible for learning foundational machine learning and AI agent architectures.",
          difficulty: "Medium"
        },
        {
          title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
          author: "Aurélien Géron",
          reason: "Excellent code-driven, highly practical textbook with zero-fluff explanations of neural networks.",
          difficulty: "Hard"
        },
        {
          title: "Life 3.0: Being Human in the Age of Artificial Intelligence",
          author: "Max Tegmark",
          reason: "A fantastic, conversational, philosophical inquiry regarding the future societal impacts of superintelligence.",
          difficulty: "Easy"
        }
      ];
      setAiRecommends(fallbacks);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleReturnBook = (id: string) => {
    const updated = books.map(bk => {
      if (bk.id === id) {
        return {
          ...bk,
          status: "Returned" as const,
          fine: 0
        };
      }
      return bk;
    });
    onUpdateBooks(updated);
  };

  // Filter book inventory
  const filteredBooks = books.filter(bk => 
    bk.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bk.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort books: "Borrowed" first, "Returned" last (moves returned books down)
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (a.status === "Borrowed" && b.status === "Returned") return -1;
    if (a.status === "Returned" && b.status === "Borrowed") return 1;
    return 0;
  });

  return (
    <div className="space-y-6" id="library-tab-container">
      {/* Intro Box */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
          <Bookmark className="h-5.5 w-5.5 text-emerald-500" /> Library Assistant & Book Recommendations
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Search borrowed textbooks, register manual library transactions with custom due dates, calculate overdue fines at ₹1/day, and request specialized reading recommendations.
        </p>
      </div>

      {/* Main Grid: Inventory Search & Fine Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Borrowed Books Inventory (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-5">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm">Active Borrowed Inventory</h3>
              <p className="text-[10px] text-slate-400 font-mono">TRACKING CURRENT DUE DATES</p>
            </div>

            {/* Book Search Bar */}
            <div className="relative w-full sm:w-56 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory books..."
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Manual Borrow Book Entry Form */}
          <form onSubmit={handleAddBook} className="bg-emerald-50/40 p-4 border border-emerald-100/50 rounded-xl space-y-3">
            <h4 className="font-display font-semibold text-emerald-900 text-xs flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-700" /> Borrow/Register a Book Manually
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[9px] font-mono text-emerald-800 font-semibold block mb-1">BOOK TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-emerald-100/80 px-2 py-1.5 rounded text-xs text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-emerald-800 font-semibold block mb-1">AUTHOR NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Roger S. Pressman"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-white border border-emerald-100/80 px-2 py-1.5 rounded text-xs text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-emerald-800 font-semibold block mb-1">BORROWED DATE *</label>
                <input
                  type="date"
                  required
                  value={newBorrowedDate}
                  onChange={(e) => setNewBorrowedDate(e.target.value)}
                  className="w-full bg-white border border-emerald-100/80 px-2 py-1.5 rounded text-xs text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-emerald-800 font-semibold block mb-1">DUE DATE *</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-white border border-emerald-100/80 px-2 py-1.5 rounded text-xs text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-950 text-white font-sans font-semibold text-xs py-1.5 px-4 rounded-lg cursor-pointer transition shadow-3xs"
            >
              + Register Borrowed Book
            </button>
          </form>

          {/* Book List (Sorted dynamically: Borrowed on top, Returned at the bottom) */}
          <div className="space-y-3">
            {sortedBooks.map((bk) => {
              const isBorrowed = bk.status === "Borrowed";
              const dynamicFine = getDynamicFine(bk);
              
              return (
                <div key={bk.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-start gap-4 transition">
                  <div className="space-y-1.5 overflow-hidden">
                    <p className={`font-sans font-semibold text-slate-800 leading-snug truncate ${!isBorrowed ? 'text-slate-400 font-normal' : ''}`}>
                      {bk.title}
                    </p>
                    <p className="text-slate-500 text-[10px] font-mono">Author: {bk.author}</p>
                    
                    <div className="flex flex-wrap items-center gap-3.5 pt-1 text-[10px] text-slate-400 font-mono">
                      {bk.borrowedDate && (
                        <span className="flex items-center gap-1 bg-slate-100/70 px-1.5 py-0.5 rounded border border-slate-200/50">
                          <span className="font-semibold text-slate-500">Borrowed:</span> {bk.borrowedDate}
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-amber-50/70 text-amber-900/80 px-1.5 py-0.5 rounded border border-amber-200/40">
                        <Calendar className="h-3.5 w-3.5 text-amber-600/70" /> <span className="font-semibold text-slate-600">Due:</span> {bk.dueDate}
                      </span>
                      {dynamicFine > 0 && isBorrowed && (
                        <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-0.5">
                          Overdue Fine: ₹{dynamicFine}
                        </span>
                      )}
                      {!isBorrowed && (
                        <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          Returned
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded font-mono uppercase tracking-wider
                      ${isBorrowed ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}
                    `}>
                      {bk.status}
                    </span>

                    {isBorrowed && (
                      <button
                        onClick={() => handleReturnBook(bk.id)}
                        className="bg-white hover:bg-emerald-50 text-emerald-800 hover:border-emerald-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg border shadow-3xs cursor-pointer transition"
                      >
                        Return book
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {sortedBooks.length === 0 && (
              <p className="p-8 text-center text-slate-400 text-xs">No books match your query.</p>
            )}
          </div>
        </div>

        {/* Fine Calculator Sidebar (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-5 h-fit">
          <div className="border-b pb-2">
            <h3 className="font-display font-bold text-slate-800 text-sm">Librarian Fine Calculator</h3>
            <p className="text-[10px] text-slate-400 font-mono">Overdue rate: ₹1.00 per day</p>
          </div>

          {/* SECTION 1: Automatic Live Fines (Based on Inventory) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              ● Live Inventory Fines
            </h4>
            
            {(() => {
              const overdueBooks = books.filter(bk => bk.status === "Borrowed" && getDynamicFine(bk) > 0);
              const totalLiveFine = books.reduce((sum, bk) => sum + getDynamicFine(bk), 0);
              
              return (
                <div className="space-y-3">
                  {overdueBooks.length === 0 ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs">
                      ✔ Great job! No books are currently overdue. Total active fine is ₹0.
                    </div>
                  ) : (
                    <div className="space-y-2 border-l-2 border-rose-200 pl-3">
                      {overdueBooks.map(bk => {
                        const days = getOverdueDays(bk);
                        const fine = getDynamicFine(bk);
                        return (
                          <div key={bk.id} className="text-xs flex justify-between gap-2 text-slate-600">
                            <span className="truncate max-w-[180px] font-medium" title={bk.title}>
                              {bk.title}
                            </span>
                            <span className="shrink-0 text-slate-400 font-mono text-[11px]">
                              {days} days &rarr; <span className="text-rose-600 font-bold">₹{fine}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Auto-updating Total Fine Card */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-700">Total Active Fine:</div>
                      <div className="text-[10px] text-slate-400 font-mono">Auto-syncs with inventory</div>
                    </div>
                    <div className="text-2xl font-mono font-bold text-rose-600">
                      ₹{totalLiveFine}.00
                    </div>
                  </div>

                  {totalLiveFine > 100 && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-xs flex gap-1.5 leading-relaxed">
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Severe Warning:</span> Live overdue fines exceed ₹100. Please return these books soon to prevent library locks!
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* SECTION 2: Manual Simulator */}
          <div className="pt-3 border-t border-slate-100 space-y-3.5">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              ● Sandbox Estimator
            </h4>
            
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 block">Simulate Days Overdue</label>
              <input
                type="number"
                min="0"
                value={overdueDays}
                onChange={(e) => setOverdueDays(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-300"
              />
            </div>

            {/* Display Simulated Cost */}
            <div className="p-3 bg-slate-50/50 border border-dashed rounded-lg flex items-center justify-between">
              <div className="text-[11px] font-sans text-slate-500">Simulated Estimate:</div>
              <div className="text-lg font-mono font-bold text-slate-600">₹{calculatedFine}.00</div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Book Recommender Box */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
        
        {/* Recommendation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-500 animate-pulse" /> Ask AI University Librarian
            </h3>
            <p className="text-xs text-slate-500">Provide a topic of interest (e.g. Compiler Design, Python ML) to fetch academic textbook suggestions.</p>
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto shrink-0">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Cryptography"
              className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white w-full sm:w-48"
            />
            <button
              onClick={handleFetchRecommendations}
              disabled={isLoadingAI}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-sans font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              {isLoadingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-emerald-300" />}
              <span>Get Suggestions</span>
            </button>
          </div>
        </div>

        {/* Suggested books list */}
        {aiRecommends.length === 0 ? (
          <p className="p-8 text-center border border-dashed rounded-lg text-slate-400 text-xs">
            Enter a subject focus and click "Get Suggestions" to summon recommendations.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecommends.map((rec, index) => (
              <div key={index} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between space-y-3 hover:shadow-2xs transition">
                <div className="space-y-1.5">
                  <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[9px] text-indigo-700 rounded font-bold font-mono">
                    DIFFICULTY: {rec.difficulty.toUpperCase()}
                  </span>
                  <h4 className="font-sans font-bold text-slate-800 text-xs leading-snug pt-1">{rec.title}</h4>
                  <p className="text-slate-500 text-[10px] font-mono font-medium">By: {rec.author}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed pt-1 italic">
                    "{rec.reason}"
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100/50 rounded flex items-center gap-1 w-fit">
                  <Tag className="h-3 w-3" /> Technical Recommendation
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
