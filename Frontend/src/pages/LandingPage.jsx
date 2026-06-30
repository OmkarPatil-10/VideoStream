import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/store';
import logo from '../assets/videoStream-nobg.png';

/* ─── Animated counter hook ─── */
const useCountUp = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return [count, ref];
};

/* ─── Fade-in on scroll component ─── */
const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── Floating particles background ─── */
const ParticlesBackground = () => {
  return (
    <div className="landing-particles" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="landing-particle"
          style={{
            '--size': `${Math.random() * 300 + 100}px`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--duration': `${Math.random() * 15 + 10}s`,
            '--delay': `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [videosCount, videosRef] = useCountUp(12000, 2200);
  const [creatorsCount, creatorsRef] = useCountUp(3500, 2000);
  const [viewsCount, viewsRef] = useCountUp(2, 1800);

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Upload & Share',
      description: 'Publish your videos in minutes with powerful upload tools. Support for all major formats with automatic transcoding.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Build Your Community',
      description: 'Grow your subscriber base, interact through comments and tweets, and build a loyal audience around your content.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: 'Curate Playlists',
      description: 'Organize content into playlists, save videos to watch later, and discover new creators through personalized feeds.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Creator Dashboard',
      description: 'Get real-time analytics on views, likes, and subscriber growth. Understand your audience and optimize your content.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Social Tweets',
      description: 'Share thoughts, updates, and behind-the-scenes moments. Engage with your community beyond video content.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure & Private',
      description: 'Industry-standard encryption and authentication keep your account and content safe. Your data stays yours.',
    },
  ];

  return (
    <div className="landing-page" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ─── Floating Nav ─── */}
      <nav className="landing-nav glass-surface border-b" id="landing-nav">
        <div className="landing-nav-inner">

          <Link to="/" className="flex items-center gap-2.5 group" id="landing-logo">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center ">
              <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Video<span className="gradient-text">Stream</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="theme-toggle"
              id="landing-theme-toggle"
            >
              <span
                className="text-lg transition-transform duration-300"
                style={{ display: 'inline-block', transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m8.66-9H21m-18 0H3m15.36-6.36-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
            </button>

            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300"
              style={{ color: 'var(--text-secondary)' }}
              id="landing-signin-btn"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm btn-primary rounded-xl"
              id="landing-signup-btn"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <ParticlesBackground />

      {/* ═══ HERO SECTION ═══ */}
      <section className="landing-hero" id="hero-section">
        {/* Gradient orbs */}
        <div className="landing-hero-bg" aria-hidden="true">
          <div className="landing-orb landing-orb-1" />
          <div className="landing-orb landing-orb-2" />
          <div className="landing-orb landing-orb-3" />
        </div>

        <div className="landing-hero-content animate-fade-in">
          <div className="landing-badge glass-card">
            <span className="landing-badge-dot" />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Now in Open Beta — Join the community
            </span>
          </div>

          <h1 className="landing-hero-title" style={{ color: 'var(--text-primary)' }}>
            Your Stage.{' '}
            <span className="landing-hero-gradient">Your Story.</span>
            <br />
            Your <span className="landing-hero-gradient">Stream.</span>
          </h1>

          <p className="landing-hero-subtitle" style={{ color: 'var(--text-secondary)' }}>
            The next-generation video platform built for creators who demand more.
            Upload, share, and grow your audience with powerful tools and a community that cares.
          </p>

          <div className="landing-hero-actions">
            <Link to="/register" className="landing-cta-primary btn-primary" id="hero-cta-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Creating — It's Free
            </Link>
            <Link to="/login" className="landing-cta-secondary btn-secondary" id="hero-cta-secondary">
              Explore Videos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Hero visual mockup */}
          <div className="landing-hero-visual">
            <div className="landing-browser-frame glass-card">
              <div className="landing-browser-dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <div className="landing-browser-content">
                {/* Simulated video grid */}
                <div className="landing-mock-grid">
                  {[
                    {
                      color: 'from-accent-500/30 to-purple-600/30',
                      label: (
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      color: 'from-blue-500/30 to-cyan-500/30',
                      label: (
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      )
                    },
                    {
                      color: 'from-emerald-500/30 to-teal-500/30',
                      label: (
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      color: 'from-orange-500/30 to-amber-500/30',
                      label: (
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )
                    },
                    {
                      color: 'from-pink-500/30 to-rose-500/30',
                      label: (
                        <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      )
                    },
                    {
                      color: 'from-violet-500/30 to-indigo-500/30',
                      label: (
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                  ].map((item, i) => (
                    <div key={i} className="landing-mock-card" style={{ animationDelay: `${i * 0.15}s` }}>
                      <div className={`landing-mock-thumb bg-gradient-to-br ${item.color}`}>
                        {item.label}
                      </div>
                      <div className="landing-mock-info">
                        <div className="landing-mock-line landing-mock-line-1" />
                        <div className="landing-mock-line landing-mock-line-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      {/* <section className="landing-stats" id="stats-section">
        <FadeInSection className="landing-stats-inner">
          <div className="landing-stat" ref={videosRef}>
            <span className="landing-stat-number gradient-text">
              {videosCount.toLocaleString()}+
            </span>
            <span className="landing-stat-label" style={{ color: 'var(--text-muted)' }}>Videos Uploaded</span>
          </div>
          <div className="landing-stat-divider" />
          <div className="landing-stat" ref={creatorsRef}>
            <span className="landing-stat-number gradient-text">
              {creatorsCount.toLocaleString()}+
            </span>
            <span className="landing-stat-label" style={{ color: 'var(--text-muted)' }}>Active Creators</span>
          </div>
          <div className="landing-stat-divider" />
          <div className="landing-stat" ref={viewsRef}>
            <span className="landing-stat-number gradient-text">
              {viewsCount}M+
            </span>
            <span className="landing-stat-label" style={{ color: 'var(--text-muted)' }}>Monthly Views</span>
          </div>
        </FadeInSection>
      </section> */}

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="landing-features" id="features-section">
        <FadeInSection className="text-center mb-16">
          <span className="landing-section-tag glass-card">Features</span>
          <h2 className="landing-section-title" style={{ color: 'var(--text-primary)' }}>
            Everything you need to{' '}
            <span className="landing-hero-gradient">create & grow</span>
          </h2>
          <p className="landing-section-desc" style={{ color: 'var(--text-secondary)' }}>
            Powerful tools designed for creators at every level — from first upload to a million subscribers.
          </p>
        </FadeInSection>

        <div className="landing-features-grid">
          {features.map((feature, i) => (
            <FadeInSection key={i} delay={i * 100}>
              <div className="landing-feature-card glass-card-hover" id={`feature-card-${i}`}>
                <div className="landing-feature-icon">
                  {feature.icon}
                </div>
                <h3 className="landing-feature-title" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="landing-feature-desc" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="landing-how-it-works" id="how-it-works-section">
        <FadeInSection className="text-center mb-16">
          <span className="landing-section-tag glass-card">How It Works</span>
          <h2 className="landing-section-title" style={{ color: 'var(--text-primary)' }}>
            Go live in <span className="landing-hero-gradient">three steps</span>
          </h2>
        </FadeInSection>

        <div className="landing-steps">
          {[
            {
              step: '01',
              title: 'Create Your Account',
              desc: 'Sign up in seconds. Set up your profile, choose your avatar, and customize your channel.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
            },
            {
              step: '02',
              title: 'Upload Your Content',
              desc: 'Drag, drop, and publish. Add titles, descriptions, and thumbnails with our intuitive editor.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              ),
            },
            {
              step: '03',
              title: 'Grow Your Audience',
              desc: 'Engage through comments, tweets, and playlists. Watch your community thrive with built-in analytics.',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <FadeInSection key={i} delay={i * 200} className="landing-step">
              <div className="landing-step-card glass-card" id={`step-card-${i}`}>
                <div className="landing-step-number">{item.step}</div>
                <div className="landing-step-icon">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              {i < 2 && <div className="landing-step-connector" />}
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="landing-final-cta" id="final-cta-section">
        <FadeInSection>
          <div className="landing-final-cta-card">
            <div className="landing-final-cta-bg" aria-hidden="true" />
            <div className="landing-final-cta-content">
              <h2 className="landing-final-title" style={{ color: '#fff' }}>
                Ready to start your journey?
              </h2>
              <p className="landing-final-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Join thousands of creators who are already sharing their stories on VideoStream.
                No credit card required.
              </p>
              <div className="landing-hero-actions" style={{ justifyContent: 'center' }}>
                <Link to="/register" className="landing-cta-final" id="final-cta-btn">
                  Create Your Free Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer" id="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={logo} alt="footLogo" className="w-9 h-9 object-contain" />

              </div>
              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Video<span className="gradient-text">Stream</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The next-generation video platform for creators and communities.
            </p>
          </div>
          <div className="landing-footer-links">
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-sm hover:text-accent-400 transition-colors" style={{ color: 'var(--text-muted)' }}>Sign Up</Link></li>
                <li><Link to="/login" className="text-sm hover:text-accent-400 transition-colors" style={{ color: 'var(--text-muted)' }}>Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Creators</h4>
              <ul className="space-y-2">
                <li><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload Videos</span></li>
                <li><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Analytics</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p className="text-xs flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} VideoStream. Built with
            <svg className="w-3.5 h-3.5 text-accent-500 fill-current inline-block" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            for creators.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
