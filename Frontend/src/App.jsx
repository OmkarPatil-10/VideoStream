import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from './store/store';
import { userAPI } from './api/api';

import logo from './assets/videoStream-nobg.png';

import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoDetailPage from './pages/VideoDetailPage';
import UploadPage from './pages/UploadPage';
import ChannelPage from './pages/ChannelPage';
import DashboardPage from './pages/DashboardPage';
import PlaylistsPage from './pages/PlaylistsPage';
import SettingsPage from './pages/SettingsPage';
import LikedVideosPage from './pages/LikedVideosPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import MyVideosPage from './pages/MyVideosPage';
import WatchLaterPage from './pages/WatchLaterPage';
import TweetsPage from './pages/TweetsPage';
import MyTweetsPage from './pages/MyTweetsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const { accessToken, setUser, setAccessToken, logout, user } = useAuthStore();
  const { initTheme } = useThemeStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        try {
          const response = await userAPI.getCurrentUser();
          setUser(response.data.data);
        } catch (err) {
          // Token expired → clear state
          logout();
        }
      }
      setIsInitializing(false);
    };
    initializeAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12  flex items-center justify-center mx-auto mb-4  animate-pulse-glow">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing / Home — guests see landing, logged-in users see the feed */}
        <Route path="/" element={accessToken ? <HomePage /> : <LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Public Routes */}
        <Route path="/login" element={accessToken ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={accessToken ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Public content */}
        <Route path="/video/:videoId" element={<VideoDetailPage />} />
        <Route path="/channel/:username" element={<ChannelPage />} />

        {/* Protected Routes */}
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/tweets" element={<ProtectedRoute><TweetsPage /></ProtectedRoute>} />
        <Route path="/my-tweets" element={<ProtectedRoute><MyTweetsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/liked-videos" element={<ProtectedRoute><LikedVideosPage /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
        <Route path="/my-videos" element={<ProtectedRoute><MyVideosPage /></ProtectedRoute>} />
        <Route path="/watch-later" element={<ProtectedRoute><WatchLaterPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
