import { useState } from "react";
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

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. A healthcare professional will assist you shortly.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSendMessage();

  const shouldShowChat = isFullScreen || isOpen;

  // Responsive container
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
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 transition"
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
