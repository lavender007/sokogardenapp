import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerHome.css';

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

const MOODS = [
  { emoji: '??', label: 'Low', value: 1 },
  { emoji: '??', label: 'Okay', value: 2 },
  { emoji: '??', label: 'Good', value: 3 },
  { emoji: '??', label: 'Great', value: 4 },
  { emoji: '?', label: 'Wonderful', value: 5 },
];

const AFFIRMATIONS = [
  "You are worthy of care and healing.",
  "It takes courage to seek help. You're doing great.",
  "Every step forward, no matter how small, matters.",
  "Your feelings are valid. You're not alone.",
  "Healing isn't linear � and that's perfectly okay.",
];

export default function CustomerHome() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(null);
  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    apiGet('/api/my-therapist')
      .then(data => setAssignment(data.assignment))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMatchAgain = async () => {
    setLoading(true);
    try {
      await apiPost('/api/match', {});
      const data = await apiGet('/api/my-therapist');
      setAssignment(data.assignment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-home">
      <div className="home-greeting-section fade-in">
        <div className="home-greeting">{greeting},</div>
        <h1 className="home-name">{user?.name?.split(' ')[0]} ??</h1>
        <p className="home-affirmation">"{affirmation}"</p>
      </div>

      <div className="card mood-card fade-in fade-in-delay-1">
        <div className="mood-label">How are you feeling today?</div>
        <div className="mood-options">
          {MOODS.map(m => (
            <button
              key={m.value}
              className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
              onClick={() => setMood(m.value)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-text">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <p className="mood-response">
            {mood >= 4 ? "That's wonderful to hear. ?? Keep going!" :
             mood === 3 ? "Glad you're doing alright. Your therapist is here if you need to talk." :
             "It's okay to not be okay. Reach out to your therapist whenever you're ready."}
          </p>
        )}
      </div>

      <div className="fade-in fade-in-delay-2">
        {loading ? (
          <div className="card therapist-card loading-card">
            <div className="spinner" />
          </div>
        ) : assignment ? (
          <div className="card therapist-card">
            <div className="therapist-card-header">
              <div className="therapist-avatar-wrap">
                <div className="avatar therapist-avatar">
                  {assignment.therapist_name[0]}
                </div>
                <div className="online-indicator" />
              </div>
              <div className="therapist-info">
                <div className="therapist-card-name">{assignment.therapist_name}</div>
                <div className="therapist-card-specialty">{assignment.category} Specialist</div>
                <div className="therapist-rating">? 4.8 � Licensed Therapist</div>
              </div>
            </div>

            {assignment.therapist_profile?.bio && (
              <p className="therapist-bio">"{assignment.therapist_profile.bio}"</p>
            )}

            <div className="therapist-specialties">
              {assignment.therapist_profile?.specialties?.map(s => (
                <span className="pill" key={s}>{s}</span>
              ))}
            </div>

            <button
              className="btn-primary start-chat-btn"
              onClick={() => navigate(`/chat/${assignment.therapist_id}`)}
            >
              ?? Start session
            </button>
          </div>
        ) : (
          <div className="card therapist-card no-therapist">
            <div className="no-therapist-icon">??</div>
            <h3>No therapist assigned yet</h3>
            <p>Complete your profile to get matched.</p>
            <button className="btn-primary" onClick={handleMatchAgain}>
              Find therapist
            </button>
          </div>
        )}
      </div>

      <div className="card tips-card fade-in fade-in-delay-3">
        <div className="tips-title">?? Daily wellness tip</div>
        <p className="tips-text">
          Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. It activates your body's natural calm response.
        </p>
      </div>
    </div>
  );
}
