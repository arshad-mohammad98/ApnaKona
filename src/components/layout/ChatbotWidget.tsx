"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
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

// High quality fallback answers for offline/API issues
const FALLBACK_KNOWLEDGE: Record<string, string> = {
  "How can I find a PG near my college?":
    "Here is how to quickly find a PG near your campus:\n\n" +
    "1. Go to the **[Find PG / Hostel](/search)** tab in the top navigation.\n" +
    "2. Enter your **college or university name** in the search bar.\n" +
    "3. Set your preferred distance filter (e.g. within 1–3 km) and room sharing (Single, Double, or Triple).\n" +
    "4. Look for listings with the **Verified** badge 🛡️ for guaranteed zero-brokerage and inspected amenities.\n\n" +
    "Would you like me to recommend budget ranges or localities for a specific city?",

  "How does property and owner verification work on ApnaKona?":
    "Student safety is our top priority! Here is our 3-step verification system:\n\n" +
    "- 🛡️ **Physical Inspection**: Our field team verifies premises for CCTV, security, fire safety, and hygiene.\n" +
    "- 📄 **Owner KYC**: We verify government ID and ownership records before awarding the verified badge.\n" +
    "- ⚡ **Amenity Testing**: High-speed Wi-Fi, RO drinking water, and backup power are validated on-site.\n\n" +
    "Verified rooms carry the green shield icon on their listing card so you can book with 100% confidence.",

  "What is a realistic budget range for student PGs and hostels?":
    "Here is a typical student budget guide across Indian cities:\n\n" +
    "- **Metro Cities (Bengaluru, Delhi NCR, Mumbai, Pune)**:\n" +
    "  - *Triple/Quad Sharing*: ₹6,500 – ₹9,500/mo (usually includes meals + Wi-Fi)\n" +
    "  - *Double Sharing*: ₹9,500 – ₹15,000/mo\n" +
    "  - *Private Single Room*: ₹15,000 – ₹24,000/mo\n" +
    "- **Tier 2 Cities (Jaipur, Indore, Lucknow, Chandigarh)**:\n" +
    "  - *Shared*: ₹4,500 – ₹8,000/mo\n" +
    "  - *Single*: ₹8,500 – ₹13,000/mo\n\n" +
    "💡 *Pro-tip: Always check if meals, electricity units, and security deposits are included.*",

  "How do I list my property on ApnaKona as an owner?":
    "Listing your PG, hostel, or flat on ApnaKona is 100% free with zero commission:\n\n" +
    "1. Click **Sign Up** and choose the **Owner** role.\n" +
    "2. Open your Owner Dashboard and click **+ Add Listing**.\n" +
    "3. Add clear photos, room sharing types, rules (curfew, food policy), and monthly rent.\n" +
    "4. Request an inspection visit to earn the **Verified Partner** badge and get up to 3x more student leads!\n\n" +
    "Need help getting started? Visit our [Property Listing Guide](/role-select).",
};

const DEFAULT_GREETING =
  "Hi! I'm **Kona** 👋 Your personal ApnaKona housing assistant.\n\n" +
  "I can help you discover verified PGs near your college, compare rents, understand safety features, or guide you through listing your property. How can I help you today?";

