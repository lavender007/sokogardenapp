import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const CATEGORIES = [
  { icon: '🌿', label: 'Anxiety' },
  { icon: '🌧️', label: 'Depression' },
  { icon: '🧘', label: 'Stress' },
  { icon: '💞', label: 'Relationships' },
  { icon: '🌱', label: 'Trauma' },
  { icon: '🔥', label: 'Burnout' },
];

const TESTIMONIALS = [
  {
    text: "Finding a therapist felt impossible until I tried this platform. Within minutes I was matched with someone who truly understands me.",
    name: "Maya R.",
    role: "Member for 6 months"
  },
  {
    text: "The calming environment made it easy to open up. My therapist has been instrumental in my healing journey.",
    name: "Daniel K.",
    role: "Member for 1 year"
  },
  {
    text: "I was skeptical about online therapy, but this changed everything. Real support, real progress.",
    name: "Aisha T.",
    role: "Member for 3 months"
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <span className="logo-leaf">🌿</span>
          <span className="logo-text">Serene</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="nav-link-text">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-orb orb-1" />
        <div className="hero-bg-orb orb-2" />
        <div className="hero-content fade-in">
          <div className="hero-badge">
            <span>✨</span> Trusted by 10,000+ members
          </div>
          <h1 className="hero-title">
            A calmer mind<br />
            <em>starts here</em>
          </h1>
          <p className="hero-subtitle">
            Get matched with a licensed therapist in minutes. Private, compassionate, and always available — whenever you need support.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary hero-cta">
              Begin your journey →
            </Link>
            <Link to="/login" className="btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>
        <div className="hero-visual fade-in fade-in-delay-2">
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="avatar" style={{ width: 48, height: 48, fontSize: 20, background: '#dcfce7' }}>🌿</div>
              <div>
                <div className="hero-card-name">Dr. Sarah Mitchell</div>
                <div className="hero-card-tag">Anxiety & Stress Specialist</div>
              </div>
              <div className="online-dot" />
            </div>
            <div className="hero-chat-preview">
              <div className="preview-bubble therapist">
                How are you feeling today? I'm here for you. 💚
              </div>
              <div className="preview-bubble customer">
                Much better. These sessions really help.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-label">What brings you here?</div>
        <h2 className="categories-title">Support for every part of you</h2>
        <div className="categories-grid">
          {CATEGORIES.map((c) => (
            <div className="category-chip" key={c.label}>
              <span className="category-icon">{c.icon}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="section-label">How it works</div>
        <h2 className="how-title">Simple steps to feeling better</h2>
        <div className="steps-grid">
          {[
            { step: '01', icon: '📋', title: 'Share your needs', desc: 'Tell us what you\'re working through. No judgment, just understanding.' },
            { step: '02', icon: '🤝', title: 'Get matched', desc: 'We instantly match you with a therapist whose specialty fits your needs.' },
            { step: '03', icon: '💬', title: 'Start talking', desc: 'Begin your session right away in a private, secure chat environment.' },
          ].map((s) => (
            <div className="step-card card" key={s.step}>
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-label">Stories of hope</div>
        <h2 className="testimonials-title">Real people, real change</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial-card card" key={i}>
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="avatar testimonial-avatar">{t.name[0]}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-bg-orb" />
          <h2 className="cta-title">You deserve to feel at peace</h2>
          <p className="cta-subtitle">Join thousands finding clarity and calm with Serene.</p>
          <Link to="/register" className="btn-primary cta-btn">
            Start for free today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <span>🌿</span> Serene
        </div>
        <p className="footer-text">A safe space for your mental wellness journey.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}
