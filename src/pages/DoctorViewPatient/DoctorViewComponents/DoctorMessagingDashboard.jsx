import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Search,
  Phone,
  Video,
  MoreVertical,
  User,
  Smile,
  Check,
  CheckCheck,
  X,
  UserPlus,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/* ===================== Helpers ===================== */
const API_BASE = import.meta.env.VITE_API_URL;
const WS_BASE  = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL;

function safeNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * FIX: Backend returns timestamp as a LocalDateTime array [2026,3,14,7,46,8,...]
 * OR as an ISO string. Handle both to fix "Invalid Date".
 */
function formatMessageTime(timestamp) {
  if (!timestamp) return "";

  let date;
  if (Array.isArray(timestamp)) {
    // [year, month(1-based), day, hour, minute, second, nano]
    const [year, month, day, hour = 0, minute = 0, second = 0] = timestamp;
    date = new Date(year, month - 1, day, hour, minute, second);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diff < 604800000)
    return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getOtherUser(conv) {
  return conv?.patient || null;
}

/**
 * FIX: Try all possible localStorage key names for token.
 */
function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("doctorToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt") ||
    null
  );
}
/**
 * FIX: Doctor login only stores "token" and "user" — no userId.
 * Decode the JWT "sub" field which is the numeric user ID.
 */
function getStoredUserId() {
  const raw =
    localStorage.getItem("userId") ||
    localStorage.getItem("doctorId") ||
    localStorage.getItem("id") ||
    localStorage.getItem("user_id") ||
    null;
  if (raw !== null && raw !== "") return safeNumber(raw);

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("doctorToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");
    if (!token) return null;
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return safeNumber(decoded.sub);
  } catch {
    return null;
  }
}

function getStoredUserName() {
  return (
    localStorage.getItem("userName") ||
    localStorage.getItem("doctorName") ||
    localStorage.getItem("name") ||
    "Doctor"
  );
}

