# VideoStream Frontend - Project Architecture & Documentation

## Project Overview

VideoStream Frontend is a modern, YouTube-like video streaming platform built with React 18, Vite, and Tailwind CSS. It provides a complete user experience for uploading, viewing, and sharing videos with social features like comments, likes, subscriptions, and playlists.

## Technology Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | 18.2.0 |
| **Vite** | Build Tool | 5.0.8 |
| **React Router** | Routing | 6.20.0 |
| **Zustand** | State Management | 4.4.1 |
| **Axios** | HTTP Client | 1.6.2 |
| **Tailwind CSS** | Styling | 3.3.6 |
| **PostCSS** | CSS Processing | 8.4.32 |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      App.jsx (Router Setup)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Layout Component                        │   │
│  │  ┌──────────────┐            ┌──────────────┐           │   │
│  │  │  Header.jsx  │            │ Sidebar.jsx  │           │   │
│  │  └──────────────┘            └──────────────┘           │   │
│  │         ▲                          ▲                     │   │
│  │         └──────────────┬───────────┘                     │   │
│  │                        │                                 │   │
│  │  ┌─────────────────────────────────┐                    │   │
│  │  │      Page Components            │                    │   │
│  │  │  (HomePage, VideoDetail, etc)   │                    │   │
│  │  └─────────────────────────────────┘                    │   │
│  │                        │                                 │   │
│  │  ┌─────────────────────────────────┐                    │   │
│  │  │   Reusable Components           │                    │   │
│  │  │  (VideoCard, CommentSection)    │                    │   │
│  │  └─────────────────────────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ API Layer  │  │ Zustand    │  │ Utilities  │  │ Hooks      │ │
│  │ (api.js)   │  │ (store.js) │  │ (helpers)  │  │ (useHooks) │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
│         │              │                                         │
└─────────┼──────────────┼─────────────────────────────────────────┘
          │              │
          ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)                       │
│  Base URL: http://localhost:8000/api/v1                          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Interaction** → Component triggers action
2. **Custom Hooks** → Manages local state and loading
3. **Zustand Store** → Updates global state
4. **API Call** → axios makes request to backend
5. **Response Handling** → Updates store and component state
6. **UI Re-render** → Component displays updated data

## Folder Structure & Responsibilities

### `/src/api/`
- **apiClient.js** - Axios instance with request/response interceptors
- **api.js** - All API endpoint methods organized by module

### `/src/components/`
- **Header.jsx** - Top navigation with search and user menu
- **Sidebar.jsx** - Navigation menu with main sections
- **Layout.jsx** - Main layout wrapper combining Header and Sidebar
- **VideoCard.jsx** - Reusable video card component
- **CommentSection.jsx** - Comments display and input
- **ProtectedRoute.jsx** - Route guard for authenticated pages

### `/src/pages/`
- **HomePage.jsx** - Home feed with all videos
- **LoginPage.jsx** - User login form
- **RegisterPage.jsx** - User registration form
- **VideoDetailPage.jsx** - Full video player and details
- **UploadPage.jsx** - Video upload form
- **ChannelPage.jsx** - User channel profile
- **DashboardPage.jsx** - Creator dashboard with analytics
- **PlaylistsPage.jsx** - Playlist management
- **SettingsPage.jsx** - Account settings
- **LikedVideosPage.jsx** - Liked videos collection
- **SubscriptionsPage.jsx** - Subscribed channels
- **MyVideosPage.jsx** - User's uploaded videos
- **WatchLaterPage.jsx** - Watch history

### `/src/store/`
- **store.js** - Zustand stores for auth, videos, playlists, comments

### `/src/utils/`
- **helpers.js** - Format functions (date, views, duration, file size)
- **error.js** - Error handling and messages
- **storage.js** - Local storage utilities

### `/src/hooks/`
- **useHooks.js** - Custom React hooks (useForm, useFetch, usePagination, etc.)

### `/src/constants/`
- **constants.js** - Application constants and config values

## State Management with Zustand

### useAuthStore
```javascript
{
  user: User | null,
  accessToken: string | null,
  isLoading: boolean,
  setUser: (user) => void,
  setAccessToken: (token) => void,
  setLoading: (bool) => void,
  logout: () => void,
  isAuthenticated: () => boolean
}
```

### useVideoStore
```javascript
{
  videos: Video[],
  currentVideo: Video | null,
  isLoading: boolean,
  setVideos: (videos) => void,
  setCurrentVideo: (video) => void,
  setLoading: (bool) => void,
  addVideo: (video) => void,
  updateVideo: (id, video) => void,
  deleteVideo: (id) => void
}
```

### usePlaylistStore & useCommentStore
Similar structure for playlist and comment management.

## Authentication Flow

