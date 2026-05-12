import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://mayakasamantha6.alwaysdata.net/';

const createAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseJson = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

const apiGet = async (path) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: createAuthHeaders(),
  });
  return parseJson(res);
};

const apiPost = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(body),
  });
  return parseJson(res);
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ChatPage() {
  const { userId: otherUserIdParam } = useParams();
  const user = getStoredUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUserId, setOtherUserId] = useState(otherUserIdParam ? parseInt(otherUserIdParam) : null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);
  const lastTimestampRef = useRef(new Date(0).toISOString());

  useEffect(() => {
    const init = async () => {
      try {
        let targetId = otherUserId;

        if (!targetId) {
          if (user?.role === 'customer') {
            const data = await apiGet('/api/my-therapist');
            if (!data.assignment) { navigate('/home'); return; }
            targetId = data.assignment.therapist_id;
            setOtherUserId(targetId);
          } else {
            navigate('/therapist');
            return;
          }
        }

        const msgData = await apiGet(`/api/messages/${user.id}/${targetId}`);
        setMessages(msgData.messages || []);
        if (msgData.messages?.length) {
          lastTimestampRef.current = msgData.messages[msgData.messages.length - 1].timestamp;
        }

        if (user.role === 'customer') {
          const td = await apiGet(`/api/therapists/${targetId}`).catch(() => null);
          if (td) setOtherUser({ name: td.therapist.name, role: 'therapist' });
        } else {
          setOtherUser({ name: 'Patient', role: 'customer', id: targetId });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [otherUserId, navigate, user]);

  useEffect(() => {
    if (!otherUserId || !user) return;

    const poll = async () => {
      try {
        const response = await apiGet(`/api/messages/${user.id}/${otherUserId}?since=${encodeURIComponent(lastTimestampRef.current)}`);
        const newMessages = response.messages || [];
        if (newMessages.length > 0) {
          setMessages(prev => {
            const combined = [...prev, ...newMessages];
            const unique = combined.filter((msg, index, self) => index === self.findIndex(m => m.id === msg.id));
            unique.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            return unique;
          });
          lastTimestampRef.current = newMessages[newMessages.length - 1].timestamp;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
    pollingRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollingRef.current);
  }, [otherUserId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !otherUserId) return;
    try {
      const result = await apiPost('/api/send_message', { receiver_id: otherUserId, message: input.trim() });
      setMessages(prev => [...prev, result.message]);
      setInput('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Send error:', err);
    }
  }, [input, otherUserId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="spinner" />
        <p>Loading your session...</p>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="chat-back-btn" onClick={() => navigate(-1)}>?</button>
        <div className="chat-header-avatar">
          {otherUser?.name?.[0] || '?'}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{otherUser?.name || 'Loading...'}</div>
          <div className="chat-header-status">
            <span className="status-dot" />
            Active now
          </div>
        </div>
        <div className="chat-header-icon">??</div>
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">??</div>
            <p>This is the beginning of your safe space.</p>
            <p className="chat-empty-sub">Share what's on your mind � your therapist is here to listen.</p>
          </div>
        )}

        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="date-divider"><span>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMine = msg.sender_id === user.id;
              return (
                <div key={msg.id || i} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                  {!isMine && <div className="msg-avatar">{msg.sender_name?.[0] || '?'}</div>}
                  <div className="message-bubble-wrap">
                    <div className={`message-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                      {msg.message}
                    </div>
                    <div className="message-time">{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Share what's on your mind..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
            <span>?</span>
          </button>
        </div>
        <div className="chat-input-hint">Press Enter to send � Shift+Enter for new line</div>
      </div>
    </div>
  );
}
