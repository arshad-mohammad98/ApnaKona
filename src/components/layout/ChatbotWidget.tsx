"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  ShieldCheck,
  Building,
  DollarSign,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  {
    label: "Find a PG near my college",
    icon: Building,
    prompt: "How can I find a PG near my college?",
  },
  {
    label: "How does verification work?",
    icon: ShieldCheck,
    prompt: "How does property and owner verification work on ApnaKona?",
  },
  {
    label: "What's a safe budget range?",
    icon: DollarSign,
    prompt: "What is a realistic budget range for student PGs and hostels?",
  },
  {
    label: "How do I list my property?",
    icon: Compass,
    prompt: "How do I list my property on ApnaKona as an owner?",
  },
];

const FALLBACK_KNOWLEDGE: Record<string, string> = {
  "How can I find a PG near my college?":
    "Here is how to quickly find a PG near your campus:\n\n" +
    "1. Go to the **[Find PG / Hostel](/search)** tab in the top navigation.\n" +
    "2. Enter your **college or locality name** in the search bar.\n" +
    "3. Set your preferred distance filter and room sharing (Single, Double, or Triple).\n" +
    "4. Look for listings with the **Verified** badge 🛡️ for zero-brokerage and inspected amenities.\n\n" +
    "Would you like me to recommend budget ranges for a specific city?",

  "How does property and owner verification work on ApnaKona?":
    "Student safety is our top priority! Here is our 3-step verification system:\n\n" +
    "- 🛡️ **Physical Inspection**: Our field team verifies premises for CCTV, safety, fire exits, and cleanliness.\n" +
    "- 📄 **Owner KYC**: We verify government ID and property ownership records before awarding the badge.\n" +
    "- ⚡ **Amenity Testing**: High-speed Wi-Fi, drinking water, and power backup are validated on-site.\n\n" +
    "Verified rooms carry the green shield icon so you can book with confidence.",

  "What is a realistic budget range for student PGs and hostels?":
    "Here is a typical student budget guide across Indian cities:\n\n" +
    "- **Metro Cities (Bengaluru, Delhi NCR, Mumbai, Pune)**:\n" +
    "  - *Triple/Quad Sharing*: ₹6,500 – ₹9,500/mo (with meals + Wi-Fi)\n" +
    "  - *Double Sharing*: ₹9,500 – ₹15,000/mo\n" +
    "  - *Private Single Room*: ₹15,000 – ₹24,000/mo\n" +
    "- **Tier 2 Cities (Jaipur, Indore, Lucknow, Chandigarh)**:\n" +
    "  - *Shared*: ₹4,500 – ₹8,000/mo\n" +
    "  - *Single*: ₹8,500 – ₹13,000/mo\n\n" +
    "💡 *Pro-tip: Always check if meals, electricity units, and security deposits are included.*",

  "How do I list my property on ApnaKona as an owner?":
    "Listing your PG, hostel, or flat on ApnaKona is 100% free with zero commission:\n\n" +
    "1. Click **Sign Up** and select the **Owner** role.\n" +
    "2. Open your Owner Dashboard and click **+ Add Listing**.\n" +
    "3. Add clear photos, room types, house rules, and monthly rent.\n" +
    "4. Request an inspection visit to earn the **Verified Partner** badge and get up to 3x more student leads!\n\n" +
    "Need help getting started? Visit our [Property Listing Guide](/role-select).",
};

const DEFAULT_GREETING =
  "Hi! I'm **Roomie** 👋 Your personal ApnaKona housing guide.\n\n" +
  "I can help you discover verified PGs near your campus, break down realistic rents, check safety features, or guide you through listing a property. What are you looking for?";

function getFormattedTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateMsgId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "bot",
      text: DEFAULT_GREETING,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize saved theme and messages safely after mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("apnakona_chatbot_theme");
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setTimeout(() => setIsDark(true), 0);
      }

      const saved =
        localStorage.getItem("roomie_chat_history") ||
        localStorage.getItem("kona_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => setMessages(parsed), 0);
        }
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("roomie_chat_history", JSON.stringify(messages));
      } catch {
        // Silently catch quota exceptions
      }
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Prevent background scrolling on mobile when open
  useEffect(() => {
    if (open && typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    try {
      localStorage.setItem("apnakona_chatbot_theme", nextTheme ? "dark" : "light");
    } catch {
      // Storage unavailable
    }
  };

  const clearChat = () => {
    const freshGreeting: Message = {
      id: generateMsgId(),
      role: "bot",
      text: DEFAULT_GREETING,
      time: getFormattedTime(),
    };
    setMessages([freshGreeting]);
    try {
      localStorage.setItem("roomie_chat_history", JSON.stringify([freshGreeting]));
    } catch {
      // ignore
    }
  };

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || loading) return;

    const userMsg: Message = {
      id: generateMsgId(),
      role: "user",
      text: cleanText,
      time: getFormattedTime(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let filteredMessages = newMessages;
      if (filteredMessages.length > 0 && filteredMessages[0].role === "bot") {
        filteredMessages = filteredMessages.slice(1);
      }

      const apiMessages = filteredMessages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Chat service returned an error");
      }

      const data = await response.json();

      if (data.error || !data.reply) {
        const fallback =
          FALLBACK_KNOWLEDGE[cleanText] ||
          "I'm here to help with all ApnaKona questions! You can search verified student PGs and hostels directly on our [Search Page](/search), check safe local neighborhoods on our [Explore Map](/explore), or post room requirements on [Connect](/connect).";
        setMessages((prev) => [
          ...prev,
          {
            id: generateMsgId(),
            role: "bot",
            text: fallback,
            time: getFormattedTime(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMsgId(),
            role: "bot",
            text: data.reply,
            time: getFormattedTime(),
          },
        ]);
      }
    } catch {
      const fallback =
        FALLBACK_KNOWLEDGE[cleanText] ||
        "I'm currently assisting in offline mode! You can browse 100% verified student accommodations on our [Search](/search) page, or check student safety guidelines in our [Grievance & Support](/grievance) center. Feel free to ask another question!";
      setMessages((prev) => [
        ...prev,
        {
          id: generateMsgId(),
          role: "bot",
          text: fallback,
          time: getFormattedTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isInitialState = messages.length <= 1;

  return (
    <div className={isDark ? "dark" : ""}>
      {/* Floating Circular Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        {!open && (
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0F4C81] via-[#1a6db5] to-[#FF6B35] opacity-70 blur-sm animate-pulse-glow" />

            <button
              id="chatbot-launcher"
              onClick={() => setOpen(true)}
              aria-label="Chat with Roomie AI"
              className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0F4C81] via-[#155a96] to-[#FF6B35] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#0F4C81]/30"
            >
              <div className="relative flex items-center justify-center">
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
                <Sparkles
                  className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-spin"
                  style={{ animationDuration: "6s" }}
                />
              </div>

              {/* Online Green Pulsing Indicator */}
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900" />
              </span>
            </button>

            {/* Hover Tooltip Badge */}
            <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#1A1A2E] text-white text-xs font-medium rounded-xl whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              Need help? Ask Roomie 👋
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-solid border-l-[#1A1A2E] border-l-4 border-y-transparent border-y-4 border-r-0" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Window: Full-screen on Mobile (<768px), Wide Panel on Desktop/Tablet (>=768px) */}
      <div
        id="chatbot-window"
        role="dialog"
        aria-label="Roomie AI Housing Assistant"
        className={`fixed z-50 transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }
        /* Mobile: Full-screen display */
        inset-0 w-full h-[100dvh] rounded-none
        /* Tablet & Desktop: Wide panel */
        md:inset-auto md:bottom-6 md:right-6 md:w-[460px] md:h-[640px] md:max-h-[88vh] md:rounded-3xl
        flex flex-col overflow-hidden shadow-2xl
        border border-gray-200/80 dark:border-gray-800/80
        bg-white dark:bg-[#151726] text-gray-900 dark:text-gray-100
        backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10
        `}
      >
        {/* Header */}
        <div className="relative px-4 py-3.5 bg-gradient-to-r from-[#0F4C81] via-[#165a9a] to-[#0F4C81] text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-[#0F4C81] rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </span>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-base tracking-tight text-white">Roomie</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  AI Guide
                </span>
              </div>
              <p className="text-xs text-white/80">ApnaKona Housing Assistant</p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle chatbot theme"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={clearChat}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot window"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#10121f]/50">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] animate-message-in ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 border border-[#0F4C81]/20 flex items-center justify-center text-[#0F4C81] dark:text-[#5c93e2] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-[#0F4C81] text-white rounded-br-xs font-medium"
                        : "bg-white dark:bg-[#1a1d2e] text-gray-800 dark:text-gray-100 rounded-bl-xs border border-gray-100 dark:border-gray-800"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                        li: ({ children }) => <li className="text-xs sm:text-sm">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="inline-flex items-center gap-0.5 text-[#FF6B35] dark:text-[#ff8558] hover:underline font-semibold"
                            target={href?.startsWith("http") ? "_blank" : undefined}
                            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {children}
                            <ArrowUpRight className="w-3 h-3 inline" />
                          </a>
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                  <p
                    className={`text-[10px] text-gray-400 dark:text-gray-500 px-1 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 max-w-[80%] animate-message-in">
              <div className="w-8 h-8 rounded-xl bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 flex items-center justify-center text-[#0F4C81] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl rounded-bl-xs px-4 py-3 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0F4C81] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#0F4C81] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#0F4C81] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Replies Panel */}
        {isInitialState && (
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#151726]/80 shrink-0">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Common Questions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {QUICK_REPLIES.map(({ label, icon: Icon, prompt }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-2 p-2.5 text-xs text-left text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1c2033] hover:bg-[#0F4C81]/10 dark:hover:bg-[#0F4C81]/20 hover:text-[#0F4C81] dark:hover:text-[#5c93e2] rounded-xl border border-gray-200/60 dark:border-gray-700/60 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Icon className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#5c93e2] shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#151726] border-t border-gray-200 dark:border-gray-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Roomie about PGs, rent, rules..."
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-[#1c2033] border border-gray-200 dark:border-gray-700/80 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#0F4C81] dark:focus:border-[#5c93e2] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0F4C81] text-white hover:bg-[#0d3f6e] disabled:opacity-40 disabled:hover:bg-[#0F4C81] transition-all cursor-pointer shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-gray-400 dark:text-gray-500">
            <span>Powered by ApnaKona AI</span>
            <span>Zero Brokerage • Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