/* ===================== Error Boundary ===================== */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message || "Unknown error"}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ===================== Doctor: Select Patient Modal ===================== */
const DoctorSelectPatientModal = ({ isOpen, onClose, token, onChatStart }) => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const normalize = (data) =>
    (Array.isArray(data) ? data : []).map((p) => ({
      id: p.id,
      name: p.name,
      nicNo: p.nicNo,
      gender: p.gender,
      contactNo: p.contactNo,
    }));

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat/patients`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) { setPatients([]); return; }
      setPatients(normalize(await res.json()));
    } catch { setPatients([]); }
    finally { setLoading(false); }
  };

  const searchPatients = async (term) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/patients/search?query=${encodeURIComponent(term)}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) setPatients(normalize(await res.json()));
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isOpen) { setQuery(""); loadPatients(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      val.trim() ? searchPatients(val.trim()) : loadPatients();
    }, 300);
  };

  const handleStartChat = async (patient) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversations/start?patientId=${patient.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      if (!res.ok) { alert("Failed to start conversation."); return; }
      onChatStart(await res.json());
      onClose();
    } catch { alert("Error starting conversation."); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Find a Patient</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients by name or NIC..."
              value={query}
              onChange={handleQueryChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : patients.length > 0 ? (
            <div className="space-y-3">
              {patients.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "Patient")}`}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{u.name}</h3>
                      <p className="text-sm text-gray-500">Patient</p>
                      {u.nicNo && <p className="text-xs text-gray-400">NIC: {u.nicNo}</p>}
                      {u.gender && <p className="text-xs text-gray-400">{u.gender}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartChat(u)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Chat
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No patients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== Doctor Messaging Dashboard ===================== */
const DoctorMessagingDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSelectPatientModal, setShowSelectPatientModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const stompRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  // Ref so WebSocket callbacks always see the latest selectedChat
  const selectedChatRef = useRef(null);

  // FIX: use fallback helpers — doctor may store token/userId under different keys
  const token    = getStoredToken();
  const userId   = getStoredUserId();
  const userName = getStoredUserName();

  // One-time debug log
  useEffect(() => {
    console.log("🔍 Doctor localStorage keys:", Object.keys(localStorage));
    console.log("🔍 token:", !!token, "| userId:", userId, "| userName:", userName);
  }, []);

  const onEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }
    loadConversations();
    connectWebSocket();
    return () => {
      try { stompRef.current?.deactivate?.(); }
      catch (e) { console.error("Deactivate error:", e); }
      finally { stompRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Keep ref in sync
  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectWebSocket = () => {
    if (stompRef.current?.active) return;

    const stomp = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE}/ws`),
      reconnectDelay: 5000,
    });

    stomp.onConnect = () => {
      setIsConnected(true);
      setError(null);
      stomp.subscribe(`/user/queue/messages`, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          const current = selectedChatRef.current;
          if (current && data.conversationId === current.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, formatMsg(data)];
            });
          }
          loadConversations();
        } catch (err) { console.error("Message parse error:", err); }
      });
    };

    stomp.onStompError = () => setIsConnected(false);
    stomp.onWebSocketClose = () => setIsConnected(false);
    stomp.activate();

    stompRef.current = {
      active: true,
      ws: stomp,
      deactivate: () => stomp.deactivate(),
      send: (message) => {
        if (!stomp.connected) return;
        stomp.publish({ destination: "/app/chat.send", body: JSON.stringify(message) });
      },
    };
  };

  const formatMsg = (msg) => ({
    id: msg.id,
    sender: msg.senderId === userId ? "self" : "other",
    text: msg.content,
    time: formatMessageTime(msg.timestamp),
    read: msg.read,
    attachments: msg.attachments || [],
  });

  const loadConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) return;
      const data = await res.json();
      setChats(
        (Array.isArray(data) ? data : []).map((conv) => {
          const other = getOtherUser(conv);
          return {
            id: conv.id,
            name: other?.name || "Unknown Patient",
            role: "Patient",
            avatar: null,
            lastMessage: conv.lastMessage || "No messages yet",
            timestamp: formatMessageTime(conv.timestamp),
            unread: conv.unreadCount || 0,
            online: other?.online || false,
            participantId: other?.id || null,
          };
        })
      );
    } catch (err) { console.error("Error loading conversations:", err); }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setMessages((Array.isArray(data) ? data : []).map(formatMsg));
      fetch(`${API_BASE}/api/chat/conversations/${conversationId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }).catch(() => {});
    } catch (err) { console.error("Error loading messages:", err); }
  };

  const handleSendMessage = () => {
    if (!selectedChat || !stompRef.current) return;
    if (!messageText.trim()) return;

    // FIX: use explicit null check — userId 0 is valid
    if (userId === null) {
      console.error(
        "❌ userId is null. All localStorage:",
        Object.fromEntries(Object.entries(localStorage))
      );
      setError("Cannot send — session error. Please log out and log back in.");
      return;
    }

    if (!selectedChat.participantId) {
      console.error("❌ participantId is null on selectedChat:", selectedChat);
      return;
    }

    const message = {
      conversationId: selectedChat.id,
      senderId: userId,
      senderName: userName,
      receiverId: selectedChat.participantId,
      content: messageText,
      attachments: [],
      type: "TEXT",
      timestamp: new Date().toISOString(),
    };

    try {
      stompRef.current.send(message);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "self", text: messageText, time: "Just now", read: false, attachments: [] },
      ]);
      setMessageText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    selectedChatRef.current = chat;
    loadMessages(chat.id);
  };

  const handleChatStart = (conversation) => {
    const other = getOtherUser(conversation);
    const newChat = {
      id: conversation.id,
      name: other?.name || "Unknown Patient",
      role: "Patient",
      avatar: null,
      lastMessage: conversation.lastMessage || "No messages yet",
      timestamp: formatMessageTime(conversation.timestamp),
      unread: 0,
      online: other?.online || false,
      participantId: other?.id || null,
    };
    setSelectedChat(newChat);
    selectedChatRef.current = newChat;
    loadConversations();
    loadMessages(conversation.id);
  };

  const filteredChats = chats.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h3>
          <p className="text-gray-600">You need to be logged in to access messaging</p>
        </div>
      </div>
    );
  }

  const ChatListItem = ({ chat }) => (
    <div
      onClick={() => selectChat(chat)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${
        selectedChat?.id === chat.id ? "bg-blue-50 border-l-blue-600" : "hover:bg-gray-50 border-l-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || "Patient")}`}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">{chat.unread}</span>
          )}
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => {
    const isOwn = message.sender === "self";
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
          <div className={`rounded-2xl px-4 py-3 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-500">{message.time}</span>
            {isOwn && (
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
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <DoctorSelectPatientModal
          isOpen={showSelectPatientModal}
          onClose={() => setShowSelectPatientModal(false)}
          token={token}
          onChatStart={handleChatStart}
        />

        {error && (
          <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-sm flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold text-lg leading-none">×</button>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowSelectPatientModal(true)}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Find a patient to chat"
                type="button"
              >
                <UserPlus size={20} />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-orange-500"}`} />
              <span className="text-xs text-gray-600">{isConnected ? "Connected" : "Connecting..."}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <User size={48} className="mb-4 text-gray-300" />
                <p className="text-center">No conversations found</p>
                <button
                  onClick={() => setShowSelectPatientModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  type="button"
                >
                  Start a conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name || "Patient")}`}
                    alt={selectedChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? "Online" : "Offline"} • Patient
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full" type="button">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full" type="button">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full" type="button">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none overflow-auto"
                      style={{ maxHeight: "120px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmoji((s) => !s)}
                      className="absolute right-3 top-3 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Smile size={20} className="text-gray-600" />
                    </button>
                    {showEmoji && (
                      <div className="absolute right-0 bottom-14 z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                      messageText.trim()
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    type="button"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chat Selected</h3>
                <p className="text-gray-600 max-w-sm mb-4">
                  Select a conversation or start a new chat
                </p>
                <button
                  onClick={() => setShowSelectPatientModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  type="button"
                >
                  Find a Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DoctorMessagingDashboard;