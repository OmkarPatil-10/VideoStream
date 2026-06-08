import React, { useEffect, useState } from 'react';
import { playlistAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';

const PlaylistsPage = () => {
  const { user } = useAuthStore();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user?._id) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const res = await playlistAPI.getUserPlaylists(user._id);
      setPlaylists(res.data.data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setIsCreating(true);
    try {
      await playlistAPI.createPlaylist({ name: name.trim(), description: description.trim() });
      setName(''); setDescription(''); setShowForm(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (playlistId) => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await playlistAPI.deletePlaylist(playlistId);
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Playlists
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Organize your video collections</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 btn-primary rounded-xl text-sm" id="create-playlist-btn">
            + Create
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-xl p-5 mb-6 animate-slide-down space-y-3" id="create-playlist-form">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" className="input-field" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input-field resize-none" rows="2" required />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 btn-ghost text-sm rounded-lg">Cancel</button>
              <button type="submit" disabled={isCreating} className="px-4 py-2 btn-primary text-sm rounded-lg">
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        )}

        {/* Playlists */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="h-52 skeleton rounded-2xl" />)}
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {playlists.map((pl) => (
              <div key={pl._id} className="glass-card-hover rounded-xl overflow-hidden group" id={`playlist-${pl._id}`}>
                <div className="h-28 bg-gradient-to-br from-accent-700/20 to-dark-800 relative flex items-center justify-center">
                  <svg className="w-10 h-10 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(pl._id)} className="p-1.5 bg-dark-900/80 hover:bg-accent-600 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{pl.name}</h3>
                  <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{pl.description}</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{pl.videos?.length || 0} videos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No playlists yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlaylistsPage;
