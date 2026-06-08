import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoAPI } from '../api/api';
import { useVideoStore } from '../store/store';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';

const HomePage = () => {
  const { videos, setVideos, isLoading, setLoading } = useVideoStore();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videoAPI.getAllVideos(searchQuery, 20, 1);
      setVideos(response.data.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {searchQuery ? (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Search results for "<span className="gradient-text">{searchQuery}</span>"
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{videos.length} videos found</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                <span className="gradient-text">Recommended</span> for you
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Trending videos from across the platform</p>
            </>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && !videos.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
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
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-10 h-10 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'No videos match your search' : 'No videos found'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try searching for something else or check back later</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
