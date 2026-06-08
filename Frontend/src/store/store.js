import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      // Apply/remove 'dark' class on <html>
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: next };
    }),
  initTheme: () => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: saved });
  },
}));

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isLoading: false,

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },

  isAuthenticated: () => {
    return !!get().accessToken && !!get().user;
  }
}));

export const useVideoStore = create((set) => ({
  videos: [],
  currentVideo: null,
  isLoading: false,
  pagination: null,

  setVideos: (videos) => set({ videos }),
  setPagination: (pagination) => set({ pagination }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setLoading: (isLoading) => set({ isLoading }),
  addVideo: (video) => set((state) => ({
    videos: [video, ...state.videos]
  })),
  updateVideo: (id, updatedVideo) => set((state) => ({
    videos: state.videos.map(v => v._id === id ? updatedVideo : v),
    currentVideo: state.currentVideo?._id === id ? updatedVideo : state.currentVideo
  })),
  deleteVideo: (id) => set((state) => ({
    videos: state.videos.filter(v => v._id !== id),
    currentVideo: state.currentVideo?._id === id ? null : state.currentVideo
  }))
}));

export const usePlaylistStore = create((set) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,

  setPlaylists: (playlists) => set({ playlists }),
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setLoading: (isLoading) => set({ isLoading }),
  addPlaylist: (playlist) => set((state) => ({
    playlists: [playlist, ...state.playlists]
  })),
  updatePlaylist: (id, updatedPlaylist) => set((state) => ({
    playlists: state.playlists.map(p => p._id === id ? updatedPlaylist : p),
    currentPlaylist: state.currentPlaylist?._id === id ? updatedPlaylist : state.currentPlaylist
  })),
  deletePlaylist: (id) => set((state) => ({
    playlists: state.playlists.filter(p => p._id !== id),
    currentPlaylist: state.currentPlaylist?._id === id ? null : state.currentPlaylist
  }))
}));

export const useCommentStore = create((set) => ({
  comments: [],
  isLoading: false,

  setComments: (comments) => set({ comments }),
  setLoading: (isLoading) => set({ isLoading }),
  addComment: (comment) => set((state) => ({
    comments: [comment, ...state.comments]
  })),
  updateComment: (id, updatedComment) => set((state) => ({
    comments: state.comments.map(c => c._id === id ? updatedComment : c)
  })),
  deleteComment: (id) => set((state) => ({
    comments: state.comments.filter(c => c._id !== id)
  }))
}));

export const useTweetStore = create((set) => ({
  tweets: [],
  isLoading: false,

  setTweets: (tweets) => set({ tweets }),
  setLoading: (isLoading) => set({ isLoading }),
  addTweet: (tweet) => set((state) => ({
    tweets: [tweet, ...state.tweets]
  })),
  updateTweet: (id, updatedTweet) => set((state) => ({
    tweets: state.tweets.map(t => t._id === id ? updatedTweet : t)
  })),
  deleteTweet: (id) => set((state) => ({
    tweets: state.tweets.filter(t => t._id !== id)
  }))
}));
