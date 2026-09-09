"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ChevronDown } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  "How do I find a PG?",
  "What are your charges?",
  "How to contact an owner?",
  "Is ApnaKona free?",
];

function now() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load messages from localStorage on initial render
    const saved = localStorage.getItem("kona_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        // Fallback to default
        setMessages([{ id: "0", role: "bot", text: "Hi! I'm Kona 👋 Your ApnaKona assistant. How can I help you find your perfect room?", time: now() }]);
      }
    } else {
      setMessages([{ id: "0", role: "bot", text: "Hi! I'm Kona 👋 Your ApnaKona assistant. How can I help you find your perfect room?", time: now() }]);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever messages change
    if (messages.length > 0) {
      localStorage.setItem("kona_chat_history", JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Gemini requires the history to start with a 'user' message
      // We'll slice off the initial bot greeting
      let filteredMessages = newMessages;
      if (filteredMessages.length > 0 && filteredMessages[0].role === "bot") {
        filteredMessages = filteredMessages.slice(1);
      }

      const apiMessages = filteredMessages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      
      if (data.error) {
         setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: "Oops, I'm having trouble connecting right now. Make sure the API key is configured! 🛠️", time: now() }]);
      } else {
         setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: data.reply, time: now() }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: "Sorry, I couldn't process that. Please try again later.", time: now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chatbot"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open ? "bg-gray-700 rotate-90" : "bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] hover:scale-110"
        }`}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B35] rounded-full border-2 border-white pulse-dot" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ height: 500 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6db5] px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Kona Assistant</p>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Online
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0F4C81] text-white rounded-br-sm"
                    : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm prose prose-sm max-w-none"
                }`}
              >
                {msg.role === "bot" ? (
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                   msg.text
                )}
                <p className={`text-xs mt-1 text-right ${msg.role === "user" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          
          {loading && (
             <div className="flex justify-start">
              <div className="bg-white text-gray-700 shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
             </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-white border-t border-gray-100">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="shrink-0 px-3 py-1.5 bg-[#0F4C81]/8 text-[#0F4C81] text-xs rounded-full hover:bg-[#0F4C81] hover:text-white transition-colors border border-[#0F4C81]/20 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage(input)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-200 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            className="w-9 h-9 bg-[#FF6B35] rounded-full flex items-center justify-center hover:bg-[#e85a22] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
