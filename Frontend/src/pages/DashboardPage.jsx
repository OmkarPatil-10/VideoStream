import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api/api';
import Layout from '../components/Layout';
import { formatViews } from '../utils/formatters';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, videosRes] = await Promise.all([
        dashboardAPI.getChannelStats(),
        dashboardAPI.getChannelVideos(10),
      ]);
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data?.docs || videosRes.data.data?.videos || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Views', value: formatViews(stats.totalViews), color: '#3b82f6', icon: (
      <svg className="w-6 h-6" fill="none" stroke="#3b82f6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    )},
    { label: 'Subscribers', value: formatViews(stats.subscribers), color: '#ef4444', icon: (
      <svg className="w-6 h-6" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { label: 'Total Likes', value: formatViews(stats.totalLikes), color: '#f59e0b', icon: (
      <svg className="w-6 h-6" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    )},
    { label: 'Total Videos', value: stats.totalVideos, color: '#10b981', icon: (
      <svg className="w-6 h-6" fill="none" stroke="#10b981" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    )},
  ] : [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 skeleton rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your channel analytics at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="stat-card rounded-2xl" style={{ '--stat-color': stat.color }} id={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your Videos</h2>
            <Link to="/upload" className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors">
              + Upload new
            </Link>
          </div>

          {videos.length > 0 ? (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video._id} className="glass-card-hover rounded-xl p-3 flex gap-4" id={`dashboard-video-${video._id}`}>
                  <Link to={`/video/${video._id}`} className="flex-shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-36 h-20 object-cover rounded-lg" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${video._id}`}>
                      <h3 className="font-semibold text-sm truncate hover:text-accent-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{video.title}</h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span>{formatViews(video.views)} views</span>
                      <span className={`badge ${video.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>No videos uploaded yet</p>
              <Link to="/upload" className="px-5 py-2 btn-primary rounded-xl text-sm inline-block">Upload Your First Video</Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
