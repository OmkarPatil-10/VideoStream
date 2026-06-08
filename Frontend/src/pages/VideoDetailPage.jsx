import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI, likeAPI, commentAPI, subscriptionAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import { formatViews, formatDate } from '../utils/formatters';

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const { user } = useAuthStore();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const fetchVideoDetails = async () => {
    setIsLoading(true);
    try {
      const response = await videoAPI.getVideoById(videoId);
      const videoData = response.data.data;
      setVideo(videoData);
      setIsLiked(videoData.isLiked || false);
      setIsSubscribed(videoData.isSubscribed || false);
      // Fetch comments
      const commentsResponse = await commentAPI.getVideoComments(videoId, 30);
      setComments(commentsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.toggleVideoLike(videoId);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      await subscriptionAPI.toggleSubscription(video.owner._id);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="aspect-video skeleton rounded-2xl mb-6" />
          <div className="space-y-3">
            <div className="h-8 skeleton rounded-lg w-3/4" />
            <div className="h-5 skeleton rounded-lg w-1/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24">
          <p style={{ color: 'var(--text-secondary)' }}>Video not found</p>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-2 text-sm">Go Home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto" id="video-detail">
        {/* Video Player */}
        <div className="bg-black rounded-2xl overflow-hidden mb-6 aspect-video shadow-card-hover">
          <video
            src={video.videoFile}
            controls
            autoPlay
            poster={video.thumbnail}
            className="w-full h-full"
            id="video-player"
          />
        </div>

        {/* Video Info */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>{video.title}</h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <Link to={`/channel/${video.owner?.username}`}>
                <img
                  src={video.owner?.avatar}
                  alt={video.owner?.username}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                />
              </Link>
              <div>
                <Link to={`/channel/${video.owner?.username}`} className="font-semibold text-sm hover:text-accent-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {video.owner?.fullname || video.owner?.username}
                </Link>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{video.owner?.username}</p>
              </div>
              {user?._id !== video.owner?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`ml-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isSubscribed
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                  id="subscribe-btn"
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isLiked ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20' : 'btn-secondary'
                }`}
                id="like-btn"
              >
                <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isLiked ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>

          {/* Views & Date */}
          <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatViews(video.views)} views
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>

          {/* Description */}
          {video.description && (
            <div className="mt-4 glass-card rounded-xl p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{video.description}</p>
            </div>
          )}
        </div>

        {/* Comments */}
        <CommentSection videoId={videoId} comments={comments} onCommentAdded={fetchVideoDetails} />
      </div>
    </Layout>
  );
};

export default VideoDetailPage;
