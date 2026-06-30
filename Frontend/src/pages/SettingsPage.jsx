import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullname: user?.fullname || '',
    oldPassword: '',
    newPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); setSuccess('');
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await userAPI.updateAccount({ email: formData.email, fullname: formData.fullname });
      setUser(res.data.data);
      setSuccess('Account updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await userAPI.changePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      setSuccess('Password changed successfully!');
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await userAPI.updateAvatar(file);
      setUser(res.data.data);
      setSuccess('Avatar updated!');
    } catch (err) {
      setError('Failed to update avatar');
    }
  };

  const handleCoverImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const res = await userAPI.updateCoverImage(file);
      setUser(res.data.data);
      setSuccess('Cover image updated!');
    } catch (err) {
      setError('Failed to update cover image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await userAPI.logout(); } catch (e) {}
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your account</p>
        </div>

        {/* Alerts */}
        {error && <div className="bg-accent-500/10 border border-accent-500/20 text-accent-300 px-4 py-3 rounded-xl text-sm mb-4 animate-scale-in">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm mb-4 animate-scale-in">{success}</div>}

        {/* Avatar */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Profile Picture</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/10">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center font-bold text-lg">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <label className="px-4 py-2 btn-secondary rounded-xl text-sm cursor-pointer inline-block">
                Change Avatar
                <input type="file" accept="image/*" onChange={handleAvatarUpdate} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="glass-card rounded-2xl p-6 mb-5" id="cover-image-section">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Cover Image</h2>
          <div className="relative w-full rounded-xl overflow-hidden ring-2 ring-white/10" style={{ aspectRatio: '16 / 4' }}>
            {user?.coverImage ? (
              <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-accent-700 via-accent-500/60 to-accent-700 flex items-center justify-center">
                <svg className="w-10 h-10" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="px-4 py-2 btn-primary rounded-xl text-sm cursor-pointer inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {user?.coverImage ? 'Update Cover Image' : 'Add Cover Image'}
              <input type="file" accept="image/*" onChange={handleCoverImageUpdate} className="hidden" id="cover-image-input" />
            </label>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recommended: 1584 × 396px (4:1 ratio)</p>
          </div>
        </div>

        {/* Account */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Account Information</h2>
          <form onSubmit={handleUpdateAccount} className="space-y-4" id="account-form">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" />
            </div>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 btn-primary rounded-xl text-sm">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4" id="password-form">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Password</label>
              <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="input-field" />
            </div>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 btn-primary rounded-xl text-sm">
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger */}
        <div className="glass-card rounded-2xl p-6 border border-accent-500/10">
          <h2 className="text-lg font-bold text-accent-400 mb-2">Danger Zone</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>You will be signed out of your account.</p>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-accent-600/10 border border-accent-500/20 text-accent-400 hover:bg-accent-600 hover:text-white rounded-xl text-sm font-semibold transition-all" id="settings-logout">
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
