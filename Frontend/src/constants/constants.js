// Video related constants
export const VIDEO_LIMITS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_FILE_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  SUPPORTED_FORMATS: ['video/mp4', 'video/webm', 'video/mpeg'],
  THUMBNAIL_MIN_WIDTH: 1280,
  THUMBNAIL_MIN_HEIGHT: 720,
};

// Pagination
export const PAGINATION = {
  VIDEOS_PER_PAGE: 12,
  COMMENTS_PER_PAGE: 10,
  PLAYLISTS_PER_PAGE: 12,
};

// API Status
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  MOST_VIEWED: 'mostViewed',
  MOST_LIKED: 'mostLiked',
  TRENDING: 'trending',
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'thisWeek',
  THIS_MONTH: 'thisMonth',
  THIS_YEAR: 'thisYear',
};

// Video Status
export const VIDEO_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  UNLISTED: 'unlisted',
  PRIVATE: 'private',
};

// Http Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  PREFERENCES: 'preferences',
  RECENT_SEARCHES: 'recentSearches',
  WATCH_HISTORY: 'watchHistory',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UPLOAD_ERROR: 'Upload failed. Please try again.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  NOT_FOUND: 'Resource not found.',
  FORBIDDEN: 'You do not have permission to access this resource.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please log in.',
  UPLOAD_SUCCESS: 'Video uploaded successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  SUBSCRIBE_SUCCESS: 'Subscribed successfully!',
  COMMENT_SUCCESS: 'Comment added!',
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'MMMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
  SHORT: 'MM/dd/yyyy',
};
