import React, { useEffect, useState } from 'react';
import { tweetAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';
import TweetCard from '../components/TweetCard';

const MyTweetsPage = () => {
  const { user } = useAuthStore();
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTweet, setNewTweet] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (user?._id) fetchMyTweets();
  }, [user]);

  const fetchMyTweets = async () => {
    setIsLoading(true);
    try {
      const response = await tweetAPI.getUserTweets(user._id);
      setTweets(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setTweets([]);
      } else {
        console.error('Error fetching your tweets:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;
    setIsPosting(true);
    try {
      await tweetAPI.createTweet(newTweet.trim());
      setNewTweet('');
      fetchMyTweets();
    } catch (error) {
      console.error('Error posting tweet:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your Tweets
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your tweets</p>
        </div>

        {/* Compose Tweet */}
        <form onSubmit={handlePostTweet} className="glass-card rounded-xl p-4 mb-6" id="compose-my-tweet">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-sm focus:outline-none resize-none"
                style={{ color: 'var(--text-primary)' }}
                rows="3"
                maxLength={500}
                id="my-tweet-input"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{newTweet.length}/500</span>
                <button
                  type="submit"
                  disabled={!newTweet.trim() || isPosting}
                  className="px-5 py-2 btn-primary text-sm rounded-xl disabled:opacity-40"
                  id="post-my-tweet-btn"
                >
                  {isPosting ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Posting...
                    </span>
                  ) : 'Post Tweet'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Stats */}
        {!isLoading && tweets.length > 0 && (
          <div className="glass-card rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>You have <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{tweets.length}</span> tweet{tweets.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Tweets List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton rounded" />
                    <div className="h-3 w-full skeleton rounded" />
                    <div className="h-3 w-3/4 skeleton rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard
                key={tweet._id}
                tweet={tweet}
                onUpdated={fetchMyTweets}
                onDeleted={fetchMyTweets}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You haven't posted any tweets yet. Share your first thought!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTweetsPage;
