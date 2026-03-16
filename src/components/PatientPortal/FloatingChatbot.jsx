import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

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
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHATBOT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();
      
      const botMessage = {
        id: messages.length + 2,
        text: data.reply || "I received your message. How else can I assist you?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "⚠️ Something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSendMessage();

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
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-sm px-4 py-2 animate-pulse">
                  <p className="text-sm">Thinking...</p>
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
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
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