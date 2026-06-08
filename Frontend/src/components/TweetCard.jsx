import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tweetAPI, likeAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import { formatTimeAgo } from '../utils/formatters';

const TweetCard = ({ tweet, onUpdated, onDeleted }) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const isOwner = user?._id === (tweet.owner?._id || tweet.owner);

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent.trim() === tweet.content) return;
    setIsLoading(true);
    try {
      await tweetAPI.updateTweet(tweet._id, editContent.trim());
      setIsEditing(false);
      onUpdated?.();
    } catch (error) {
      console.error('Error updating tweet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this tweet?')) return;
    try {
      await tweetAPI.deleteTweet(tweet._id);
      onDeleted?.();
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.toggleTweetLike(tweet._id);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  const ownerData = tweet.owner || {};

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in" id={`tweet-${tweet._id}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/channel/${ownerData.username}`} className="flex-shrink-0">
          {ownerData.avatar ? (
            <img src={ownerData.avatar} alt={ownerData.username} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center font-bold text-sm">
              {ownerData.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={`/channel/${ownerData.username}`} className="font-semibold text-sm hover:text-accent-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                {ownerData.fullname || ownerData.username}
              </Link>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>@{ownerData.username}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(tweet.createdAt)}</span>
            </div>

            {/* Owner actions */}
            {isOwner && !isEditing && (
              <div className="flex gap-1">
                <button onClick={() => setIsEditing(true)} className="p-1.5 btn-ghost rounded-lg text-dark-400 hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={handleDelete} className="p-1.5 btn-ghost rounded-lg text-dark-400 hover:text-accent-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input-field text-sm resize-none"
                rows="3"
                maxLength={500}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button onClick={() => { setIsEditing(false); setEditContent(tweet.content); }} className="px-3 py-1.5 btn-ghost text-xs rounded-lg">
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={isLoading} className="px-3 py-1.5 btn-primary text-xs rounded-lg">
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{tweet.content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-accent-400' : 'hover:text-accent-400'}`}
              style={liked ? {} : { color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {liked ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
