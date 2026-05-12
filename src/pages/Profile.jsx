import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

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

const CATEGORIES = ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma', 'Burnout', 'Self-esteem', 'Grief'];

export default function ProfilePage() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (user.role === 'therapist') {
      apiGet(`/api/therapists/${user.id}`)
        .then(d => {
          setProfile(d.therapist);
          setForm({ bio: d.therapist.bio || '', specialties: d.therapist.specialties || [] });
        })
        .catch(() => {});
    } else {
      apiGet('/api/my-therapist')
        .then(d => {
          setProfile(d.assignment);
          setForm({ category: d.assignment?.category || '' });
        })
        .catch(() => {});
    }
  }, [user, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user.role === 'therapist') {
        await apiPost('/api/therapist/profile', { bio: form.bio, specialties: form.specialties });
      } else if (form.category) {
        await apiPost('/api/customer/profile', { selected_category: form.category });
      }
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleSpecialty = (s) => {
    setForm(prev => ({
      ...prev,
      specialties: prev.specialties?.includes(s)
        ? prev.specialties.filter(x => x !== s)
        : [...(prev.specialties || []), s]
    }));
  };

  return (
    <div className="profile-page">
      <div className="profile-hero fade-in">
        <div className="profile-hero-avatar">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="profile-hero-name">{user?.name}</div>
        <div className="profile-hero-role">
          {user?.role === 'therapist' ? 'Licensed Therapist' : 'Seeking support'}
        </div>
        <div className="profile-hero-email">{user?.email}</div>
      </div>

      {saved && (
        <div className="save-success fade-in">
          Profile updated successfully
        </div>
      )}

      <div className="card profile-card fade-in fade-in-delay-1">
        <div className="profile-card-header">
          <h3 className="profile-card-title">My Profile</h3>
          {!editing ? (
            <button className="btn-ghost edit-btn" onClick={() => setEditing(true)}>Edit</button>
          ) : (
            <div className="edit-actions">
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {user?.role === 'therapist' && (
          <>
            <div className="profile-field">
              <div className="profile-field-label">Bio</div>
              {editing ? (
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.bio || ''}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell patients about your approach..."
                  style={{ resize: 'vertical' }}
                />
              ) : (
                <div className="profile-field-value">
                  {profile?.bio || <span className="profile-empty">No bio added yet</span>}
                </div>
              )}
            </div>

            <div className="profile-field">
              <div className="profile-field-label">Specialties</div>
              {editing ? (
                <div className="specialty-selector">
                  {CATEGORIES.map(s => (
                    <button
                      key={s}
                      className={`category-select-btn ${form.specialties?.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleSpecialty(s)}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="profile-pills">
                  {(profile?.specialties || []).map(s => (
                    <span className="pill" key={s}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {user?.role === 'customer' && (
          <div className="profile-field">
            <div className="profile-field-label">Therapy focus</div>
            {editing ? (
              <div className="specialty-selector">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`category-select-btn ${form.category === c ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, category: c })}
                    type="button"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="profile-pills">
                {profile?.category ? (
                  <span className="pill">{profile.category}</span>
                ) : (
                  <span className="profile-empty">Not set</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="profile-field">
          <div className="profile-field-label">Member since</div>
          <div className="profile-field-value">
            {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="card privacy-card fade-in fade-in-delay-2">
        <div className="privacy-icon">🔒</div>
        <div>
          <div className="privacy-title">Your privacy is protected</div>
          <p className="privacy-text">All conversations are private and confidential. Your data is never shared without consent.</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Sign out
      </button>
    </div>
  );
}
