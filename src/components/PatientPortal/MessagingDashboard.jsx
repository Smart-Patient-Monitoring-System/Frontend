import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Search, Phone, Video, MoreVertical, User, Clock, Check, CheckCheck, Image, File, Smile, X } from "lucide-react";

const MessagingDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  // Sample chat data
  const chats = [
    {
      id: 1,
      name: "Dr. Emily Chen",
      role: "Cardiologist",
      avatar: "https://i.pravatar.cc/150?img=45",
      lastMessage: "Your test results look good. Let's schedule a follow-up.",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: "doctor", text: "Hello Sarah! I've reviewed your latest ECG results.", time: "9:45 AM", read: true },
        { id: 2, sender: "patient", text: "Hi Dr. Chen! How do they look?", time: "9:50 AM", read: true },
        { id: 3, sender: "doctor", text: "Everything looks normal. Your heart rate is stable and within healthy range.", time: "10:15 AM", read: true },
        { id: 4, sender: "doctor", text: "Your test results look good. Let's schedule a follow-up.", time: "10:30 AM", read: false }
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Torres",
      role: "General Physician",
      avatar: "https://i.pravatar.cc/150?img=33",
      lastMessage: "Please take the medication twice daily with meals.",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "patient", text: "Doctor, I've been experiencing some headaches.", time: "Yesterday, 2:30 PM", read: true },
        { id: 2, sender: "doctor", text: "How often are you getting these headaches?", time: "Yesterday, 2:45 PM", read: true },
        { id: 3, sender: "patient", text: "About 2-3 times a week, usually in the afternoon.", time: "Yesterday, 3:00 PM", read: true },
        { id: 4, sender: "doctor", text: "I'm prescribing you some medication. Please take the medication twice daily with meals.", time: "Yesterday, 3:15 PM", read: true }
      ]
    },
    {
      id: 3,
      name: "Nurse Jennifer Smith",
      role: "Care Coordinator",
      avatar: "https://i.pravatar.cc/150?img=38",
      lastMessage: "Your appointment is confirmed for next Monday at 10 AM.",
      timestamp: "Dec 1",
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: "nurse", text: "Hi Sarah! Just confirming your upcoming appointment.", time: "Dec 1, 11:00 AM", read: true },
        { id: 2, sender: "patient", text: "Yes, I'll be there!", time: "Dec 1, 11:15 AM", read: true },
        { id: 3, sender: "nurse", text: "Your appointment is confirmed for next Monday at 10 AM.", time: "Dec 1, 11:20 AM", read: true }
      ]
    },
    {
      id: 4,
      name: "Dr. Sarah Williams",
      role: "Endocrinologist",
      avatar: "https://i.pravatar.cc/150?img=47",
      lastMessage: "Remember to check your blood sugar levels daily.",
      timestamp: "Nov 28",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "doctor", text: "Hi Sarah, how have your glucose levels been?", time: "Nov 28, 9:00 AM", read: true },
        { id: 2, sender: "patient", text: "They've been mostly stable, between 90-120.", time: "Nov 28, 9:30 AM", read: true },
        { id: 3, sender: "doctor", text: "That's excellent! Keep up the good work.", time: "Nov 28, 10:00 AM", read: true },
        { id: 4, sender: "doctor", text: "Remember to check your blood sugar levels daily.", time: "Nov 28, 10:05 AM", read: true }
      ]
    },
    {
      id: 5,
      name: "Pharmacy - MedCare",
      role: "Prescription Updates",
      avatar: "https://i.pravatar.cc/150?img=60",
      lastMessage: "Your prescription is ready for pickup.",
      timestamp: "Nov 25",
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: "pharmacy", text: "Your prescription has been processed.", time: "Nov 25, 3:00 PM", read: true },
        { id: 2, sender: "pharmacy", text: "Your prescription is ready for pickup.", time: "Nov 25, 4:00 PM", read: true }
      ]
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        sender: "patient",
        text: messageText,
        time: "Just now",
        read: true
      };
      
      // Update the chat with new message
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        lastMessage: messageText,
        timestamp: "Just now"
      };
      
      setSelectedChat(updatedChat);
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ChatListItem = ({ chat }) => (
    <div
      onClick={() => setSelectedChat(chat)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${
        selectedChat?.id === chat.id
          ? "bg-blue-50 border-l-blue-600"
          : "hover:bg-gray-50 border-l-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
            <p className="text-xs text-gray-500">{chat.role}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => {
    const isPatient = message.sender === "patient";
    
    return (
      <div className={`flex ${isPatient ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] ${isPatient ? "order-2" : "order-1"}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isPatient
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isPatient ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-500">{message.time}</span>
            {isPatient && (
              <span className="text-blue-600">
                {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <ChatListItem key={chat.id} chat={chat} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <User size={48} className="mb-4 text-gray-300" />
              <p className="text-center">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.online ? "Online" : "Offline"} • {selectedChat.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4">
                {selectedChat.messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ maxHeight: '120px' }}
                  />
                  <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile size={20} className="text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                    messageText.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors">
                  Request Prescription
                </button>
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors">
                  Book Appointment
                </button>
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors">
                  Share Test Results
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={48} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chat Selected</h3>
              <p className="text-gray-600 max-w-sm">
                Select a conversation from the left to start messaging with your healthcare providers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingDashboard;