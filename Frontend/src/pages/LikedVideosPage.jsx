import React, { useEffect, useState } from 'react';
import { likeAPI } from '../api/api';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchLikedVideos(); }, []);

  const fetchLikedVideos = async () => {
    try {
      const res = await likeAPI.getLikedVideos();
      setVideos(res.data.data || []);
    } catch (error) {
      console.error('Error fetching liked videos:', error);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Liked Videos
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{videos.length} videos you've loved</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-video skeleton" />
                <div className="p-3 flex gap-3">
                  <div className="w-8 h-8 rounded-lg skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-3 skeleton rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((video) => <VideoCard key={video._id} video={video} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You haven't liked any videos yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LikedVideosPage;
