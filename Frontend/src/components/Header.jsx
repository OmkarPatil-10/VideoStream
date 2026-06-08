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
    { label: 'My Channel', path: `/channel/${user?.username}`, icon: '👤' },
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'My Videos', path: '/my-videos', icon: '🎬' },
    { label: 'Playlists', path: '/playlists', icon: '📋' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="logo-link">
          <div className="w-9 h-9 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
            VS
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
              className="w-full pl-4 pr-12 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm placeholder-dark-400 
                         focus:outline-none focus:border-accent-500/40 focus:bg-dark-800/80 transition-all duration-300"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 text-dark-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
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
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-card-hover animate-slide-down overflow-hidden" id="profile-dropdown">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="font-semibold text-sm text-white truncate">{user?.fullname || user?.username}</p>
                      <p className="text-xs text-dark-400 truncate">@{user?.username}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/5 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-400 hover:text-accent-300 hover:bg-accent-500/5 w-full transition-colors"
                        id="logout-btn"
                      >
                        <span className="text-base">🚪</span>
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
