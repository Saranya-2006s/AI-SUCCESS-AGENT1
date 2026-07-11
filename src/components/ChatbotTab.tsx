import React from "react";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RefreshCw, 
  BrainCircuit,
  MessageSquareCode
} from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotTabProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
}

export default function ChatbotTab({
  chatHistory,
  onSendMessage,
  isLoading,
  onClearChat
}: ChatbotTabProps) {
  const [inputText, setInputText] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Suggested prompt list
  const suggestedPrompts = [
    "How many classes can I miss?",
    "Create today's study plan.",
    "Suggest DSA problems.",
    "Explain Operating Systems.",
    "What should I study for DBMS?"
  ];

  // Auto Scroll to Bottom on message updates
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestedClick = (promptText: string) => {
    if (isLoading) return;
    onSendMessage(promptText);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]" id="chatbot-tab-container">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-950 text-white rounded-t-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-800 rounded-lg text-emerald-300">
            <MessageSquareCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">AI Campus Success Advisor</h3>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wide uppercase">ONLINE | GEMINI POWERED</p>
          </div>
        </div>

        <button 
          onClick={onClearChat}
          className="text-xs hover:bg-white/10 text-emerald-300 hover:text-white px-2.5 py-1 rounded transition border border-emerald-800"
        >
          Clear History
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 animate-pulse">
              <Bot className="h-10 w-10" />
            </div>
            <div className="max-w-md">
              <h4 className="font-display font-bold text-slate-800 text-sm">Welcome to your AI Companion!</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                I am your dedicated academic advisor and peer success coach. Ask me about OS scheduling, database query suggestions, attendance planning, or placement test preparation.
              </p>
            </div>
            
            {/* Quick Suggestions Board */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest font-semibold">Suggested Questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestedClick(prompt)}
                    className="p-3 bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl text-left text-xs font-medium text-slate-700 transition shadow-2xs hover:border-emerald-300 text-ellipsis overflow-hidden select-none cursor-pointer"
                  >
                    💡 "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-4/5 ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar Icon */}
                  <div className={`p-2 rounded-full shrink-0 h-9 w-9 flex items-center justify-center text-sm shadow-2xs
                    ${isBot ? "bg-emerald-900 text-emerald-200" : "bg-indigo-600 text-indigo-100"}
                  `}>
                    {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  {/* Message bubble */}
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-3xs
                      ${isBot 
                        ? "bg-white text-slate-700 border border-slate-200/80 rounded-tl-xs" 
                        : "bg-indigo-600 text-white rounded-tr-xs"
                      }
                    `}>
                      {/* Simple line-break formatter to handle AI paragraphs nicely */}
                      <div className="whitespace-pre-line">
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block px-1.5">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing loading bubble */}
            {isLoading && (
              <div className="flex gap-3 max-w-4/5 mr-auto">
                <div className="p-2 rounded-full bg-emerald-900 text-emerald-200 h-9 w-9 flex items-center justify-center shadow-2xs animate-spin">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="bg-white text-slate-500 border rounded-2xl p-4 text-xs font-mono rounded-tl-xs flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>AI Agent is drafting advice...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested chips row during ongoing chat */}
      {chatHistory.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 border-t flex items-center gap-2 overflow-x-auto shrink-0 select-none">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold shrink-0">Quick Ask:</span>
          {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSuggestedClick(prompt)}
              className="text-[11px] font-sans font-medium text-emerald-800 hover:text-white hover:bg-emerald-800 border border-emerald-100 hover:border-emerald-800 bg-white px-2.5 py-1 rounded-full transition shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Footer Input bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2 items-center bg-white rounded-b-xl shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a campus success question (e.g. explain process scheduling locks)..."
          className="flex-1 bg-slate-50 border border-slate-200 p-2.5 px-4 rounded-xl text-xs font-sans text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-emerald-800 hover:bg-emerald-950 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-xl transition shrink-0 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
