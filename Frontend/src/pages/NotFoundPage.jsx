import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300"
         style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl" />
      </div>
      <div className="text-center relative z-10 animate-slide-up">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="px-6 py-3 btn-primary rounded-xl text-sm inline-block" id="go-home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
