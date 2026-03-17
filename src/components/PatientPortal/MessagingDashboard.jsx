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
  Trash2,
  Eraser,
  Info,
  PhoneOff,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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

/* ===================== Helpers ===================== */
const API_BASE = import.meta.env.VITE_API_URL;
const WS_BASE  = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL;

// FIX 1: safeNumber — treat empty/null/undefined as null, allow 0
function safeNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// FIX 2: formatMessageTime — handle Java LocalDateTime arrays [2026,3,14,7,46,8,...]
function formatMessageTime(timestamp) {
  if (!timestamp) return "";

  let date;
  if (Array.isArray(timestamp)) {
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
  if (diff < 604800000) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// FIX 3: getUserId — try localStorage keys, then decode JWT sub field
function getUserIdFromStorage() {
  const raw =
    localStorage.getItem("userId") ||
    localStorage.getItem("id") ||
    localStorage.getItem("user_id") ||
    null;
  if (raw !== null && raw !== "") return safeNumber(raw);

  // Fall back to JWT decode — sub field is the numeric user ID
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return safeNumber(decoded.sub);
  } catch {
    return null;
  }
}

function getOtherUser(conv, userRole) {
  return userRole === "PATIENT" ? conv?.doctor : conv?.patient;
}

/* ===================== Search Users Modal ===================== */
const SearchUsersModal = ({ isOpen, onClose, userRole, token, onChatStart }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  const loadInitialList = async () => {
    setIsSearching(true);
    try {
      const endpoint = userRole === "PATIENT" ? "/api/chat/doctors" : "/api/chat/patients";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) { setSearchResults([]); return; }
      const data = await response.json();
      setSearchResults(
        (Array.isArray(data) ? data : []).map((u) => ({
          id: u.id,
          name: u.name,
          role: userRole === "PATIENT" ? (u.position || "Doctor") : "Patient",
          avatar: u.avatar || null,
          hospital: u.hospital,
          doctorRegNo: u.doctorRegNo,
        }))
      );
    } catch (err) {
      console.error("Error loading list:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) { loadInitialList(); return; }
    setIsSearching(true);
    try {
      const endpoint =
        userRole === "PATIENT"
          ? `/api/chat/doctors/search?query=${encodeURIComponent(query)}`
          : `/api/chat/patients/search?query=${encodeURIComponent(query)}`;
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) { setSearchResults([]); return; }
      const data = await response.json();
      setSearchResults(
        (Array.isArray(data) ? data : []).map((u) => ({
          id: u.id,
          name: u.name,
          role: userRole === "PATIENT" ? (u.position || "Doctor") : "Patient",
          avatar: u.avatar || null,
          hospital: u.hospital,
          doctorRegNo: u.doctorRegNo,
        }))
      );
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadInitialList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(q), 300);
  };

  const handleStartChat = async (user) => {
    try {
      const endpoint =
        userRole === "PATIENT"
          ? `${API_BASE}/api/chat/conversations/start?doctorId=${user.id}`
          : `${API_BASE}/api/chat/conversations/start?patientId=${user.id}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) { alert("Failed to start conversation."); return; }
      onChatStart(await response.json());
      onClose();
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("Error starting conversation.");
    }
  };

  if (!isOpen) return null;

  const title = userRole === "PATIENT" ? "Doctors" : "Patients";
  const placeholder = userRole === "PATIENT" ? "doctors" : "patients";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Search {title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${placeholder}...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "User")}`}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{u.name}</h3>
                      <p className="text-sm text-gray-500">{u.role}</p>
                      {u.hospital && <p className="text-xs text-gray-400">{u.hospital}</p>}
                      {u.doctorRegNo && <p className="text-xs text-gray-400">ID: {u.doctorRegNo}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartChat(u)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Chat
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No {placeholder} found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== Main Dashboard ===================== */
const MessagingDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [localFiles, setLocalFiles] = useState([]);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [callState, setCallState] = useState({
    open: false, mode: null, callType: null, fromName: "", fromUserId: null, toUserId: null,
  });

  const stompRef = useRef(null);
  const callSubRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const selectedChatRef = useRef(null);

  const token    = localStorage.getItem("token");
  // FIX: use JWT-aware userId lookup
  const userId   = getUserIdFromStorage();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "PATIENT";

  const onEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (!token) return;
    loadConversations();
    connectWebSocket();
    return () => {
      try {
        if (callSubRef.current) { callSubRef.current.unsubscribe(); callSubRef.current = null; }
        stompRef.current?.deactivate?.();
      } catch (e) { console.error("Deactivate error:", e); }
      finally { stompRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, localFiles]);
  useEffect(() => {
    return () => { localFiles.forEach((x) => x.previewUrl && URL.revokeObjectURL(x.previewUrl)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const onDocClick = () => setShowMenu(false);
    if (showMenu) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showMenu]);

  const connectWebSocket = () => {
    try {
      if (stompRef.current?.active) return;
      const sock = new SockJS(`${WS_BASE}/ws`);
      const stomp = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        debug: (str) => console.log("STOMP:", str),
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
                return [...prev, formatMessage(data)];
              });
            }
            loadConversations();
          } catch (err) { console.error("Message parse error:", err); }
        });
        const current = selectedChatRef.current;
        if (current?.id) subscribeToCallTopic(stomp, current.id);
      };
      stomp.onStompError = () => { setIsConnected(false); setError("WebSocket error"); };
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
    } catch (err) {
      console.error("WebSocket connection error:", err);
      setIsConnected(false);
      setError("Failed to establish WebSocket connection");
    }
  };

  const subscribeToCallTopic = (stomp, conversationId) => {
    try {
      if (!stomp?.connected || !conversationId) return;
      if (callSubRef.current) { callSubRef.current.unsubscribe(); callSubRef.current = null; }
      callSubRef.current = stomp.subscribe(`/topic/call/${conversationId}`, (msg) => {
        try {
          const signal = JSON.parse(msg.body);
          if (signal?.fromUserId === userId) return;
          handleCallSignal(signal);
        } catch (e) { console.error("Call signal parse error:", e); }
      });
    } catch (e) { console.error("subscribeToCallTopic error:", e); }
  };

  const sendCallSignal = (type, callType, payload = null) => {
    const stomp = stompRef.current?.ws;
    const current = selectedChatRef.current;
    if (!stomp?.connected || !current?.id) return;
    stomp.publish({
      destination: "/app/call.signal",
      body: JSON.stringify({ conversationId: current.id, fromUserId: userId, toUserId: current.participantId, type, callType, payload }),
    });
  };

  const handleCallSignal = (signal) => {
    if (!signal?.type) return;
    if (signal.type === "OFFER") {
      setCallState({ open: true, mode: "INCOMING", callType: signal.callType || "AUDIO", fromName: selectedChatRef.current?.name || "User", fromUserId: signal.fromUserId, toUserId: signal.toUserId });
    } else if (signal.type === "ANSWER") {
      if (signal.payload?.accepted) {
        setCallState((prev) => ({ ...prev, open: true, mode: "ACTIVE" }));
      } else {
        setCallState({ open: false, mode: null, callType: null, fromName: "", fromUserId: null, toUserId: null });
        alert("Call rejected ❌");
      }
    } else if (signal.type === "HANGUP") {
      setCallState({ open: false, mode: null, callType: null, fromName: "", fromUserId: null, toUserId: null });
      alert("Call ended");
    }
  };

  const startOutgoingCall = (callType) => {
    const current = selectedChatRef.current;
    if (!current?.id) return;
    setCallState({ open: true, mode: "OUTGOING", callType, fromName: current.name || "User", fromUserId: userId, toUserId: current.participantId });
    sendCallSignal("OFFER", callType, { ringing: true });
  };

  const acceptCall  = () => { sendCallSignal("ANSWER", callState.callType, { accepted: true }); setCallState((p) => ({ ...p, mode: "ACTIVE" })); };
  const rejectCall  = () => { sendCallSignal("ANSWER", callState.callType, { accepted: false }); setCallState({ open: false, mode: null, callType: null, fromName: "", fromUserId: null, toUserId: null }); };
  const hangupCall  = () => { sendCallSignal("HANGUP", callState.callType, { ended: true }); setCallState({ open: false, mode: null, callType: null, fromName: "", fromUserId: null, toUserId: null }); };

  const formatMessage = (msg) => {
    const isSelf = Number(msg.senderId) === Number(userId);
    console.log("[MSG]", "senderId:", msg.senderId, "userId:", userId, "isSelf:", isSelf);
    return {
      id: msg.id,
      sender: isSelf ? "self" : "other",
      text: msg.content,
      time: formatMessageTime(msg.timestamp),
      read: msg.read,
      attachments: msg.attachments || [],
      type: msg.type || "TEXT",
    };
  };

  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) return;
      const data = await response.json();
      setChats(
        (Array.isArray(data) ? data : []).map((conv) => {
          const other = getOtherUser(conv, userRole);
          return {
            id: conv.id,
            name: other?.name || "Unknown",
            role: other?.role || (userRole === "PATIENT" ? "DOCTOR" : "PATIENT"),
            avatar: other?.avatar || null,
            lastMessage: conv.lastMessage || "No messages yet",
            timestamp: formatMessageTime(conv.timestamp),
            unread: conv.unreadCount || 0,
            online: other?.online || false,
            participantId: other?.id || null,
            otherRaw: other || null,
          };
        })
      );
    } catch (err) { console.error("Error loading conversations:", err); setError("Failed to load conversations"); }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) return;
      const data = await response.json();
      setMessages((Array.isArray(data) ? data : []).map(formatMessage));
      markAsRead(conversationId);
    } catch (err) { console.error("Error loading messages:", err); }
  };

  const markAsRead = async (conversationId) => {
    try {
      await fetch(`${API_BASE}/api/chat/conversations/${conversationId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    } catch (err) { console.error("Error marking as read:", err); }
  };

  const handleAttachment = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const withPreview = files.map((file) => ({ file, previewUrl: file.type?.startsWith("image/") ? URL.createObjectURL(file) : null }));
    setLocalFiles((prev) => [...prev, ...withPreview]);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res = await fetch(`${API_BASE}/api/chat/attachments/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      if (!res.ok) throw new Error(await res.text());
      const metas = await res.json();
      setUploadedAttachments((prev) => [...prev, ...(Array.isArray(metas) ? metas : [])]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed");
      setLocalFiles((prev) => prev.slice(0, prev.length - files.length));
    } finally { e.target.value = ""; }
  };

  const removeAttachment = (index) => {
    setLocalFiles((prev) => { const next = [...prev]; const removed = next.splice(index, 1)[0]; if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl); return next; });
    setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!selectedChat || !stompRef.current) return;
    if (!messageText.trim() && uploadedAttachments.length === 0) return;
    // FIX: explicit null check so userId=0 is valid
    if (userId === null || !selectedChat.participantId) return;

    const hasFiles = uploadedAttachments.length > 0;
    const firstType = uploadedAttachments[0]?.contentType || "";
    const msgType = hasFiles ? (firstType.startsWith("image/") ? "IMAGE" : "FILE") : "TEXT";

    const message = {
      conversationId: selectedChat.id,
      senderId: userId,
      senderName: userName,
      receiverId: selectedChat.participantId,
      content: messageText,
      attachments: uploadedAttachments,
      type: msgType,
      timestamp: new Date().toISOString(),
    };

    try {
      stompRef.current.send(message);
      setMessages((prev) => [...prev, { id: Date.now(), sender: "self", text: messageText, time: "Just now", read: false, attachments: uploadedAttachments, type: msgType }]);
      setMessageText("");
      setUploadedAttachments([]);
      setLocalFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    selectedChatRef.current = chat;
    loadMessages(chat.id);
    const stomp = stompRef.current?.ws;
    if (stomp?.connected) subscribeToCallTopic(stomp, chat.id);
  };

  const handleChatStart = (conversation) => {
    const other = getOtherUser(conversation, userRole);
    const newChat = {
      id: conversation.id,
      name: other?.name || "Unknown",
      role: other?.role || (userRole === "PATIENT" ? "DOCTOR" : "PATIENT"),
      avatar: other?.avatar || null,
      lastMessage: conversation.lastMessage || "No messages yet",
      timestamp: formatMessageTime(conversation.timestamp),
      unread: 0,
      online: other?.online || false,
      participantId: other?.id || null,
      otherRaw: other || null,
    };
    setSelectedChat(newChat);
    selectedChatRef.current = newChat;
    loadConversations();
    loadMessages(conversation.id);
    const stomp = stompRef.current?.ws;
    if (stomp?.connected) subscribeToCallTopic(stomp, conversation.id);
  };

  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.role || "").toLowerCase().includes(q);
  });

  const clearChatLocal = () => { if (!selectedChat) return; if (!window.confirm("Clear messages in this chat (UI only)?")) return; setMessages([]); setShowMenu(false); };
  const deleteConversationLocal = () => { if (!selectedChat) return; if (!window.confirm("Remove this conversation from UI?")) return; setChats((prev) => prev.filter((c) => c.id !== selectedChat.id)); setSelectedChat(null); setMessages([]); setShowMenu(false); };

  const ChatListItem = ({ chat }) => (
    <div onClick={() => selectChat(chat)} className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${selectedChat?.id === chat.id ? "bg-blue-50 border-l-blue-600" : "hover:bg-gray-50 border-l-transparent"}`}>
      <div className="relative flex-shrink-0">
        <img src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || "User")}`} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{chat.name || "Unknown"}</h3>
            <p className="text-xs text-gray-500">{chat.role || "User"}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">{chat.unread}</span>}
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
            {!!message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
            {message.attachments?.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {message.attachments.map((att, i) => {
                  const isImg = att?.contentType?.startsWith("image/");
                  return (
                    <div key={i}>
                      {isImg
                        ? <img src={att.url} alt={att.fileName || "image"} className="max-w-[240px] rounded-lg border" />
                        : <a href={att.url} target="_blank" rel="noreferrer" className={`text-xs underline ${isOwn ? "text-white" : "text-blue-600"}`}>{att.fileName || "Download file"}</a>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-500">{message.time}</span>
            {isOwn && <span className="text-blue-600">{message.read ? <CheckCheck size={14} /> : <Check size={14} />}</span>}
          </div>
        </div>
      </div>
    );
  };

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

  return (
    <ErrorBoundary>
      {/* CALL MODAL */}
      {callState.open && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{callState.mode === "INCOMING" ? "Incoming call" : callState.mode === "OUTGOING" ? "Calling" : "In call"}</p>
                <h3 className="text-xl font-bold text-gray-900">{selectedChat?.name || callState.fromName || "User"} <span className="text-sm font-medium text-gray-500">({callState.callType})</span></h3>
              </div>
              <button onClick={hangupCall} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              {callState.mode === "INCOMING" && (<><button onClick={acceptCall} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Accept</button><button onClick={rejectCall} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button></>)}
              {callState.mode === "OUTGOING" && <button onClick={hangupCall} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><PhoneOff size={18} /> Cancel</button>}
              {callState.mode === "ACTIVE"   && <button onClick={hangupCall} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><PhoneOff size={18} /> Hang up</button>}
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">(Signaling UI — WebRTC streaming next step)</p>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfile && selectedChat && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Profile</h3>
              <button onClick={() => setShowProfile(false)} className="p-2 rounded-full hover:bg-gray-100"><X /></button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img src={selectedChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name || "User")}`} alt={selectedChat.name} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                <p className="text-sm text-gray-600">{selectedChat.role}</p>
                <p className="text-xs text-gray-500">User ID: {selectedChat.participantId ?? "N/A"}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowProfile(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <SearchUsersModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} userRole={userRole} token={token} onChatStart={handleChatStart} />

        {error && (
          <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold text-lg">×</button>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={() => setShowSearchModal(true)} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" title={userRole === "PATIENT" ? "Find a doctor" : "Find a patient"}>
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
                <button onClick={() => setShowSearchModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start a conversation</button>
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
                  <div className="relative">
                    <img src={selectedChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name || "User")}`} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
                    {selectedChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChat.online ? "Online" : "Offline"} • {selectedChat.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="Audio call" onClick={() => startOutgoingCall("AUDIO")} disabled={!isConnected}><Phone size={20} className="text-gray-600" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="Video call" onClick={() => startOutgoingCall("VIDEO")} disabled={!isConnected}><Video size={20} className="text-gray-600" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-full" title="More" onClick={(e) => { e.stopPropagation(); setShowMenu((s) => !s); }}><MoreVertical size={20} className="text-gray-600" /></button>
                  {showMenu && (
                    <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50" onClick={(e) => e.stopPropagation()}>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm" onClick={() => { setShowProfile(true); setShowMenu(false); }}><Info size={16} /> View profile</button>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm" onClick={clearChatLocal}><Eraser size={16} /> Clear chat (UI)</button>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600" onClick={deleteConversationLocal}><Trash2 size={16} /> Remove conversation (UI)</button>
                    </div>
                  )}
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
                  <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer flex-shrink-0">
                    <Paperclip size={20} className="text-gray-600" />
                    <input type="file" multiple className="hidden" onChange={handleAttachment} />
                  </label>
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => { setMessageText(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none overflow-auto"
                      style={{ maxHeight: "120px" }}
                    />
                    <div className="relative">
                      <button type="button" onClick={() => setShowEmoji((s) => !s)} className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <Smile size={20} className="text-gray-600" />
                      </button>
                      {showEmoji && <div className="absolute right-0 bottom-14 z-50"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() && uploadedAttachments.length === 0}
                    className={`p-3 rounded-full transition-colors flex-shrink-0 ${messageText.trim() || uploadedAttachments.length ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >
                    <Send size={20} />
                  </button>
                </div>
                {localFiles.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {localFiles.map((item, i) => (
                      <div key={i} className="bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-2 text-xs">
                        {item.previewUrl ? <img src={item.previewUrl} alt="preview" className="w-10 h-10 object-cover rounded" /> : <span className="max-w-[140px] truncate">{item.file.name}</span>}
                        <X size={14} className="cursor-pointer" onClick={() => removeAttachment(i)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chat Selected</h3>
                <p className="text-gray-600 max-w-sm mb-4">Select a conversation from the left or start a new chat</p>
                <button onClick={() => setShowSearchModal(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {userRole === "PATIENT" ? "Find a Doctor" : "Find a Patient"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MessagingDashboard;