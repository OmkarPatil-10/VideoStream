import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../store/store';
import { userAPI } from '../api/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const isDark = theme === 'dark';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await userAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { label: 'My Channel', path: `/channel/${user?.username}`, icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    { label: 'Dashboard', path: '/dashboard', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { label: 'My Videos', path: '/my-videos', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    )},
    { label: 'Playlists', path: '/playlists', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    )},
    { label: 'Settings', path: '/settings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 glass-surface border-b">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="logo-link">
          <div className="w-9 h-9  rounded-xl flex items-center justify-center ">
            <img src="Public/videoStream-nobg.png" alt="Logo" className="w-9 h-9 object-contain" />

          </div>
          <span className="text-lg font-bold hidden md:block tracking-tight">
            Video<span className="gradient-text">Stream</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="input-field text-sm"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-card-hover)] transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="theme-toggle"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <span
              className="text-lg transition-transform duration-300"
              style={{ display: 'inline-block', transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
              {isDark ? (
                /* Moon icon */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              ) : (
                /* Sun icon */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 3v1m0 16v1m8.66-9H21m-18 0H3m15.36-6.36-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
          </button>
          {isAuthenticated() ? (
            <>
              {/* Upload Button */}
              <Link
                to="/upload"
                id="upload-btn"
                className="hidden sm:flex items-center gap-2 px-4 py-2 btn-primary text-sm rounded-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden md:inline">Upload</span>
              </Link>

              {/* Mobile Upload */}
              <Link to="/upload" className="sm:hidden p-2 btn-ghost rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>

              {/* Profile Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  id="profile-menu-btn"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-transparent hover:ring-accent-500/30 transition-all duration-300"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center font-bold text-sm">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-card-hover animate-slide-down overflow-hidden border" id="profile-dropdown" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-card)' }}>
                    {/* User info */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-card)' }}>
                      <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{user?.fullname || user?.username}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">@{user?.username}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-[var(--text-muted)]">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t py-1" style={{ borderColor: 'var(--border-card)' }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-400 hover:text-accent-300 hover:bg-[var(--bg-card-hover)] w-full transition-colors"
                        id="logout-btn"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-accent-400 border border-accent-500/30 rounded-xl hover:bg-accent-500/10 transition-all duration-300"
                id="signin-btn"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm btn-primary rounded-xl hidden sm:block"
                id="signup-btn"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
