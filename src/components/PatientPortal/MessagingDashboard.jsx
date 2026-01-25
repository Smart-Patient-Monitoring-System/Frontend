import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Search, Phone, Video, MoreVertical, User, Smile, Check, CheckCheck, X, UserPlus } from "lucide-react";
import { Client } from '@stomp/stompjs';

const SearchUsersModal = ({ isOpen, onClose, userRole, token, onChatStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      loadAllDoctors();
      return;
    }

    setIsSearching(true);
    try {
      const endpoint = userRole === 'PATIENT' 
        ? `/api/chat/doctors/search?query=${encodeURIComponent(query)}`
        : `/api/chat/patients/search?query=${encodeURIComponent(query)}`;

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          role: doctor.position || 'Doctor',
          avatar: doctor.profilePicture || null,
          hospital: doctor.hospital,
          doctorRegNo: doctor.doctorRegNo
        })));
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadAllDoctors = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:8080/api/chat/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          role: doctor.position || 'Doctor',
          avatar: doctor.profilePicture || null,
          hospital: doctor.hospital,
          doctorRegNo: doctor.doctorRegNo
        })));
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllDoctors();
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setTimeout(() => searchUsers(query), 300);
  };

  const handleStartChat = async (user) => {
    try {
      //  FIX: Get patientId from localStorage
      const patientId = localStorage.getItem('patientId');
      
      const endpoint = userRole === 'PATIENT'
        ? `http://localhost:8080/api/chat/conversations/start?patientId=${patientId}&doctorId=${user.id}`
        : `http://localhost:8080/api/chat/conversations/start?patientId=${user.id}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const conversation = await response.json();
        onChatStart(conversation);
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Failed to create conversation:', response.status, errorText);
        alert('Failed to start conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Error starting conversation. Please check your connection.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {/* ✅ FIX: Show "Search Doctors" for patients */}
            Search {userRole === 'PATIENT' ? 'Doctors' : 'Patients'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${userRole === 'PATIENT' ? 'doctors' : 'patients'} by name or ID...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.role}</p>
                      {user.hospital && <p className="text-xs text-gray-400">{user.hospital}</p>}
                      {user.doctorRegNo && <p className="text-xs text-gray-400">ID: {user.doctorRegNo}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartChat(user)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Start Chat</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No {userRole === 'PATIENT' ? 'doctors' : 'patients'} found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MessagingDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  //  FIX: Get correct IDs from localStorage
  const token = localStorage.getItem('token');
  const patientId = localStorage.getItem('patientId');
  const patientName = localStorage.getItem('patientName');
  const userRole = 'PATIENT'; // Hardcode for patient portal

  useEffect(() => {
    if (token && patientId) {
      setCurrentUser({ id: parseInt(patientId), name: patientName, role: userRole });
      loadConversations();
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [token, patientId]);

  const connectWebSocket = () => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);

      client.subscribe(`/user/${patientId}/queue/messages`, (message) => {
        try {
          const newMessage = JSON.parse(message.body);
          console.log('Received message:', newMessage);
          
          if (selectedChat && newMessage.conversationId === selectedChat.id) {
            setMessages(prev => {
              if (prev.find(m => m.id === newMessage.id)) {
                return prev;
              }
              return [...prev, formatMessage(newMessage)];
            });
          }
          
          loadConversations();
        } catch (error) {
          console.error('Error processing received message:', error);
        }
      });

      client.subscribe(`/user/${patientId}/queue/typing`, (message) => {
        const typingUserId = JSON.parse(message.body);
        console.log(`User ${typingUserId} is typing...`);
      });

      client.subscribe(`/user/${patientId}/queue/read-receipt`, (message) => {
        console.log('Messages read');
        loadConversations();
      });

      client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({
          senderId: parseInt(patientId),
          senderName: patientName,
          type: 'JOIN'
        })
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    client.activate();
    setStompClient(client);
  };

  const formatMessage = (msg) => ({
    id: msg.id,
    sender: msg.senderId === parseInt(patientId) ? 'self' : 'other',
    text: msg.content,
    time: formatMessageTime(msg.timestamp),
    read: msg.read,
    attachments: msg.attachments || []
  });

  const loadConversations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChats(data.map(conv => ({
          id: conv.id,
          name: conv.doctor?.name || 'Unknown Doctor',
          role: conv.doctor?.position || 'Doctor',
          avatar: conv.doctor?.avatar,
          lastMessage: conv.lastMessage || 'No messages yet',
          timestamp: formatMessageTime(conv.timestamp),
          unread: conv.unreadCount || 0,
          online: conv.online || false,
          participantId: conv.doctor?.id
        })));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.map(msg => formatMessage(msg)));
        markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await fetch(
        `http://localhost:8080/api/chat/conversations/${conversationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachments]);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if ((messageText.trim() || attachments.length) && selectedChat && stompClient && isConnected) {
      const message = {
        conversationId: selectedChat.id,
        senderId: parseInt(patientId),
        senderName: patientName,
        receiverId: selectedChat.participantId,
        content: messageText,
        attachments: attachments.map(f => f.name),
        type: 'TEXT'
      };
      
      try {
        stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(message)
        });
        console.log('Message sent:', message);
        
        setMessageText("");
        setAttachments([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please check your connection.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
  };

  const handleChatStart = (conversation) => {
    loadConversations();
    const newChat = {
      id: conversation.id,
      name: conversation.doctor?.name || 'Unknown Doctor',
      role: conversation.doctor?.position || 'Doctor',
      avatar: conversation.doctor?.avatar,
      lastMessage: conversation.lastMessage || 'No messages yet',
      timestamp: formatMessageTime(conversation.timestamp),
      unread: 0,
      online: false,
      participantId: conversation.doctor?.id
    };
    setSelectedChat(newChat);
    loadMessages(conversation.id);
  };

  const ChatListItem = ({ chat }) => (
    <div
      onClick={() => selectChat(chat)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-4 ${
        selectedChat?.id === chat.id
          ? "bg-blue-50 border-l-blue-600"
          : "hover:bg-gray-50 border-l-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || 'User')}`} 
          alt={chat.name} 
          className="w-12 h-12 rounded-full object-cover" 
        />
        {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{chat.name || 'Unknown'}</h3>
            <p className="text-xs text-gray-500">{chat.role || 'Doctor'}</p>
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
    const isOwn = message.sender === 'self';
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
          <div className={`rounded-2xl px-4 py-3 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.attachments.map((file, i) => (
                  <div key={i} className={`px-2 py-1 rounded-lg text-xs truncate max-w-[100px] ${isOwn ? "bg-blue-500" : "bg-gray-200"}`}>{file}</div>
                ))}
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <SearchUsersModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        userRole={userRole}
        token={token}
        onChatStart={handleChatStart}
      />
      <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Start new chat with doctor"
            >
              <UserPlus size={20} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? filteredChats.map(chat => <ChatListItem key={chat.id} chat={chat} />) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <User size={48} className="mb-4 text-gray-300" />
              <p className="text-center">No conversations found</p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start a conversation
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={selectedChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name)}`} 
                    alt={selectedChat.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                  {selectedChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChat.online ? "Online" : "Offline"} • {selectedChat.role}</p>
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

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4">
                {messages.map(message => <MessageBubble key={message.id} message={message} />)}
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
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-auto"
                    style={{ maxHeight: '120px' }}
                  />
                  <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile size={20} className="text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() && attachments.length === 0}
                  className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                    messageText.trim() || attachments.length
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {attachments.map((file, i) => (
                    <div key={i} className="bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                      {file.name}
                      <X size={14} className="cursor-pointer" onClick={() => removeAttachment(i)} />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-3 flex-wrap">
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
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={48} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chat Selected</h3>
              <p className="text-gray-600 max-w-sm mb-4">
                Select a conversation from the left or start a new chat with a doctor
              </p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Find a Doctor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingDashboard;