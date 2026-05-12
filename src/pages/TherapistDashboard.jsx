import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TherapistDashboard.css';

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

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export default function TherapistDashboard() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    Promise.all([
      apiGet('/api/therapist/patients'),
      apiGet(`/api/therapists/${user?.id}`).catch(() => null),
    ]).then(([pd, td]) => {
      setPatients(pd.patients || []);
      if (td) setProfile(td.therapist);
    }).finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="therapist-home">
      <div className="therapist-greeting fade-in">
        <div className="greeting-text">{greeting},</div>
        <h1 className="greeting-name">{user?.name} ??</h1>
        <div className="session-count-badge">
          {patients.length} active {patients.length === 1 ? 'session' : 'sessions'}
        </div>
      </div>

      {profile && (
        <div className="card therapist-profile-card fade-in fade-in-delay-1">
          <div className="profile-card-inner">
            <div className="avatar th-avatar">{user?.name[0]}</div>
            <div>
              <div className="th-name">{profile.name}</div>
              <div className="th-specialties">
                {profile.specialties?.slice(0, 3).map(s => (
                  <span className="pill" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          {profile.bio && <p className="th-bio">"{profile.bio}"</p>}
        </div>
      )}

      <div className="fade-in fade-in-delay-2">
        <div className="section-heading">Your sessions</div>

        {loading ? (
          <div className="patients-loading"><div className="spinner" /></div>
        ) : patients.length === 0 ? (
          <div className="card empty-patients">
            <div className="empty-icon">??</div>
            <h3>No sessions yet</h3>
            <p>When patients are matched with you, they'll appear here.</p>
          </div>
        ) : (
          <div className="patients-list">
            {patients.map(p => (
              <div className="card patient-card card-lift" key={p.user_id}>
                <div className="patient-card-inner">
                  <div className="avatar patient-avatar">{p.name[0]}</div>
                  <div className="patient-info">
                    <div className="patient-name">{p.name}</div>
                    <div className="patient-category">
                      <span className="pill">{p.category}</span>
                    </div>
                    <div className="patient-joined">
                      Joined {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button
                    className="btn-primary chat-patient-btn"
                    onClick={() => navigate(`/chat/${p.user_id}`)}
                  >
                    ??
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card therapist-tip fade-in fade-in-delay-3">
        <div className="tip-icon">??</div>
        <div>
          <div className="tip-title">Your wellbeing matters too</div>
          <p className="tip-text">Remember to take breaks and practice self-care. You can't pour from an empty cup.</p>
        </div>
      </div>
    </div>
  );
}
