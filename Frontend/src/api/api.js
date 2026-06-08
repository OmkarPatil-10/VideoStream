import apiClient from './apiClient';

// ==================== User APIs ====================
export const userAPI = {
  register: (data) => apiClient.post('/users/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  login: (data) => apiClient.post('/users/login', data),
  logout: () => apiClient.post('/users/logout'),
  getCurrentUser: () => apiClient.get('/users/current-user'),
  updateAccount: (data) => apiClient.patch('/users/update-account', data),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCoverImage: (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    return apiClient.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getChannelProfile: (username) => apiClient.get(`/users/c/${username}`),
  getWatchHistory: () => apiClient.get('/users/history'),
  changePassword: (data) => apiClient.post('/users/change-password', data),
};

// ==================== Video APIs ====================
export const videoAPI = {
  getAllVideos: (query = '', limit = 10, page = 1, sortBy, sortType) =>
    apiClient.get('/videos', { params: { query, limit, page, sortBy, sortType } }),
  getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),
  publishVideo: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('videoFile', data.videoFile);
    formData.append('thumbnail', data.thumbnail);
    return apiClient.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateVideo: (videoId, data) => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    return apiClient.patch(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),
  togglePublishStatus: (videoId) => apiClient.patch(`/videos/toggle/publish/${videoId}`),
};

// ==================== Comment APIs ====================
export const commentAPI = {
  getVideoComments: (videoId, limit = 10, page = 1) =>
    apiClient.get(`/comments/${videoId}`, { params: { limit, page } }),
  addComment: (videoId, commentContent) =>
    apiClient.post(`/comments/${videoId}`, { commentContent }),
  updateComment: (commentId, commentContent) =>
    apiClient.patch(`/comments/c/${commentId}`, { commentContent }),
  deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),
};

// ==================== Like APIs ====================
export const likeAPI = {
  toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => apiClient.post(`/likes/toggle/c/${commentId}`),
  toggleTweetLike: (tweetId) => apiClient.post(`/likes/toggle/t/${tweetId}`),
  getLikedVideos: () => apiClient.get('/likes/videos'),
};

// ==================== Playlist APIs ====================
export const playlistAPI = {
  createPlaylist: (data) => apiClient.post('/playlists', data),
  getUserPlaylists: (userId) =>
    apiClient.get(`/playlists/user/${userId}`),
  getPlaylistById: (playlistId) => apiClient.get(`/playlists/${playlistId}`),
  updatePlaylist: (playlistId, data) => apiClient.patch(`/playlists/${playlistId}`, data),
  deletePlaylist: (playlistId) => apiClient.delete(`/playlists/${playlistId}`),
  addVideoToPlaylist: (videoId, playlistId) =>
    apiClient.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (videoId, playlistId) =>
    apiClient.patch(`/playlists/remove/${videoId}/${playlistId}`),
};

// ==================== Tweet APIs ====================
export const tweetAPI = {
  getAllTweets: () => apiClient.get('/tweets/all'),
  createTweet: (tweetContent) => apiClient.post('/tweets', { tweetContent }),
  getUserTweets: (userId) => apiClient.get(`/tweets/user/${userId}`),
  updateTweet: (tweetId, tweetContent) => apiClient.patch(`/tweets/${tweetId}`, { tweetContent }),
  deleteTweet: (tweetId) => apiClient.delete(`/tweets/${tweetId}`),
};

// ==================== Subscription APIs ====================
export const subscriptionAPI = {
  toggleSubscription: (channelId) => apiClient.post(`/subscriptions/c/${channelId}`),
  getSubscribedChannels: (subscriberId) => apiClient.get(`/subscriptions/u/${subscriberId}`),
  getChannelSubscribers: (channelId) => apiClient.get(`/subscriptions/c/${channelId}`),
};

// ==================== Dashboard APIs ====================
export const dashboardAPI = {
  getChannelStats: () => apiClient.get('/dashboard/stats'),
  getChannelVideos: (limit = 10, page = 1) =>
    apiClient.get('/dashboard/videos', { params: { limit, page } }),
};
