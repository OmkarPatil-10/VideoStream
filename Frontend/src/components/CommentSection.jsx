import React, { useState } from 'react';
import { commentAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import { formatTimeAgo } from '../utils/formatters';

const CommentSection = ({ videoId, comments = [], onCommentAdded }) => {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      await commentAPI.addComment(videoId, newComment.trim());
      setNewComment('');
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    setIsLoading(true);
    try {
      await commentAPI.updateComment(commentId, editText.trim());
      setEditingId(null);
      setEditText('');
      onCommentAdded?.();
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm('Delete this comment?')) {
      try {
        await commentAPI.deleteComment(commentId);
        onCommentAdded?.();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const commentList = Array.isArray(comments) ? comments : (comments?.docs || []);

  return (
    <div className="mt-8" id="comments-section">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        {commentList.length} Comments
      </h3>

      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="mb-8 flex gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="input-field resize-none text-sm"
            rows="2"
            id="comment-input"
          />
          {newComment.trim() && (
            <div className="flex gap-2 mt-2 justify-end animate-slide-up">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="px-4 py-1.5 btn-ghost text-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-1.5 btn-primary text-sm rounded-lg"
                id="submit-comment-btn"
              >
                {isLoading ? 'Posting...' : 'Comment'}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-5">
        {commentList.map((comment) => (
          <div key={comment._id} className="flex gap-3 animate-fade-in" id={`comment-${comment._id}`}>
            <img
              src={comment.owner?.avatar}
              alt={comment.owner?.username}
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {comment.owner?.username}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input-field text-sm resize-none"
                    rows="2"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      disabled={isLoading}
                      className="px-3 py-1 btn-primary text-xs rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 btn-ghost text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
              )}

              {/* Actions */}
              {user?._id === comment.owner?._id && editingId !== comment._id && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => { setEditingId(comment._id); setEditText(comment.content); }}
                    className="text-xs transition-colors hover:text-accent-400" style={{ color: 'var(--text-muted)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-xs transition-colors hover:text-accent-400" style={{ color: 'var(--text-muted)' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
