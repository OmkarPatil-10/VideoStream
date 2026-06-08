import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../api/api';
import Layout from '../components/Layout';

const UploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', videoFile: null, thumbnail: null,
  });
  const [thumbPreview, setThumbPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (name === 'thumbnail' && file) {
        setThumbPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoFile || !formData.thumbnail) {
      setError('Title, video file, and thumbnail are required');
      return;
    }
    setIsLoading(true);
    try {
      await videoAPI.publishVideo(formData);
      navigate('/my-videos');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Video
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Share your content with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6" id="upload-form">
          {error && (
            <div className="bg-accent-500/10 border border-accent-500/20 text-accent-300 px-4 py-3 rounded-xl text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* Video File */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Video File *</label>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-accent-500/30 transition-all duration-300 cursor-pointer group">
              <input type="file" name="videoFile" onChange={handleChange} accept="video/*" className="hidden" id="videoInput" required />
              <label htmlFor="videoInput" className="cursor-pointer">
                {formData.videoFile ? (
                  <div className="animate-scale-in">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-emerald-400 font-semibold text-sm">{formData.videoFile.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{(formData.videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-500/10 transition-colors">
                      <svg className="w-6 h-6 text-dark-400 group-hover:text-accent-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Click to upload video</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>MP4, WebM (max. 2GB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="Give your video a title" maxLength="100" className="input-field" required id="video-title" />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{formData.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Tell viewers about your video..." maxLength="5000" rows="4"
              className="input-field resize-none" required id="video-description" />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{formData.description.length}/5000</p>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Thumbnail *</label>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-accent-500/30 transition-all duration-300 cursor-pointer group">
              <input type="file" name="thumbnail" onChange={handleChange} accept="image/*" className="hidden" id="thumbnailInput" required />
              <label htmlFor="thumbnailInput" className="cursor-pointer">
                {thumbPreview ? (
                  <div className="animate-scale-in">
                    <img src={thumbPreview} alt="Thumbnail preview" className="max-h-32 rounded-lg mx-auto" />
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{formData.thumbnail.name}</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-dark-700/50 flex items-center justify-center mx-auto mb-2 group-hover:bg-accent-500/10 transition-colors">
                      <svg className="w-5 h-5 text-dark-400 group-hover:text-accent-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Upload thumbnail</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>JPG, PNG (1280×720 recommended)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 btn-secondary rounded-xl text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-3 btn-primary rounded-xl text-sm" id="publish-btn">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Publishing...
                </span>
              ) : 'Publish Video'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UploadPage;
