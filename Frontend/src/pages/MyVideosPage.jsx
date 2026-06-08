import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, videoAPI } from '../api/api';
import Layout from '../components/Layout';
import { formatViews, formatTimeAgo } from '../utils/formatters';

const MyVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchMyVideos(); }, []);

  const fetchMyVideos = async () => {
    try {
      const res = await dashboardAPI.getChannelVideos(50);
      setVideos(res.data.data?.docs || res.data.data?.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      await videoAPI.deleteVideo(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      await videoAPI.togglePublishStatus(videoId);
      fetchMyVideos();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              My Videos
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{videos.length} videos uploaded</p>
          </div>
          <Link to="/upload" className="px-5 py-2.5 btn-primary rounded-xl text-sm">+ Upload</Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-3">
            {videos.map((video) => (
              <div key={video._id} className="glass-card-hover rounded-xl p-3 flex gap-4" id={`my-video-${video._id}`}>
                <Link to={`/video/${video._id}`} className="flex-shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover rounded-lg" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/video/${video._id}`}>
                    <h3 className="font-semibold text-sm truncate hover:text-accent-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{video.title}</h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>{formatViews(video.views)} views</span>
                    <span>{video.duration}</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`badge ${video.isPublished ? 'badge-success' : 'badge-warning'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button onClick={() => handleTogglePublish(video._id)} className="px-3 py-1.5 btn-secondary text-xs rounded-lg">
                    {video.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(video._id)} className="px-3 py-1.5 bg-accent-600/10 border border-accent-500/20 text-accent-400 hover:bg-accent-600 hover:text-white text-xs rounded-lg transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>No videos uploaded yet</p>
            <Link to="/upload" className="px-5 py-2 btn-primary rounded-xl text-sm">Upload Your First Video</Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyVideosPage;
