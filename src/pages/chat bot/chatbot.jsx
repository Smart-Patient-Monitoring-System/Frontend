import React, { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 I’m your smart assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex sm:items-center sm:justify-center">

      {/* Chat container */}
      <div
        className="
          w-full h-screen
          sm:h-[600px] sm:max-w-md
          bg-white/10 backdrop-blur-xl
          sm:rounded-3xl
          border border-white/20
          shadow-2xl
          flex flex-col
        "
      >

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-base sm:text-lg font-semibold tracking-wide">
            AI Health Assistant
          </h2>
          <p className="text-xs opacity-80">Secure • Smart • Real-time</p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 sm:p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs">
                  AI
                </div>
              )}

              <div
                className={`
                  px-4 py-2 rounded-2xl text-sm leading-relaxed shadow
                  max-w-[85%] sm:max-w-[75%]
                  ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white/90 text-gray-800 rounded-bl-md"
                  }
                `}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs">
                  You
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs">
                AI
              </div>
              <div className="bg-white/80 px-4 py-2 rounded-2xl text-sm text-gray-700 animate-pulse">
                Thinking…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask something…"
              className="
                flex-1 px-4 py-2 rounded-xl
                bg-white/90 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
            />
            <button
              onClick={sendMessage}
              className="
                px-4 sm:px-5 py-2 rounded-xl
                bg-gradient-to-r from-indigo-500 to-purple-600
                text-white text-sm font-medium
                hover:opacity-90 transition
              "
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chatbot;
