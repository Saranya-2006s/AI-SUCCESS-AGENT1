import React from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCheck, 
  ClipboardList, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Bookmark, 
  Target, 
  TrendingUp, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { StudentProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
}

export default function Sidebar({ activeTab, setActiveTab, profile }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "planner", name: "AI Study Planner", icon: BookOpen },
    { id: "attendance", name: "Attendance Predictor", icon: UserCheck },
    { id: "assignments", name: "Assignment Manager", icon: ClipboardList },
    { id: "placement", name: "Placement Preparation", icon: Briefcase },
    { id: "timetable", name: "Timetable Assistant", icon: Calendar },
    { id: "chatbot", name: "AI Chatbot", icon: MessageSquare },
    { id: "library", name: "Library Assistant", icon: Bookmark },
    { id: "goals", name: "Daily Goal Generator", icon: Target },
    { id: "analytics", name: "Performance Analytics", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-emerald-900 text-white p-4 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <h1 className="font-display font-bold text-lg tracking-tight">Success Agent</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1 hover:bg-emerald-800 rounded transition"
          aria-label="Toggle Menu"
          id="toggle-sidebar-button"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-35 bg-emerald-950 text-emerald-100 w-64 border-r border-emerald-900/40 flex flex-col transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-900/60 hidden md:flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-white tracking-tight">Campus Companion</h1>
            <span className="text-xs text-emerald-400 font-mono tracking-wider">AI SUCCESS AGENT</span>
          </div>
        </div>

        {/* Student Mini Profile Info */}
        <div className="p-6 bg-emerald-950/60 border-b border-emerald-900/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400/40 flex items-center justify-center font-display font-bold text-white shrink-0 text-sm select-none">
            {profile.name ? profile.name.charAt(0) : "S"}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-sans font-medium text-sm text-white truncate">{profile.name}</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-medium">{profile.course || "IT Department"}</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? "bg-emerald-800 text-white shadow-sm shadow-emerald-950/50" 
                    : "text-emerald-300 hover:bg-emerald-900/40 hover:text-white"
                  }
                `}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-300" : "text-emerald-500"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-900/60 text-center">
          <p className="text-[11px] text-emerald-400 font-mono">Academic Session 2026</p>
          <p className="text-[10px] text-emerald-500/70 mt-1 font-sans">Empowering College Journey</p>
        </div>
      </aside>
    </>
  );
}
