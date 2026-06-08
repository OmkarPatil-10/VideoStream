import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userAPI, videoAPI, subscriptionAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { formatViews } from '../utils/formatters';

const ChannelPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchChannelData();
  }, [username]);

  const fetchChannelData = async () => {
    setIsLoading(true);
    try {
      const channelRes = await userAPI.getChannelProfile(username);
      const channelData = channelRes.data.data;
      setChannel(channelData);
      setIsSubscribed(channelData.isSubscribed || false);

      // Fetch channel videos
      try {
        const videosRes = await videoAPI.getAllVideos('', 20, 1, 'createdAt', 'desc');
        // Filter to only show this channel's videos
        const channelVideos = (videosRes.data.data.videos || []).filter(
          v => v.owner?.username === username || v.owner?._id === channelData._id
        );
        setVideos(channelVideos);
      } catch (e) {
        console.error('Error fetching channel videos:', e);
      }
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!channel?._id) return;
    try {
      await subscriptionAPI.toggleSubscription(channel._id);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="h-48 md:h-56 skeleton rounded-2xl mb-6" />
          <div className="flex gap-6 mb-8">
            <div className="w-28 h-28 rounded-2xl skeleton -mt-14" />
            <div className="space-y-3 flex-1 pt-2">
              <div className="h-8 w-48 skeleton rounded-lg" />
              <div className="h-4 w-32 skeleton rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!channel) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24">
          <p style={{ color: 'var(--text-secondary)' }} className="mb-4">Channel not found</p>
          <Link to="/" className="text-accent-400 hover:text-accent-300 text-sm">Go Home</Link>
        </div>
      </Layout>
    );
  }

  const isOwner = currentUser?._id === channel._id;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Cover Image */}
        <div className="h-48 md:h-56 rounded-2xl overflow-hidden mb-6 relative">
          {channel.coverImage ? (
            <img src={channel.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-accent-700/50 via-dark-800 to-accent-900/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Channel Info */}
        <div className="flex flex-col md:flex-row gap-5 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <img
            src={channel.avatar}
            alt={channel.username}
            className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 border-4 border-dark-950 -mt-16 relative z-10 ring-2 ring-white/10"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{channel.fullname || channel.username}</h1>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>@{channel.username}</p>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{channel.subscriberCount || 0}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Subscribers</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{channel.channelsSusbscribedToCount || 0}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Subscribed</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {isOwner ? (
              <button onClick={() => navigate('/settings')} className="px-5 py-2.5 btn-secondary rounded-xl text-sm">
                Edit Channel
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isSubscribed ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>

        {/* Videos */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Videos</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No videos yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChannelPage;
