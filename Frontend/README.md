# VideoStream Frontend

A modern, YouTube-like video streaming platform frontend built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication**
  - Registration with profile picture and cover image
  - Login with email/username
  - Account settings and profile management

- **Video Management**
  - Browse and search videos
  - Upload videos with thumbnails
  - Edit and delete videos
  - View video details and comments

- **Social Features**
  - Like/Unlike videos
  - Subscribe to channels
  - Add comments to videos
  - Create and manage playlists
  - View user profiles and channels

- **Dashboard**
  - View channel statistics
  - Manage your videos
  - Track views and subscribers

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.sample .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/                 # API client and endpoints
├── components/          # Reusable components
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Layout.jsx
│   ├── VideoCard.jsx
│   ├── CommentSection.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── VideoDetailPage.jsx
│   ├── UploadPage.jsx
│   ├── ChannelPage.jsx
│   ├── DashboardPage.jsx
│   ├── PlaylistsPage.jsx
│   ├── SettingsPage.jsx
│   └── LikedVideosPage.jsx
├── store/              # Zustand stores
└── App.jsx             # Main app component
```

## Features Overview

### Authentication
- User registration with avatar and cover image upload
- Secure login with JWT tokens
- Password change functionality
- Account settings management

### Video Management
- Upload videos with custom thumbnails
- View video details, published date, and statistics
- Edit video information
- Delete videos
- Toggle video publish status

### Social Interactions
- Like/unlike videos, comments, and tweets
- Subscribe to channels
- Add and manage comments
- Create and organize playlists

### User Profiles
- View user channel profiles
- See subscriber count and video count
- Browse channel videos and playlists
- Edit own channel information

### Dashboard
- View channel statistics (views, subscribers, likes)
- Manage uploaded videos
- Quick edit and delete options

## API Integration

The frontend connects to a Node.js/Express backend with the following endpoints:

- **Users**: `/api/v1/users/*`
- **Videos**: `/api/v1/videos/*`
- **Comments**: `/api/v1/comments/*`
- **Likes**: `/api/v1/likes/*`
- **Playlists**: `/api/v1/playlists/*`
- **Tweets**: `/api/v1/tweets/*`
- **Subscriptions**: `/api/v1/subscriptions/*`
- **Dashboard**: `/api/v1/dashboard/*`

## License

ISC
