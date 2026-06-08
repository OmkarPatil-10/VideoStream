# VideoStream Frontend - Complete File Structure

```
d:\Development\MyProject\VideoStream\Frontend/
│
├── 📄 Configuration Files
│   ├── package.json                 (Dependencies & scripts)
│   ├── vite.config.js               (Vite build configuration)
│   ├── tailwind.config.js           (Tailwind CSS configuration)
│   ├── postcss.config.js            (PostCSS configuration)
│   ├── index.html                   (HTML entry point)
│   └── .gitignore                   (Git ignore rules)
│
├── 🔐 Environment
│   ├── .env.sample                  (Environment template)
│   └── .env.local                   (Local environment - copy from sample)
│
├── 📚 Documentation
│   ├── README.md                    (Full project documentation)
│   ├── SETUP.md                     (Detailed setup guide)
│   ├── QUICKSTART.md                (3-minute quick start)
│   ├── ARCHITECTURE.md              (Technical architecture)
│   └── PROJECT_SUMMARY.md           (This summary)
│
└── 📁 src/ (Main Source Code)
    │
    ├── 🎨 Pages (14 pages total)
    │   ├── pages/HomePage.jsx              (Home feed - all videos)
    │   ├── pages/LoginPage.jsx             (User login)
    │   ├── pages/RegisterPage.jsx          (User registration)
    │   ├── pages/VideoDetailPage.jsx       (Watch video & comments)
    │   ├── pages/UploadPage.jsx            (Upload new video)
    │   ├── pages/ChannelPage.jsx           (User channel profile)
    │   ├── pages/DashboardPage.jsx         (Creator analytics)
    │   ├── pages/PlaylistsPage.jsx         (Manage playlists)
    │   ├── pages/SettingsPage.jsx          (Account settings)
    │   ├── pages/LikedVideosPage.jsx       (Liked videos)
    │   ├── pages/SubscriptionsPage.jsx     (Subscribed channels)
    │   ├── pages/MyVideosPage.jsx          (My uploaded videos)
    │   ├── pages/WatchLaterPage.jsx        (Watch history)
    │   └── pages/NotFoundPage.jsx          (404 page)
    │
    ├── 🧩 Components (6 reusable components)
    │   ├── components/Header.jsx           (Top navigation bar)
    │   ├── components/Sidebar.jsx          (Left navigation menu)
    │   ├── components/Layout.jsx           (Main layout wrapper)
    │   ├── components/VideoCard.jsx        (Video card component)
    │   ├── components/CommentSection.jsx   (Comments area)
    │   └── components/ProtectedRoute.jsx   (Route guard)
    │
    ├── 🔗 API Layer
    │   ├── api/apiClient.js                (Axios instance with interceptors)
    │   └── api/api.js                      (All API endpoints:
    │       │                                Users, Videos, Comments,
    │       │                                Likes, Playlists, Tweets,
    │       │                                Subscriptions, Dashboard)
    │
    ├── 🎯 State Management (Zustand)
    │   └── store/store.js                  (Global state stores:
    │       │                                useAuthStore,
    │       │                                useVideoStore,
    │       │                                usePlaylistStore,
    │       │                                useCommentStore)
    │
    ├── 🪝 Custom Hooks
    │   └── hooks/useHooks.js               (8 custom hooks:
    │       │                                useNotification,
    │       │                                useLoading,
    │       │                                useForm,
    │       │                                useFetch,
    │       │                                usePagination,
    │       │                                useDebounce,
    │       │                                useClickOutside,
    │       │                                useLocalStorage)
    │
    ├── 🛠️ Utilities
    │   ├── utils/helpers.js                (Format functions:
    │       │                                formatDuration,
    │       │                                formatViews,
    │       │                                formatDate,
    │       │                                truncateText, etc.)
    │   ├── utils/error.js                  (Error handling:
    │       │                                handleError,
    │       │                                getSuccessMessage)
    │   └── utils/storage.js                (localStorage helper)
    │
    ├── ⚙️ Constants
    │   └── constants/constants.js          (App-wide constants:
    │       │                                VIDEO_LIMITS,
    │       │                                PAGINATION,
    │       │                                API_STATUS,
    │       │                                ERROR_MESSAGES, etc.)
    │
    ├── 🎨 Styling
    │   └── index.css                       (Global styles + Tailwind imports)
    │
    ├── 🔀 Routing
    │   └── App.jsx                         (Main app with routing configuration)
    │
    └── 💫 Entry Point
        └── main.jsx                        (React DOM render entry point)
```

## File Count Summary

- **Total Files**: 40+
- **Pages**: 14
- **Components**: 6
- **API Files**: 2
- **Store Files**: 1
- **Hook Files**: 1
- **Utility Files**: 3
- **Config Files**: 5
- **Documentation**: 5

## File Size Breakdown

