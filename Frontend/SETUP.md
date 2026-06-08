# Frontend Setup Guide

This is a complete getting started guide for the VideoStream Frontend project.

## Prerequisites

- Node.js 16+ and npm/yarn installed
- A running backend server (VideoStream Backend)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router DOM
- Axios for HTTP requests
- Zustand for state management
- Tailwind CSS for styling
- Vite as the build tool

### 2. Environment Configuration

Copy the environment sample file:
```bash
cp .env.sample .env.local
```

Edit `.env.local` and set your backend API URL:
```
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Project Structure

```
Frontend/
├── src/
│   ├── api/              # API clients and endpoints
│   │   ├── api.js        # All API methods
│   │   └── apiClient.js  # Axios instance with interceptors
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   ├── VideoCard.jsx
│   │   ├── CommentSection.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/            # Page components (routes)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VideoDetailPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── ChannelPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PlaylistsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── LikedVideosPage.jsx
│   │   ├── SubscriptionsPage.jsx
│   │   ├── MyVideosPage.jsx
│   │   ├── WatchLaterPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/            # Zustand state management
│   │   └── store.js      # Global state stores
│   ├── utils/            # Utility functions
│   │   ├── helpers.js    # Format and utility functions
│   │   ├── error.js      # Error handling utilities
│   │   └── storage.js    # Local storage helpers
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # React DOM entry point
│   └── index.css         # Global styles with Tailwind imports
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Available Routes

### Public Routes
- `/login` - User login page
- `/register` - User registration page

### Protected Routes (requires authentication)
- `/` - Home page (video feed)
- `/video/:videoId` - Video detail page
- `/upload` - Upload new video page
- `/channel/:username` - User channel profile
- `/dashboard` - Channel analytics dashboard
- `/playlists` - User playlists
- `/settings` - Account settings
- `/liked-videos` - Liked videos collection
- `/subscriptions` - Subscribed channels
- `/my-videos` - User uploaded videos
- `/watch-later` - Watch history

## Features Implemented

### Authentication
- ✅ User Registration with avatar and cover image
- ✅ User Login with email/username
- ✅ Protected routes with JWT validation
- ✅ Auto-logout on unauthorized access
- ✅ Account settings and password change

### Video Management
- ✅ Browse and search videos
- ✅ Upload videos with custom thumbnails
- ✅ View video details and stats
- ✅ Edit video information
- ✅ Delete videos
- ✅ Toggle publish status

### Social Features
- ✅ Like/Unlike videos
- ✅ Add/Edit/Delete comments
- ✅ Subscribe/Unsubscribe to channels
- ✅ Create/Edit/Delete playlists
- ✅ Add videos to playlists
- ✅ View user profiles

### Dashboard & Analytics
- ✅ View channel statistics
- ✅ Track video performance
- ✅ Manage channel videos
- ✅ Subscriber management

## Available npm Commands

### Development
```bash
npm run dev
```
Start the development server with hot module replacement.

### Building for Production
```bash
npm run build
```
Create an optimized production build.

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally.

## API Integration

The frontend connects to the backend at the following endpoints:

### User Management
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user
- `GET /users/current-user` - Get logged-in user
- `PATCH /users/update-account` - Update account details
- `PATCH /users/avatar` - Update avatar
- `PATCH /users/cover-image` - Update cover image
- `POST /users/change-password` - Change password
- `GET /users/c/:username` - Get user channel profile
- `GET /users/history` - Get watch history

### Video Management
- `GET /videos` - Get all videos
- `POST /videos` - Upload new video
- `GET /videos/:videoId` - Get video details
- `PATCH /videos/:videoId` - Update video
- `DELETE /videos/:videoId` - Delete video
- `PATCH /videos/toggle/publish/:videoId` - Toggle publish status

### Comments
- `GET /comments/:videoId` - Get video comments
- `POST /comments/:videoId` - Add comment
- `PATCH /comments/c/:commentId` - Update comment
- `DELETE /comments/c/:commentId` - Delete comment

### Likes
- `POST /likes/toggle/v/:videoId` - Toggle video like
- `POST /likes/toggle/c/:commentId` - Toggle comment like
- `POST /likes/toggle/t/:tweetId` - Toggle tweet like
- `GET /likes/videos` - Get liked videos

### Playlists
- `POST /playlists` - Create playlist
- `GET /playlists/:playlistId` - Get playlist
- `PATCH /playlists/:playlistId` - Update playlist
- `DELETE /playlists/:playlistId` - Delete playlist
- `PATCH /playlists/add/:videoId/:playlistId` - Add video to playlist
- `PATCH /playlists/remove/:videoId/:playlistId` - Remove video from playlist
- `GET /playlists/user/:userId` - Get user playlists

### Subscriptions
- `POST /subscriptions/c/:channelId` - Toggle subscription
- `GET /subscriptions/c/:channelId` - Get channel subscribers
- `GET /subscriptions/u/:subscriberId` - Get subscribed channels

### Dashboard
- `GET /dashboard/stats` - Get channel statistics
- `GET /dashboard/videos` - Get channel videos

## State Management

The app uses Zustand for global state management:

### Stores
- `useAuthStore` - Authentication state (user, token, login/logout)
- `useVideoStore` - Video data state
- `usePlaylistStore` - Playlist state
- `useCommentStore` - Comment state

## Styling

The project uses Tailwind CSS with custom configuration:
- Dark theme optimized for YouTube-like interface
- Custom color palette with red accents
- Responsive design for mobile and desktop
- Custom scrollbar styling

## Error Handling

- Automatic error messages for API failures
- Unauthorized request handling with auto-logout
- User-friendly error notifications
- Request/response interceptors for error handling

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Image optimization with proper sizing
- Efficient state updates with Zustand
- Debouncing and throttling for search

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 15+
- Opera 74+

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on the correct port
- Check `VITE_API_URL` in `.env.local`
- Verify CORS settings in backend

### Videos not showing
- Check if backend API is returning video data
- Verify user is authenticated
- Check browser console for errors

### Upload failing
- Verify file size is under 2GB
- Check file format is supported (MP4, WebM)
- Ensure backend file upload is configured

## Future Enhancements

- Search functionality
- Video recommendations algorithm
- Real-time notifications
- Live streaming support
- Mobile app (React Native)
- Dark/Light theme toggle
- Internationalization (i18n)
- Advanced analytics

## Support & Documentation

For issues or questions:
1. Check the FAQ section
2. Review API documentation
3. Check backend logs for errors
4. Use browser developer tools

## License

ISC
