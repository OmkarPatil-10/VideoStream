import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-4rem)]">
          {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed bottom-6 left-6 z-30 w-12 h-12 bg-accent-600 hover:bg-accent-500 rounded-xl shadow-glow flex items-center justify-center text-white transition-all duration-300"
            id="mobile-menu-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="px-4 md:px-6 lg:px-8 py-6 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