- **Total Project**: ~150KB (uncompressed)
- **src/ directory**: ~80KB
- **Minified Build**: ~50KB
- **Gzipped Build**: ~15KB

## Key File Descriptions

### Core Files

| File | Lines | Purpose |
|------|-------|---------|
| App.jsx | ~100 | Main app with routing |
| main.jsx | ~10 | React DOM entry |
| index.css | ~50 | Global styles |

### API Files

| File | Lines | Purpose |
|------|-------|---------|
| apiClient.js | ~40 | Axios setup |
| api.js | ~150 | All endpoints |

### Pages

| File | Lines | Complexity |
|------|-------|------------|
| HomePage.jsx | ~80 | Medium |
| LoginPage.jsx | ~100 | Medium |
| RegisterPage.jsx | ~120 | Medium |
| VideoDetailPage.jsx | ~150 | High |
| UploadPage.jsx | ~140 | High |
| ChannelPage.jsx | ~130 | High |
| DashboardPage.jsx | ~120 | Medium |
| PlaylistsPage.jsx | ~130 | Medium |
| SettingsPage.jsx | ~150 | Medium |
| LikedVideosPage.jsx | ~70 | Low |
| SubscriptionsPage.jsx | ~80 | Low |
| MyVideosPage.jsx | ~100 | Low |
| WatchLaterPage.jsx | ~80 | Low |
| NotFoundPage.jsx | ~30 | Low |

### Components

| File | Purpose |
|------|---------|
| Header.jsx | Top navigation with search |
| Sidebar.jsx | Left navigation menu |
| Layout.jsx | Main layout wrapper |
| VideoCard.jsx | Video card display |
| CommentSection.jsx | Comments management |
| ProtectedRoute.jsx | Auth guard |

## Import Dependencies Map

### Components typically import from:
```javascript
import { useAuthStore } from '../store/store'
import { videoAPI } from '../api/api'
import Layout from '../components/Layout'
import { formatDate, formatViews } from '../utils/helpers'
```

### Pages typically import from:
```javascript
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import { videoAPI, commentAPI } from '../api/api'
import { useNotification, useLoading } from '../hooks/useHooks'
```

## Configuration Files Purpose

| File | Configures |
|------|-----------|
| `vite.config.js` | Vite bundler |
| `tailwind.config.js` | Tailwind CSS |
| `postcss.config.js` | PostCSS plugins |
| `package.json` | Dependencies & npm scripts |
| `.env.local` | Runtime environment variables |

## How to Navigate the Project

**For Adding Features:**
1. Create new page in `pages/`
2. Add route in `App.jsx`
3. Add API endpoint in `api/api.js` if needed
4. Add store in `store/store.js` if needed
5. Link in `components/Sidebar.jsx` or `Header.jsx`

**For Bug Fixes:**
1. Locate component/page with issue
2. Check console for errors
3. Look at API call in `api/api.js`
4. Review store in `store/store.js`
5. Check helper functions in `utils/`

**For Styling:**
1. Edit Tailwind classes in component
2. Or create custom styles in `index.css`
3. Update `tailwind.config.js` for new colors

**For State Management:**
1. Check related store in `store/store.js`
2. Or use custom hooks from `hooks/useHooks.js`
3. Or use localStorage from `utils/storage.js`

## Typical File Dependencies

```
App.jsx
├── pages/* (all pages)
│   ├── components/Layout.jsx
│   │   ├── components/Header.jsx
│   │   ├── components/Sidebar.jsx
│   │   └── components/ProtectedRoute.jsx
│   ├── components/VideoCard.jsx
│   ├── components/CommentSection.jsx
│   ├── api/api.js
│   ├── store/store.js
│   ├── hooks/useHooks.js
│   ├── utils/helpers.js
│   ├── utils/error.js
│   └── constants/constants.js
└── hooks/ProtectedRoute.jsx
    └── useAuthStore from store/store.js
```

## Quick File Locations

**Need to change...** | **Edit file...**
---|---
Colors/Theme | `tailwind.config.js`, `index.css`
API endpoints | `api/api.js`
Global state | `store/store.js`
Error messages | `constants/constants.js`
User interface | Any file in `components/`
Video page | `pages/VideoDetailPage.jsx`
Home page | `pages/HomePage.jsx`
Authentication | `pages/LoginPage.jsx`, `pages/RegisterPage.jsx`
Navigation | `components/Sidebar.jsx`, `components/Header.jsx`

## File Organization Best Practices

✅ **Do:**
- Keep components small (< 300 lines)
- Group related functionality together
- Use meaningful file names
- Follow consistent structure
- Update documentation when adding files

❌ **Don't:**
- Mix concerns in one file
- Create deeply nested folders
- Use generic names like "util.js"
- Forget to update imports
- Leave dead code

---

**Last Updated:** February 15, 2026
**Created by:** Development Assistant