```
User enters credentials
        ↓
LoginPage validates input
        ↓
API call to /users/login
        ↓
Backend validates and returns user + token
        ↓
Store token in localStorage
        ↓
Store user in Zustand
        ↓
Redirect to home page
        ↓
ProtectedRoute checks authentication
        ↓
Request includes Authorization header with token
```

## Video Upload Flow

```
User selects files (video + thumbnail)
        ↓
UploadPage validates file size and format
        ↓
Create FormData with files and metadata
        ↓
API call to /videos (POST)
        ↓
Backend processes and uploads to Cloudinary
        ↓
Video data stored in database
        ↓
Response contains new video object
        ↓
Redirect to video page or dashboard
```

## Comment System Flow

```
User clicks video comment
        ↓
CommentSection fetches existing comments
        ↓
Display comments in order
        ↓
User enters comment text
        ↓
API call to /comments/{videoId} (POST)
        ↓
New comment added to store
        ↓
UI re-renders with new comment
        ↓
User can edit/delete own comments
```

## API Request Interceptor

```javascript
// Automatically adds token to every request
headers.Authorization = `Bearer ${token}`

// Handles 401 Unauthorized
if (status === 401) {
  Clear storage
  Redirect to login
}
```

## Styling Architecture

### Tailwind CSS Configuration
- Dark theme optimized for video platform
- Custom color palette (dark-50 to dark-950)
- Red accent color for CTAs

### Class Naming Convention
```
- Component wrapper: `flex items-center justify-between`
- Cards: `bg-dark-800 rounded-lg hover:shadow-lg`
- Text: `text-white text-sm` or `text-dark-400 text-xs`
- Buttons: `px-6 py-2 bg-red-600 hover:bg-red-700 transition`
```

## Custom Hooks Usage

### useForm Hook
```javascript
const { formData, errors, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  async (data, setErrors) => {
    // Handle submission
  }
);
```

### useFetch Hook
```javascript
const { data, isLoading, error, refetch } = useFetch(
  () => videoAPI.getAllVideos(),
  []
);
```

### usePagination Hook
```javascript
const { currentPage, totalPages, currentItems, nextPage, prevPage } = 
  usePagination(videos, 12);
```

## Error Handling Strategy

1. **Request Level** - Caught by axios interceptors
2. **API Level** - Try-catch blocks in components
3. **User Level** - Error notifications/messages
4. **Validation Level** - Form validation before submission
5. **Fallback Level** - User-friendly default messages

## Performance Optimizations

1. **Code Splitting** - React Router lazy loading
2. **Image Optimization** - Proper sizing and formats
3. **State Optimization** - Zustand for global state (no prop drilling)
4. **Memoization** - React.memo for expensive components
5. **Debouncing** - Search input debouncing
6. **Lazy Loading** - Images and list virtualization (future)

## Security Considerations

1. **JWT Storage** - Stored in localStorage (could use httpOnly cookies)
2. **CORS** - Configured in backend
3. **Input Validation** - Both client and server-side
4. **XSS Protection** - React's built-in XSS protection
5. **CSRF** - Token-based when needed

## Component Communication

```
Pages <--Router--> App
  ↓
Layout (Header + Sidebar + Pages)
  ↓
Components receive data via:
- Props (for page props)
- Hooks (useAuth, useVideo stores)
- Route params (useParams)
- Context (via Zustand)
```

## File Upload Flow

```
User selects file → validate size/type
                 ↓
Create FormData with file
                 ↓
Send to backend (multipart/form-data)
                 ↓
Backend uploads to Cloudinary
                 ↓
Return URL in response
                 ↓
Store URL in database
                 ↓
Display in UI
```

## Future Architecture Enhancements

1. **Redux DevTools** - For better state debugging
2. **React Query** - For advanced data fetching
3. **Web Workers** - For heavy computations
4. **Service Workers** - For offline support
5. **WebSockets** - For real-time features
6. **Error Boundary** - For error handling component
7. **Storybook** - For component documentation

## Development Workflow

1. Feature branch from main
2. Create/update API methods if needed
3. Create/update store if needed
4. Create page or component
5. Add routing if page
6. Style with Tailwind
7. Test with browser devtools
8. Commit and create PR

## Deployment Considerations

1. **Build** - `npm run build` creates optimized dist/
2. **Environment** - Set `VITE_API_URL` in production
3. **Hosting** - Can be deployed to Vercel, Netlify, etc.
4. **CORS** - Configure backend CORS for frontend domain
5. **HTTPS** - Required for production security
6. **CSP** - Configure Content Security Policy headers

## Debugging Tips

1. Use React DevTools Browser Extension
2. Check Network tab for API requests
3. Use Console for JavaScript errors
4. Check stored data in localStorage
5. Use Zustand DevTools for state debugging
6. Monitor Performance in DevTools

---

**Last Updated:** February 2026
**Maintainer:** Development Team
