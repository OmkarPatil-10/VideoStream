import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration, formatViews, formatTimeAgo } from '../utils/formatters';

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <Link to={`/video/${video._id}`} className="video-card group rounded-xl overflow-hidden block" id={`video-card-${video._id}`}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold text-white">
          {formatDuration(video.duration)}
        </div>
        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <svg className="w-5 h-5 text-dark-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 p-3">
        {video.owner?.avatar && (
          <img
            src={video.owner.avatar}
            alt={video.owner?.username}
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug group-hover:text-accent-300 transition-colors"
              style={{ color: 'var(--text-primary)' }}>
            {video.title}
          </h3>
          <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
            {video.owner?.username || video.owner?.fullName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
