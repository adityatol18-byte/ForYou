import { useState } from 'react';
import './App.css';
import t from './i18n';
import poems from './poems';

/* ── floating heart ── */
function Heart({ style }) {
  return <span className="heart-particle" style={style} aria-hidden="true">♥</span>;
}

function FloatingHearts() {
  const hearts = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${(i * 6.5) % 100}%`,
    animDelay: `${(i * 0.7) % 8}s`,
    animDuration: `${7 + (i % 5)}s`,
    fontSize: `${12 + (i % 4) * 6}px`,
    opacity: 0.12 + (i % 4) * 0.06,
  }));
  return (
    <div className="hearts-container" aria-hidden="true">
      {hearts.map((h) => (
        <Heart key={h.id} style={{
          left: h.left, animationDelay: h.animDelay,
          animationDuration: h.animDuration, fontSize: h.fontSize, opacity: h.opacity,
        }} />
      ))}
    </div>
  );
}

/* ── main ── */
export default function App() {
  const [page, setPage]           = useState('signup');
  const [transitioning, setTrans] = useState(false);
  const [lang, setLang]           = useState('en');
  const [theme, setTheme]         = useState('dark');
  const [showSettings, setShowSettings] = useState(false);

  const [formData, setFormData]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]       = useState({});
  const [status, setStatus]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPwd, setShowPwd]     = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const [worldSection, setWorldSection] = useState(null);

  const T = t[lang];

  const goTo = (next) => {
    setTrans(true);
    setTimeout(() => {
      setPage(next);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({}); setStatus(''); setShowPwd(false); setShowCfm(false);
      setTrans(false);
    }, 400);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
    setStatus('');
  };

  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (page === 'signup' && !formData.name.trim()) e.name = T.errName;
    if (!formData.email.trim()) e.email = T.errEmail;
    else if (!emailRe.test(formData.email.trim())) e.email = T.errEmailInvalid;
    if (page === 'signup') {
      if (!formData.password) e.password = T.errPassword;
      else if (formData.password.length < 6) e.password = T.errPasswordLen;
      if (!formData.confirmPassword) e.confirmPassword = T.errConfirm;
      else if (formData.password !== formData.confirmPassword) e.confirmPassword = T.errConfirmMatch;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    if (page === 'signup') {
      setStatus('success');
      setTimeout(() => goTo('login'), 1200);
    } else {
      goTo('dashboard');
    }
  };

  /* ─── DASHBOARD ─── */
  if (page === 'dashboard') {
    return (
      <div className={`dashboard-page ${transitioning ? 'page-exit' : 'page-enter'} ${theme === 'light' ? 'db-light' : 'db-dark'}`}>
        <FloatingHearts />

        {/* header */}
        <header className="db-header">
          <div className="db-logo">♥ {T.siteName}</div>
          <button
            id="settings-toggle"
            className="db-settings-btn"
            onClick={() => setShowSettings(p => !p)}
            aria-label={T.settings}
          >⚙</button>
        </header>

        {/* settings panel */}
        {showSettings && (
          <aside className="db-settings-panel" id="settings-panel">
            <h2>{T.settings}</h2>

            {/* dark / light */}
            <button
              className="db-panel-btn"
              onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? T.lightMode : T.darkMode}
            </button>

            {/* language */}
            <p className="settings-label">{T.language}</p>
            <div className="lang-options">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
              ].map(l => (
                <button
                  key={l.code}
                  className={`lang-btn ${lang === l.code ? 'lang-active' : ''}`}
                  onClick={() => { setLang(l.code); }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button className="db-panel-btn db-logout-btn" onClick={() => { setShowSettings(false); goTo('signup'); }}>
              {T.logout}
            </button>
          </aside>
        )}

        {/* main content */}
        <main className="db-main">
          <div className="db-hero-card">
            <div className="db-hearts-banner" aria-hidden="true">♥ ♥ ♥</div>
            <h1 className="db-hero-title">{T.onlyForYou}</h1>
            <p className="db-hero-sub">{T.heroSub}</p>
            <div className="db-badge">{T.welcomeBack}</div>
          </div>

          <button
            className="our-world-btn"
            onClick={() => goTo('world')}
          >
            🌸 {T.ourWorld}
          </button>
        </main>
      </div>
    );
  }

  /* ─── WORLD PAGE ─── */
  if (page === 'world') {
    return (
      <div className={`dashboard-page ${transitioning ? 'page-exit' : 'page-enter'} ${theme === 'light' ? 'db-light' : 'db-dark'}`}>
        <FloatingHearts />
        <header className="db-header">
          <div className="db-logo">♥ {T.siteName}</div>
          <button
            id="world-settings-toggle"
            className="db-settings-btn"
            onClick={() => setShowSettings(p => !p)}
            aria-label={T.settings}
          >⚙</button>
        </header>

        {showSettings && (
          <aside className="db-settings-panel" id="world-settings-panel">
            <h2>{T.settings}</h2>
            <button className="db-panel-btn" onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? T.lightMode : T.darkMode}
            </button>
            <p className="settings-label">{T.language}</p>
            <div className="lang-options">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
              ].map(l => (
                <button key={l.code} className={`lang-btn ${lang === l.code ? 'lang-active' : ''}`}
                  onClick={() => setLang(l.code)}>{l.label}</button>
              ))}
            </div>
            <button className="db-panel-btn db-logout-btn" onClick={() => { setShowSettings(false); goTo('signup'); }}>
              {T.logout}
            </button>
          </aside>
        )}

        {/* Left sidebar + content area */}
        <main className="world-main">
          <aside className="world-sidebar">
            {[
              { key: 'poem',   icon: '📜', label: T.poem   },
              { key: 'letter', icon: '💌', label: T.letter },
              { key: 'songs',  icon: '🎵', label: T.songs  },
            ].map(s => (
              <button
                key={s.key}
                className={`world-nav-btn ${worldSection === s.key ? 'world-nav-active' : ''}`}
                onClick={() => setWorldSection(s.key)}
              >
                <span className="world-nav-icon">{s.icon}</span>
                <span className="world-nav-label">{s.label}</span>
              </button>
            ))}
          </aside>

          {/* Right content area */}
          <section className="world-content">
            {!worldSection && (
              <div className="world-welcome">
                <div className="world-welcome-seal">♥</div>
                <p className="world-welcome-line1">
                  My love — There is always a way to love people,<br />
                  there is always a destination to reach in life.
                </p>
                <div className="world-welcome-divider" />
                <p className="world-welcome-line2">
                  What I am doing here in this world is to live with you<br />
                  and carry on my life with you.
                </p>
                <p className="world-welcome-sign">— Always yours 🌹</p>
              </div>
            )}
            {worldSection === 'poem' && (
              <div className="poem-area">
                {poems.map(poem => (
                  <div className="letter-card" key={poem.id}>
                    <div className="letter-seal">♥</div>
                    <h2 className="letter-title">{poem.title}</h2>
                    <p className="letter-date">{poem.date}</p>
                    <div className="letter-divider" />
                    <p className="letter-body">{poem.text}</p>
                    <p className="letter-sign">— Always yours 🌹</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  /* ─── AUTH PAGES ─── */
  const isSignup = page === 'signup';
  return (
    <div className={`auth-page ${isSignup ? 'signup-bg' : 'login-bg'} ${transitioning ? 'page-exit' : 'page-enter'}`}>
      <FloatingHearts />
      <div className="auth-overlay" />

      {/* language switcher on auth pages */}
      <div className="auth-lang-bar">
        {[
          { code: 'en', label: 'EN' },
          { code: 'hi', label: 'HI' },
          { code: 'mr', label: 'MR' },
          { code: 'kn', label: 'KN' },
        ].map(l => (
          <button
            key={l.code}
            className={`auth-lang-btn ${lang === l.code ? 'auth-lang-active' : ''}`}
            onClick={() => setLang(l.code)}
          >{l.label}</button>
        ))}
      </div>

      <main className="auth-card" role="main">
        <div className="card-petals" aria-hidden="true"><span>🌸</span><span>♥</span><span>🌸</span></div>

        <p className="tagline">{isSignup ? T.signupTagline : T.loginTagline}</p>
        <h1 className="auth-title">{isSignup ? T.signupTitle : T.loginTitle}</h1>
        <p className="auth-subtitle">{isSignup ? T.signupSub : T.loginSub}</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate id={isSignup ? 'signup-form' : 'login-form'}>
          {isSignup && (
            <div className="field-group">
              <label htmlFor="name">{T.nameLabel}</label>
              <div className="input-wrap">
                <span className="input-icon">💖</span>
                <input id="name" name="name" type="text" value={formData.name}
                  onChange={onChange} placeholder={T.namePlaceholder} autoComplete="given-name" />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="field-group">
            <label htmlFor="email">{T.emailLabel}</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input id="email" name="email" type="email" value={formData.email}
                onChange={onChange} placeholder={T.emailPlaceholder} autoComplete="email" />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {isSignup && (
            <div className="field-group">
              <label htmlFor="password">{T.passwordLabel}</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input id="password" name="password" type={showPwd ? 'text' : 'password'}
                  value={formData.password} onChange={onChange}
                  placeholder={T.passwordPlaceholder}
                  autoComplete="new-password" />
                <button type="button" className="eye-btn"
                  onClick={() => setShowPwd(p => !p)}
                  aria-label="toggle password">{showPwd ? '🙈' : '👁'}</button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          )}

          {isSignup && (
            <div className="field-group">
              <label htmlFor="confirmPassword">{T.confirmLabel}</label>
              <div className="input-wrap">
                <span className="input-icon">🔐</span>
                <input id="confirmPassword" name="confirmPassword"
                  type={showCfm ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={onChange}
                  placeholder={T.confirmPlaceholder} autoComplete="new-password" />
                <button type="button" className="eye-btn"
                  onClick={() => setShowCfm(p => !p)}
                  aria-label="toggle confirm">{showCfm ? '🙈' : '👁'}</button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          )}

          {status === 'success' && (
            <div className="success-banner" role="status">{T.signupSuccess}</div>
          )}

          <button type="submit" id={isSignup ? 'signup-submit' : 'login-submit'}
            className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? <span className="spinner" /> : isSignup ? T.signupBtn : T.loginBtn}
          </button>
        </form>

        <div className="divider"><span>{T.or}</span></div>

        <p className="switch-row">
          {isSignup ? T.haveAccount : T.noAccount}{' '}
          <button type="button" id={isSignup ? 'go-to-login' : 'go-to-signup'}
            className="link-btn" onClick={() => goTo(isSignup ? 'login' : 'signup')}>
            {isSignup ? T.goLogin : T.goSignup}
          </button>
        </p>

        <div className="card-footer-roses" aria-hidden="true">🌹 🌹 🌹</div>
      </main>
    </div>
  );
}
