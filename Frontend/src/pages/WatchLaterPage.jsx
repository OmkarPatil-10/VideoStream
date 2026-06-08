import React, { useEffect, useState } from 'react';
import { userAPI } from '../api/api';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';

const WatchLaterPage = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchWatchHistory(); }, []);

  const fetchWatchHistory = async () => {
    try {
      const res = await userAPI.getWatchHistory();
      setWatchHistory(res.data.data || []);
    } catch (error) {
      console.error('Error fetching watch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch History
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Videos you've watched recently</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-video skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded w-full" />
                  <div className="h-3 skeleton rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : watchHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {watchHistory.map((video) => <VideoCard key={video._id} video={video} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your watch history is empty</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WatchLaterPage;
