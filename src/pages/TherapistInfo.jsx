import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TherapistInfo.css';

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

export default function TherapistInfoPage() {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiGet('/api/my-therapist')
      .then(d => setAssignment(d.assignment))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  if (!assignment) return (
    <div className="therapist-info-empty">
      <div>??</div>
      <h3>No therapist assigned yet</h3>
      <p>Complete your profile to get matched.</p>
    </div>
  );

  const { therapist_profile: tp, therapist_name, category } = assignment;

  return (
    <div className="therapist-info-page">
      <div className="ti-header fade-in">
        <div className="ti-avatar">{therapist_name[0]}</div>
        <h1 className="ti-name">{therapist_name}</h1>
        <div className="ti-tag">Your {category} Specialist</div>
        <div className="ti-rating">? {tp?.rating || '4.8'} � Licensed Therapist</div>
      </div>

      {tp?.bio && (
        <div className="card ti-bio-card fade-in fade-in-delay-1">
          <div className="ti-section-label">About</div>
          <p className="ti-bio">"{tp.bio}"</p>
        </div>
      )}

      <div className="card ti-specialties-card fade-in fade-in-delay-2">
        <div className="ti-section-label">Areas of expertise</div>
        <div className="ti-specialties">
          {tp?.specialties?.map(s => (
            <span className="pill" key={s}>{s}</span>
          ))}
        </div>
      </div>

      <div className="card ti-approach-card fade-in fade-in-delay-3">
        <div className="ti-section-label">Therapeutic approach</div>
        <div className="approach-items">
          {['Evidence-based therapy (CBT)', 'Mindfulness-based techniques', 'Person-centered care', 'Trauma-informed approach'].map(a => (
            <div className="approach-item" key={a}>
              <span className="approach-check">??</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-primary ti-chat-btn fade-in fade-in-delay-3"
        onClick={() => navigate(`/chat/${assignment.therapist_id}`)}
      >
        ?? Start a session
      </button>
    </div>
  );
}
