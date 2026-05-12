import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://mayakasamantha6.alwaysdata.net/';

const parseJson = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

const loginRequest = async (email, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseJson(res);
};

const registerRequest = async (name, email, password, role) => {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return parseJson(res);
};

const createAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const postWithAuth = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(body),
  });
  return parseJson(res);
};

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginRequest(form.email, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'therapist' ? '/therapist' : '/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">?? Serene</Link>
          <h2 className="auth-tagline">Welcome back.<br /><em>Your space awaits.</em></h2>
          <p className="auth-desc">Continue your journey toward peace and clarity with your therapist.</p>
          <div className="auth-feature-list">
            {['Private & confidential sessions', 'Licensed therapist support', 'Available whenever you need'].map(f => (
              <div className="auth-feature" key={f}><span className="auth-check">?</span> {f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container fade-in">
          <h1 className="auth-form-title">Sign in</h1>
          <p className="auth-form-subtitle">Good to have you back.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in ?'}
            </button>
          </form>

          <p className="auth-switch">
            New to Serene? <Link to="/register">Create an account</Link>
          </p>

          <div className="auth-demo">
            <div className="demo-title">Demo accounts</div>
            <div className="demo-items">
              <div className="demo-item"><strong>Therapist:</strong> sarah@therapyapp.com / demo123</div>
              <div className="demo-item"><strong>Register as customer</strong> to experience matching</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma', 'Burnout', 'Self-esteem', 'Grief'];
const SPECIALTIES = ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma', 'Burnout', 'Self-esteem', 'Grief'];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setStep(2);
  };

  const handleFinish = async () => {
    if (role === 'customer' && !selectedCategory) {
      setError('Please select a category');
      return;
    }
    if (role === 'therapist' && selectedSpecialties.length === 0) {
      setError('Please select at least one specialty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await registerRequest(form.name, form.email, form.password, role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (role === 'customer') {
        await postWithAuth('/api/customer/profile', { selected_category: selectedCategory });
        await postWithAuth('/api/match', {});
        navigate('/home');
      } else {
        await postWithAuth('/api/therapist/profile', { specialties: selectedSpecialties, bio });
        navigate('/therapist');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (s) => {
    setSelectedSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="auth-screen">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">?? Serene</Link>
          <h2 className="auth-tagline">Begin your<br /><em>healing journey.</em></h2>
          <p className="auth-desc">A safe, private space where you can open up and find the support you deserve.</p>
          <div className="auth-steps-indicator">
            <div className={`auth-step-dot ${step >= 1 ? 'done' : ''}`} />
            <div className="auth-step-line" />
            <div className={`auth-step-dot ${step >= 2 ? 'done' : ''}`} />
          </div>
          <div className="auth-steps-labels">
            <span>Account</span>
            <span>Profile</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container fade-in">
          {step === 1 && (
            <>
              <h1 className="auth-form-title">Create account</h1>
              <p className="auth-form-subtitle">Start with your basic info.</p>

              <div className="role-toggle">
                <button
                  className={`role-btn ${role === 'customer' ? 'active' : ''}`}
                  onClick={() => setRole('customer')}
                  type="button"
                >
                  ?? I need support
                </button>
                <button
                  className={`role-btn ${role === 'therapist' ? 'active' : ''}`}
                  onClick={() => setRole('therapist')}
                  type="button"
                >
                  ?? I'm a therapist
                </button>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className="btn-primary auth-submit">
                  Continue ?
                </button>
              </form>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}

          {step === 2 && role === 'customer' && (
            <>
              <button className="auth-back" onClick={() => setStep(1)}>? Back</button>
              <h1 className="auth-form-title">What brings you here?</h1>
              <p className="auth-form-subtitle">We'll match you with the right therapist.</p>

              {error && <div className="auth-error">{error}</div>}

              <div className="category-selector">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`category-select-btn ${selectedCategory === c ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(c)}
                    type="button"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button className="btn-primary auth-submit" onClick={handleFinish} disabled={loading}>
                {loading ? 'Saving...' : 'Create account'}
              </button>
            </>
          )}

          {step === 2 && role === 'therapist' && (
            <>
              <button className="auth-back" onClick={() => setStep(1)}>? Back</button>
              <h1 className="auth-form-title">Tell us about your practice</h1>
              <p className="auth-form-subtitle">Share the experience patients will see.</p>

              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="A short description of your therapy style"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialties</label>
                <div className="specialty-selector">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s}
                      className={`category-select-btn ${selectedSpecialties.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleSpecialty(s)}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary auth-submit" onClick={handleFinish} disabled={loading}>
                {loading ? 'Saving...' : 'Create account'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