function now() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize theme and messages from localStorage
  useEffect(() => {
    // Check system preference or existing theme
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("apnakona_chatbot_theme");
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }

    const saved = localStorage.getItem("kona_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        // Fallback to initial greeting
      }
    }

    // Default first greeting
    setMessages([
      {
        id: "initial-greeting",
        role: "bot",
        text: DEFAULT_GREETING,
        time: now(),
      },
    ]);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("kona_chat_history", JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [open]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem("apnakona_chatbot_theme", nextTheme ? "dark" : "light");
  };

  const clearChat = () => {
    const freshGreeting: Message = {
      id: Date.now().toString(),
      role: "bot",
      text: DEFAULT_GREETING,
      time: now(),
    };
    setMessages([freshGreeting]);
    localStorage.setItem("kona_chat_history", JSON.stringify([freshGreeting]));
  };

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: cleanText,
      time: now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Prepare history for API (filter out first bot greeting if needed)
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
        throw new Error("Chat service responded with an error");
      }

      const data = await response.json();

      if (data.error || !data.reply) {
        // Fallback to local knowledge base
        const fallback =
          FALLBACK_KNOWLEDGE[cleanText] ||
          "I'm here to help with all ApnaKona questions! You can search verified student PGs and hostels directly on our [Search Page](/search), check safe local neighborhoods on our [Explore Map](/explore), or post room requirements on [Connect](/connect).";
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: fallback,
            time: now(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: data.reply,
            time: now(),
          },
        ]);
      }
    } catch (err) {
      // Graceful offline / fallback handling
      const fallback =
        FALLBACK_KNOWLEDGE[cleanText] ||
        "I'm currently assisting in offline mode! You can browse 100% verified student accommodations on our [Search](/search) page, or check student safety guidelines in our [Grievance & Support](/grievance) center. Feel free to ask another question!";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: fallback,
          time: now(),
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
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        {!open && (
          <div className="relative group">
            {/* Ambient Pulse Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0F4C81] via-[#1a6db5] to-[#FF6B35] opacity-70 blur-sm animate-pulse-glow" />

            <button
              id="chatbot-launcher"
              onClick={() => setOpen(true)}
              aria-label="Chat with Kona AI"
              className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0F4C81] via-[#155a96] to-[#FF6B35] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#0F4C81]/30"
            >
              {/* Bot Avatar Icon */}
              <div className="relative flex items-center justify-center">
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: "6s" }} />
              </div>

              {/* Online Green Pulsing Indicator */}
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900" />
              </span>
            </button>

            {/* Hover Tooltip Badge */}
            <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#1A1A2E] text-white text-xs font-medium rounded-xl whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              Need help? Ask Kona 👋
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-solid border-l-[#1A1A2E] border-l-4 border-y-transparent border-y-4 border-r-0" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div
        id="chatbot-window"
        role="dialog"
        aria-label="Kona AI Housing Assistant"
        className={`fixed z-50 transition-all duration-300 ease-out origin-bottom-right ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }
        /* Mobile: responsive bottom sheet / near full screen */
        bottom-4 right-3 left-3 h-[calc(100dvh-5rem)] max-h-[640px]
        /* Desktop: fixed compact window */
        sm:left-auto sm:right-6 sm:bottom-6 sm:w-[380px] sm:h-[550px] sm:max-h-[85vh]
        flex flex-col rounded-3xl overflow-hidden shadow-2xl
        border border-gray-200/80 dark:border-gray-800/80
        bg-white dark:bg-[#151726] text-gray-900 dark:text-gray-100
        backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10
        `}
      >
        {/* Header */}
        <div className="relative px-4 py-3.5 bg-gradient-to-r from-[#0F4C81] via-[#165a9a] to-[#0F4C81] text-white flex items-center justify-between shadow-sm shrink-0">
          {/* Header Left: Avatar + Title */}
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
                <h3 className="font-semibold text-base tracking-tight text-white">
                  Kona
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/20 text-white/90">
                  AI Guide
                </span>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-1">
                ApnaKona Housing Assistant
              </p>
            </div>
          </div>

          {/* Header Right: Controls */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle chatbot theme"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={clearChat}
              title="Reset conversation"
              aria-label="Reset chat history"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              id="chatbot-close-button"
              onClick={() => setOpen(false)}
              aria-label="Close chat window"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors ml-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/70 dark:bg-[#121422] transition-colors">
          {messages.map((msg) => {
            const isBot = msg.role === "bot";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end animate-message-in ${
                  isBot ? "justify-start" : "justify-end"
                }`}
              >
                {/* Bot Avatar beside bot bubbles */}
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center shrink-0 shadow-sm mb-1 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
                    isBot
                      ? "bg-white dark:bg-[#1E2238] text-gray-800 dark:text-gray-100 border border-gray-200/70 dark:border-gray-700/60 rounded-bl-xs"
                      : "bg-gradient-to-r from-[#0F4C81] to-[#1c6bb3] text-white rounded-br-xs"
                  }`}
                >
                  {isBot ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100 text-sm [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-1.5 [&>ul]:pl-4 [&>ol]:my-1.5 [&>ol]:pl-4 [&>ul>li]:list-disc [&>ol>li]:list-decimal [&>ul>li]:my-0.5 [&>ol>li]:my-0.5 [&_strong]:font-semibold [&_a]:text-[#0F4C81] dark:[&_a]:text-sky-400 [&_a]:underline font-normal">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  <div
                    className={`text-[10px] mt-1 text-right select-none ${
                      isBot ? "text-gray-400 dark:text-gray-500" : "text-white/70"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-2.5 items-end animate-message-in">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center shrink-0 text-white shadow-sm mb-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-[#1E2238] border border-gray-200/70 dark:border-gray-700/60 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 font-medium">
                  Kona is thinking
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-sky-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-sky-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-sky-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {/* Empty state Quick Reply Suggestions */}
          {isInitialState && !loading && (
            <div className="pt-2 animate-message-in">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF6B35]" />
                Suggested Questions
              </p>
              <div className="flex flex-col gap-2">
                {QUICK_REPLIES.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    className="flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E2238] hover:bg-[#0F4C81]/5 dark:hover:bg-[#252a45] text-xs font-medium text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700/70 hover:border-[#0F4C81]/40 dark:hover:border-sky-500/40 shadow-xs hover:shadow-sm transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#0F4C81] dark:text-sky-400 group-hover:scale-110 transition-transform" />
                      {label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips bar when in active conversation */}
        {!isInitialState && (
          <div className="px-3 py-2 bg-white/90 dark:bg-[#161829] border-t border-gray-100 dark:border-gray-800/80 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_REPLIES.map(({ label, prompt }) => (
              <button
                key={label}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="shrink-0 px-3 py-1 bg-gray-100 dark:bg-[#20243d] hover:bg-[#0F4C81]/10 dark:hover:bg-[#2a3052] text-[#0F4C81] dark:text-sky-300 text-[11px] font-medium rounded-full border border-gray-200 dark:border-gray-700/60 hover:border-[#0F4C81]/30 transition-colors disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-[#17192b] border-t border-gray-200/80 dark:border-gray-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 bg-gray-100 dark:bg-[#20243d] rounded-2xl px-3 py-1.5 border border-gray-200/60 dark:border-gray-700/50 focus-within:border-[#0F4C81] dark:focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-[#0F4C81]/15 transition-all"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? "Waiting for Kona..." : "Ask Kona anything about PGs, rent..."}
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none py-1.5 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer branding */}
          <div className="mt-1.5 text-center">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              Powered by ApnaKona AI • Safe & Verified Student Living
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

