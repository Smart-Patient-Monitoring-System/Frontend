import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const API_CHAT_URL = "http://localhost:8088/api/chat/chat";

/* ── Simple markdown-like formatter ── */
const formatBotText = (text) => {
  if (!text) return text;

  // Split by double newline for paragraphs
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((para, pi) => {
    // Handle bullet points  (lines starting with * or -)
    const lines = para.split("\n");
    const isBulletList = lines.every(
      (l) => l.trim().startsWith("* ") || l.trim().startsWith("- ") || l.trim() === ""
    );

    if (isBulletList && lines.some((l) => l.trim().startsWith("* ") || l.trim().startsWith("- "))) {
      return (
        <ul key={pi} className="list-disc list-inside space-y-1 my-1">
          {lines
            .filter((l) => l.trim())
            .map((l, li) => (
              <li key={li} className="text-sm leading-relaxed">
                {formatInline(l.replace(/^[\s]*[-*]\s*/, ""))}
              </li>
            ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={pi} className="text-sm leading-relaxed mb-1.5 last:mb-0">
        {formatInline(para.replace(/\n/g, " "))}
      </p>
    );
  });
};

/* Bold (**text**) and inline code (`code`) */
const formatInline = (text) => {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code `code`
    const codeMatch = remaining.match(/`(.+?)`/);

    let firstMatch = null;
    let type = null;

    if (boldMatch && (!codeMatch || boldMatch.index <= codeMatch.index)) {
      firstMatch = boldMatch;
      type = "bold";
    } else if (codeMatch) {
      firstMatch = codeMatch;
      type = "code";
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (firstMatch.index > 0) {
      parts.push(remaining.substring(0, firstMatch.index));
    }

    if (type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold">
          {firstMatch[1]}
        </strong>
      );
    } else if (type === "code") {
      parts.push(
        <code key={key++} className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded text-xs font-mono">
          {firstMatch[1]}
        </code>
      );
    }

    remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
  }

  return parts;
};

const FloatingChatbot = ({ isFullScreen = false, hideFloatingButton = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Health Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const sentText = inputMessage;
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHATBOT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sentText }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || "I received your message. How else can I assist you?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "⚠️ Could not reach the AI service. Make sure the chatbot backend is running on port 8083.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const shouldShowChat = isFullScreen || isOpen;

  const chatContainerClass = isFullScreen
    ? "w-full h-full min-h-[600px] bg-white rounded-xl shadow-lg flex flex-col"
    : `
        fixed bottom-24 right-4 sm:right-6
        w-[90%] sm:w-80 md:w-96
        h-[65vh] sm:h-[450px] md:h-[500px]
        bg-white rounded-2xl shadow-2xl flex flex-col z-50
      `;

  return (
    <>
      {shouldShowChat && (
        <div className={chatContainerClass}>
          {/* Header */}
          <div
            className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex items-center justify-between ${
              isFullScreen ? "rounded-t-xl" : "rounded-t-2xl"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">AI Health Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>

            {!isFullScreen && (
              <button
                onClick={toggleChat}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                  }`}
                >
                  {/* Render formatted text for bot, plain text for user */}
                  <div className="text-sm">
                    {message.sender === "bot"
                      ? formatBotText(message.text)
                      : message.text}
                  </div>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      message.sender === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`p-3 bg-white border-t ${
              isFullScreen ? "rounded-b-xl" : "rounded-b-2xl"
            }`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full p-2 sm:p-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      {!isFullScreen && !hideFloatingButton && (
        <button
          onClick={toggleChat}
          className="
            fixed bottom-6 right-4 sm:right-6
            w-12 h-12 sm:w-14 sm:h-14
            bg-gradient-to-r from-blue-500 to-cyan-500 text-white
            rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110
            flex items-center justify-center z-50
          "
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      )}
    </>
  );
};

export default FloatingChatbot;