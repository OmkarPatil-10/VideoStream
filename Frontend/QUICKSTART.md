# 🚀 Quick Start Guide - VideoStream Frontend

Get up and running with the VideoStream frontend in just 3 minutes!

## Prerequisites

✅ Node.js 16+ installed
✅ Backend server running on `http://localhost:8000`
✅ npm/yarn package manager

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```
This installs all required packages (React, Vite, Tailwind, etc.)

### Step 2: Configure Environment
```bash
cp .env.sample .env.local
```

Edit `.env.local` and ensure your backend URL is correct:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 3: Start Development Server
```bash
npm run dev
```

🎉 Open your browser to `http://localhost:5173` and you're ready!

## First Steps

### 1. Create an Account
- Click **Sign Up** on the login page
- Fill in your details
- Upload a profile picture (optional)
- Create your account

### 2. Upload Your First Video
- Click the **upload icon** (⬆️) in the header
- Select a video file
- Add title and description
- Upload a thumbnail
- Click **Publish Video**

### 3. Browse & Watch Videos
- Go to **Home** page to see all videos
- Click any video to watch and comment
- Subscribe to channels you like
- Create playlists to organize videos

## Key Features to Try

| Feature | How to Access | What It Does |
|---------|---------------|-------------|
| **Upload Video** | Header → Upload icon | Publish new videos |
| **Watch Videos** | Home page cards | Play videos and view comments |
| **Add Comments** | Video page → Comment box | Comment on videos |
| **Like Videos** | Video page → 👍 button | Save favorite videos |
| **Subscribe** | Channel page → Subscribe | Follow channels |
| **Create Playlist** | Sidebar → Playlists | Organize videos |
| **View Dashboard** | Sidebar → Dashboard | See analytics |
| **My Videos** | Sidebar → Your Videos | Manage your uploads |
| **Settings** | User menu → Settings | Update profile |

## Project Structure Quick Reference

```
Frontend/
├── src/
│   ├── pages/             # Page components (Login, Home, etc.)
│   ├── components/        # Reusable UI components
│   ├── api/              # API calls to backend
│   ├── store/            # Global state management
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom React hooks
│   ├── constants/        # App constants
│   └── App.jsx           # Main app with routing
├── index.html            # HTML entry point
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Install new package
npm install package-name

# Remove a package
npm uninstall package-name
```

## Common Workflows

### Uploading a Video
```
Home → Upload → Select Video & Thumbnail → Add Title & Description → Publish
```

### Watching & Commenting
```
Home → Click Video → Watch → Scroll Down → Add Comment
```

### Creating a Playlist
```
Sidebar → Playlists → Create Playlist → Add Videos
```

### Managing Your Channel
```
User Menu → My Channel → Edit → Update Profile
```

### Viewing Analytics
```
Sidebar → Dashboard → See Views, Subscribers, Likes
```

## Troubleshooting

### "Cannot connect to backend"
✅ Verify backend is running on `http://localhost:8000`
✅ Check `.env.local` has correct `VITE_API_URL`
✅ Check browser console for errors

### "Videos not loading"
✅ Ensure you're logged in
✅ Backend must have video data
✅ Clear browser cache and refresh

### "Upload fails"
✅ Check file size (max 2GB)
✅ Use MP4 or WebM format
✅ Browser console will show specific error

### "Page won't load"
✅ Try clearing cache: Ctrl+Shift+Delete
✅ Check console for JavaScript errors
✅ Restart dev server: Ctrl+C then `npm run dev`

## API Endpoints Used

The frontend connects to these backend endpoints:

```
Auth:
GET  /users/current-user
POST /users/login
POST /users/register
POST /users/logout

Videos:
GET  /videos                      # All videos
GET  /videos/:videoId             # Video details
POST /videos                       # Upload video
PATCH /videos/:videoId            # Edit video
DELETE /videos/:videoId           # Delete video

Comments:
GET  /comments/:videoId           # Get comments
POST /comments/:videoId           # Add comment
PATCH /comments/c/:commentId      # Edit comment
DELETE /comments/c/:commentId     # Delete comment

Subscriptions:
POST /subscriptions/c/:channelId  # Subscribe
GET  /subscriptions/u/:userId     # Get subscriptions

Likes:
POST /likes/toggle/v/:videoId     # Like video
GET  /likes/videos                # Liked videos

Playlists:
POST /playlists                   # Create playlist
GET  /playlists/user/:userId      # Get playlists
PATCH /playlists/:playlistId      # Edit playlist
DELETE /playlists/:playlistId     # Delete playlist

Dashboard:
GET  /dashboard/stats             # Channel statistics
GET  /dashboard/videos            # Channel videos
```

## File Size Limits

- Video file: max 2GB
- Thumbnail: min 1280x720 pixels
- Avatar: recommended 1:1 ratio
- Cover image: recommended 16:9 ratio
- Video title: max 100 characters
- Description: max 5000 characters

## Browser Support

✅ Chrome/Edge 88+
✅ Firefox 87+
✅ Safari 15+
✅ Opera 74+

## Performance Tips

1. **Use MP4 format** for better compatibility
2. **Compress thumbnails** before uploading
3. **Upload during off-peak** hours for faster processing
4. **Clear browser cache** if experiencing issues

## Keyboard Shortcuts

- `F12` - Open Developer Tools
- `Ctrl+K` - Search (if implemented)
- `Escape` - Close modals/menus

## Need Help?

1. **Check the README.md** for detailed documentation
2. **See SETUP.md** for installation guide
3. **Check ARCHITECTURE.md** for technical details
4. **Look at browser console** for error messages
5. **Check backend logs** for API errors

## Next Steps

After getting familiar with the app:

1. ✅ Explore UI and features
2. ✅ Upload a test video
3. ✅ Test comments and likes
4. ✅ Create a playlist
5. ✅ View your dashboard
6. ✅ Check out different user profiles

## Production Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# This creates a 'dist' folder ready for deployment
# Deploy this folder to your hosting service
```

## Environment Configuration for Production

Create `.env.production` or update during deployment:

```env
VITE_API_URL=https://your-production-backend-api.com/api/v1
```

---

**Happy streaming! 🎬**

For detailed documentation, see:
- 📖 [README.md](README.md)
- 🔧 [SETUP.md](SETUP.md)
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
